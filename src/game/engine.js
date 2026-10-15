/**
 * Pure Game Engine for Telephone Game
 * Handles room creation, player joins/leaves, fragment passing, and sentence reconstruction.
 * Completely decoupled from React and UI rendering.
 */

import { DEFAULT_RECIPE } from '../data/recipes.js';
import { GAME_PHASES, ROOM_LIMITS } from './types.js';

/**
 * Generates an intuitive 4-character room code.
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Creates a fresh room state.
 */
export function createRoom(hostNickname, recipe = DEFAULT_RECIPE, roomCode = null) {
  const hostId = 'p-' + Math.random().toString(36).substring(2, 9);
  const code = roomCode || generateRoomCode();

  return {
    roomCode: code,
    hostId,
    status: GAME_PHASES.LOBBY,
    recipe,
    currentStepIndex: 0,
    players: [
      {
        id: hostId,
        nickname: hostNickname.trim() || 'Host Player',
        isHost: true,
        isBot: false,
        connected: true,
      },
    ],
    chains: [],
    reconstructedStories: [],
  };
}

/**
 * Adds a new player to an existing room state.
 */
export function addPlayer(state, nickname, isBot = false) {
  if (state.players.length >= ROOM_LIMITS.MAX_PLAYERS) {
    throw new Error(`Room is full (max ${ROOM_LIMITS.MAX_PLAYERS} players).`);
  }
  if (state.status !== GAME_PHASES.LOBBY) {
    throw new Error('Cannot join a game already in progress.');
  }

  const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
  const cleanNickname = (nickname || (isBot ? 'Bot' : 'Player')).trim();

  return {
    ...state,
    players: [
      ...state.players,
      {
        id: playerId,
        nickname: cleanNickname,
        isHost: false,
        isBot,
        connected: true,
      },
    ],
  };
}

/**
 * Removes a player from the room.
 */
export function removePlayer(state, playerId) {
  const updatedPlayers = state.players.filter((p) => p.id !== playerId);
  let newHostId = state.hostId;

  if (newHostId === playerId && updatedPlayers.length > 0) {
    newHostId = updatedPlayers[0].id;
    updatedPlayers[0] = { ...updatedPlayers[0], isHost: true };
  }

  return {
    ...state,
    hostId: newHostId,
    players: updatedPlayers,
  };
}

/**
 * Validates whether the game can be started.
 */
export function canStartGame(state) {
  return (
    state.status === GAME_PHASES.LOBBY &&
    state.players.length >= ROOM_LIMITS.MIN_PLAYERS &&
    state.players.length <= ROOM_LIMITS.MAX_PLAYERS
  );
}

/**
 * Starts the sentence construction phase.
 * Creates one chain per player, initially held by that player.
 */
