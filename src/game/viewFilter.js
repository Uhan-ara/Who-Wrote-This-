/**
 * Visibility and Security Filter
 *
 * Produces a strictly sanitized, player-scoped projection of the game state.
 * Any client or UI receives ONLY this projected view.
 *
 * In SENTENCE_CONSTRUCTION:
 * - A player receives ONLY the immediately previous fragment text of their assigned chain.
 * - They do NOT receive earlier fragments, other chains, or other players' drafts.
 * - They only receive public statuses (e.g. who has submitted).
 */

import { GAME_PHASES } from './types.js';

export function getPlayerView(state, playerId) {
  if (!state) return null;

  const activePlayer = state.players.find((p) => p.id === playerId) || null;
  const isHost = activePlayer ? activePlayer.isHost : false;

  // Base public room information
  const baseView = {
    roomCode: state.roomCode,
    status: state.status,
    hostId: state.hostId,
    isHost,
    activePlayer,
    totalPlayers: state.players.length,
    players: state.players.map((p) => {
      // Find submission status without revealing content
      const playerChain = state.chains.find((c) => c.currentHolderId === p.id);
      const hasSubmitted =
        state.status === GAME_PHASES.SENTENCE_CONSTRUCTION && playerChain
          ? playerChain.fragments.length > state.currentStepIndex
          : false;

      return {
        id: p.id,
        nickname: p.nickname,
        isHost: p.isHost,
        isBot: p.isBot,
        hasSubmitted,
      };
    }),
  };

  // Phase-specific projections:
  if (state.status === GAME_PHASES.LOBBY) {
    return {
      ...baseView,
      minPlayers: 4,
      maxPlayers: 7,
      canStart: state.players.length >= 4 && state.players.length <= 7,
    };
  }

  if (state.status === GAME_PHASES.SENTENCE_CONSTRUCTION) {
    const currentStep = state.recipe[state.currentStepIndex];
    const assignedChain = state.chains.find((c) => c.currentHolderId === playerId);

    // CRITICAL SECURITY / DATA ISOLATION:
    // Only inspect the chain currently held by this specific player.
    let previousFragmentText = null;
    let hasSubmittedCurrentStep = false;

    if (assignedChain) {
      hasSubmittedCurrentStep = assignedChain.fragments.length > state.currentStepIndex;

      // The prompt text given to the player is strictly the last fragment added to this chain
      if (assignedChain.fragments.length > 0) {
        const lastFragment = assignedChain.fragments[assignedChain.fragments.length - 1];
        previousFragmentText = lastFragment.text;
      }
    }

    const submittedCount = state.chains.filter((c) => c.fragments.length > state.currentStepIndex).length;

    return {
      ...baseView,
      stepIndex: state.currentStepIndex,
      totalSteps: state.recipe.length,
      currentStepType: currentStep.label,
      currentPrompt: currentStep.prompt,
      currentPlaceholder: currentStep.placeholder,
      // The single visible fragment passed from the prior contributor (or null if first step WHO)
      previousFragmentText,
      hasSubmitted: hasSubmittedCurrentStep,
      submittedCount,
      allSubmitted: submittedCount === state.players.length,
    };
  }

  if (state.status === GAME_PHASES.FINAL_SENTENCE) {
    // In final sentence reveal, completed reconstructed stories are public
    return {
      ...baseView,
      reconstructedStories: state.reconstructedStories || [],
    };
  }

  return baseView;
}