export function startGame(state) {
  if (!canStartGame(state)) {
    throw new Error(`Need between ${ROOM_LIMITS.MIN_PLAYERS} and ${ROOM_LIMITS.MAX_PLAYERS} players to start.`);
  }

  const initialChains = state.players.map((player, idx) => ({
    id: `chain-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
    originalAuthorId: player.id,
    currentHolderId: player.id,
    fragments: [],
  }));

  return {
    ...state,
    status: GAME_PHASES.SENTENCE_CONSTRUCTION,
    currentStepIndex: 0,
    chains: initialChains,
    reconstructedStories: [],
  };
}

/**
 * Submits a fragment for the currently held chain of a specific player.
 */
export function submitFragment(state, playerId, text) {
  if (state.status !== GAME_PHASES.SENTENCE_CONSTRUCTION) {
    throw new Error('Game is not in sentence construction phase.');
  }

  const trimmed = (text || '').trim();
  if (!trimmed) {
    throw new Error('Fragment content cannot be empty.');
  }

  const player = state.players.find((p) => p.id === playerId);
  if (!player) {
    throw new Error('Player not found in this room.');
  }

  const currentStep = state.recipe[state.currentStepIndex];

  // Find the chain currently held by this player
  const chainIndex = state.chains.findIndex((c) => c.currentHolderId === playerId);
  if (chainIndex === -1) {
    throw new Error('No active chain assigned to this player.');
  }

  const targetChain = state.chains[chainIndex];

  // Prevent duplicate submissions in the same step
  if (targetChain.fragments.length > state.currentStepIndex) {
    throw new Error('Player has already submitted for this step.');
  }

  const newFragment = {
    stepIndex: state.currentStepIndex,
    type: currentStep.label,
    typeId: currentStep.id,
    text: trimmed,
    authorId: playerId,
    authorNickname: player.nickname,
    timestamp: Date.now(),
  };

  const updatedChains = [...state.chains];
  updatedChains[chainIndex] = {
    ...targetChain,
    fragments: [...targetChain.fragments, newFragment],
  };

  return {
    ...state,
    chains: updatedChains,
  };
}

/**
 * Checks if all players have submitted a fragment for the current step.
 */
export function isStepComplete(state) {
  if (state.status !== GAME_PHASES.SENTENCE_CONSTRUCTION) return false;
  return state.chains.every((c) => c.fragments.length > state.currentStepIndex);
}

/**
 * Shuffles/passes chains to players for the next round.
 * Guarantees that:
 * 1. No player receives the chain they just contributed to.
 * 2. Each player receives exactly one chain.
 * 3. Minimizes repeat authors whenever possible.
 */
export function computeNextHolders(chains, players) {
  const playerIds = players.map((p) => p.id);
  const n = playerIds.length;

  if (n < 2) return playerIds;

  // We want an assignment of chain[i] -> playerIds[j]
  // where playerIds[j] != chain[i].lastContributor
  const lastContributors = chains.map((c) => {
    const lastFrag = c.fragments[c.fragments.length - 1];
    return lastFrag ? lastFrag.authorId : c.currentHolderId;
  });

  // Try randomized derangement search with backtracking / attempts
  for (let attempt = 0; attempt < 50; attempt++) {
    // Fisher-Yates shuffle of players
    const candidateAssignment = [...playerIds];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidateAssignment[i], candidateAssignment[j]] = [candidateAssignment[j], candidateAssignment[i]];
    }

    // Check if valid: candidateAssignment[i] !== lastContributors[i]
    const valid = candidateAssignment.every((assignedPlayer, idx) => {
      const prevAuthor = lastContributors[idx];
      return assignedPlayer !== prevAuthor;
    });

    if (valid) {
      return candidateAssignment;
    }
  }

  // Deterministic cyclic shift fallback (always guaranteed to avoid currentHolder if n >= 2)
  // Shift by 1: chain i goes to player (i + 1) % n
  const fallback = [];
  for (let i = 0; i < n; i++) {
    const prevHolderIndex = playerIds.indexOf(chains[i].currentHolderId);
    const nextHolderIndex = (prevHolderIndex + 1) % n;
    fallback.push(playerIds[nextHolderIndex]);
  }
  return fallback;
}

/**
 * Assembles the fragments of a chain into a natural English sentence.
 */
export function assembleSentence(fragments) {
  if (!fragments || fragments.length === 0) return '';
  const parts = fragments.map((f) => f.text.trim());
  let sentence = parts.join(' ');

  // Capitalize first character
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  // Ensure trailing punctuation
  if (!/[.!?]$/.test(sentence)) {
    sentence += '.';
  }

  return sentence;
}

/**
 * Advances to the next step, passing fragments, or transitions to FINAL_SENTENCE.
 */
export function advanceStep(state) {
  if (!isStepComplete(state)) {
    throw new Error('Cannot advance step until all players have submitted.');
  }

  const nextStepIndex = state.currentStepIndex + 1;

  // If there are more fragment steps in the recipe:
  if (nextStepIndex < state.recipe.length) {
    const nextHolders = computeNextHolders(state.chains, state.players);

    const updatedChains = state.chains.map((chain, idx) => ({
      ...chain,
      currentHolderId: nextHolders[idx],
    }));

    return {
      ...state,
      currentStepIndex: nextStepIndex,
      chains: updatedChains,
    };
  }

  // Recipe is complete! Reconstruct all final sentences.
  const reconstructedStories = state.chains.map((chain) => {
    const originalPlayer = state.players.find((p) => p.id === chain.originalAuthorId);
    return {
      chainId: chain.id,
      originalPlayer: originalPlayer ? originalPlayer.nickname : 'Unknown Player',
      fullSentence: assembleSentence(chain.fragments),
      fragments: chain.fragments.map((f) => ({
        type: f.type,
        text: f.text,
        authorNickname: f.authorNickname,
      })),
    };
  });

  return {
    ...state,
    status: GAME_PHASES.FINAL_SENTENCE,
    reconstructedStories,
  };
}

/**
 * Resets the room back to LOBBY to play another round.
 */
export function resetToLobby(state) {
  return {
    ...state,
    status: GAME_PHASES.LOBBY,
    currentStepIndex: 0,
    chains: [],
    reconstructedStories: [],
  };
}
