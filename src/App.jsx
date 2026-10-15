import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import CreateRoom from './components/CreateRoom.jsx';
import JoinRoom from './components/JoinRoom.jsx';
import Lobby from './components/Lobby.jsx';
import SentenceInput from './components/SentenceInput.jsx';
import FinalSentence from './components/FinalSentence.jsx';
import SimulatedBar from './components/SimulatedBar.jsx';

import {
  createRoom,
  addPlayer,
  removePlayer,
  startGame,
  submitFragment,
  advanceStep,
  resetToLobby,
} from './game/engine.js';
import { getPlayerView } from './game/viewFilter.js';
import { getUniqueBotName, generateBotFragment } from './game/botAI.js';
import { GAME_PHASES } from './game/types.js';

export default function App() {
  // Authoritative Game Engine State (simulates backend room record)
  const [gameState, setGameState] = useState(null);

  // Current client viewing seat
  const [activePlayerId, setActivePlayerId] = useState(null);

  // Landing / Sub-view navigation
  const [navigationView, setNavigationView] = useState(GAME_PHASES.LANDING);

  // Notification message
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Automated/Quick Demo helper
  const handleQuickDemo = useCallback(() => {
    let state = createRoom('Player One');
    state = addPlayer(state, 'Captain Waffles', true);
    state = addPlayer(state, 'Barnaby', true);
    state = addPlayer(state, 'PixelPanda', true);

    setGameState(state);
    setActivePlayerId(state.players[0].id);
    setNavigationView(GAME_PHASES.LOBBY);
    showToast('Created 4-player demo match!');
  }, []);

  // Check URL parameters for ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      handleQuickDemo();
    }
  }, [handleQuickDemo]);

  // Handle Room Creation
  const handleCreateRoom = (nickname) => {
    const newState = createRoom(nickname);
    setGameState(newState);
    setActivePlayerId(newState.players[0].id);
    setNavigationView(GAME_PHASES.LOBBY);
    showToast(`Room created: ${newState.roomCode}`);
  };

  // Handle Room Join
  const handleJoinRoom = (code, nickname) => {
    if (!gameState || gameState.roomCode !== code) {
      // In local mode, simulate joining the active room or create a dummy room if none
      if (!gameState) {
        let state = createRoom('Host Player', undefined, code);
        state = addPlayer(state, nickname, false);
        setGameState(state);
        setActivePlayerId(state.players[1].id);
        setNavigationView(GAME_PHASES.LOBBY);
        showToast(`Joined room ${code}`);
        return;
      }
      showToast(`Room "${code}" not found in local session.`);
      return;
    }

    try {
      const updated = addPlayer(gameState, nickname, false);
      const newPlayer = updated.players[updated.players.length - 1];
      setGameState(updated);
      setActivePlayerId(newPlayer.id);
      setNavigationView(GAME_PHASES.LOBBY);
      showToast(`Welcome to room ${code}!`);
    } catch (err) {
      showToast(err.message);
    }
  };

  // Add Simulated Bot
  const handleAddBot = () => {
    if (!gameState) return;
    try {
      const botName = getUniqueBotName(gameState.players);
      const updated = addPlayer(gameState, botName, true);
      setGameState(updated);
      showToast(`Added simulated bot ${botName}`);
    } catch (err) {
      showToast(err.message);
    }
  };

  // Remove Player/Bot
  const handleRemovePlayer = (playerId) => {
    if (!gameState) return;
    const updated = removePlayer(gameState, playerId);
    setGameState(updated);
    if (activePlayerId === playerId && updated.players.length > 0) {
      setActivePlayerId(updated.players[0].id);
    }
  };

  // Start Game
  const handleStartGame = () => {
    if (!gameState) return;
    try {
      const updated = startGame(gameState);
      setGameState(updated);
      setNavigationView(GAME_PHASES.SENTENCE_CONSTRUCTION);
    } catch (err) {
      showToast(err.message);
    }
  };

  // Submit fragment for active player
  const handleSubmitFragment = (text) => {
    if (!gameState || !activePlayerId) return;
    try {
      let updated = submitFragment(gameState, activePlayerId, text);

      // Automatically have bots submit their fragments for a smooth single-tester flow
      const currentStepType = updated.recipe[updated.currentStepIndex].label;
      for (const player of updated.players) {
        if (player.isBot) {
          const chain = updated.chains.find((c) => c.currentHolderId === player.id);
          if (chain && chain.fragments.length <= updated.currentStepIndex) {
            const botText = generateBotFragment(currentStepType);
            updated = submitFragment(updated, player.id, botText);
          }
        }
      }

      setGameState(updated);
    } catch (err) {
      showToast(err.message);
    }
  };

  // Auto-submit all pending bots on demand
  const handleAutoSubmitBots = () => {
    if (!gameState || gameState.status !== GAME_PHASES.SENTENCE_CONSTRUCTION) return;
    try {
      let updated = { ...gameState };
      const currentStepType = updated.recipe[updated.currentStepIndex].label;

      for (const player of updated.players) {
        if (player.isBot) {
          const chain = updated.chains.find((c) => c.currentHolderId === player.id);
          if (chain && chain.fragments.length <= updated.currentStepIndex) {
            const botText = generateBotFragment(currentStepType);
            updated = submitFragment(updated, player.id, botText);
          }
        }
      }

      setGameState(updated);
      showToast('Simulated bot fragments submitted!');
    } catch (err) {
      showToast(err.message);
    }
  };

  // Advance step (pass fragments or reconstruct)
  const handleAdvanceStep = () => {
    if (!gameState) return;
    try {
      const updated = advanceStep(gameState);
      setGameState(updated);
      if (updated.status === GAME_PHASES.FINAL_SENTENCE) {
        setNavigationView(GAME_PHASES.FINAL_SENTENCE);
      }
    } catch (err) {
      showToast(err.message);
    }
  };

  // Play Again
  const handlePlayAgain = () => {
    if (!gameState) return;
    const updated = resetToLobby(gameState);
    setGameState(updated);
    setNavigationView(GAME_PHASES.LOBBY);
  };

  // Leave Room
  const handleLeaveRoom = () => {
    setGameState(null);
    setActivePlayerId(null);
    setNavigationView(GAME_PHASES.LANDING);
  };

  // Switch perspective seat
  const handleSwitchSeat = (playerId) => {
    setActivePlayerId(playerId);
    const p = gameState?.players.find((pl) => pl.id === playerId);
    if (p) {
      showToast(`Switched view to ${p.nickname}`);
    }
  };

  // STRICT SECURITY FILTER:
  // Derive the player-specific view.
  // The client components NEVER receive raw authoritative `gameState`!
  const playerView = useMemo(() => {
    if (!gameState || !activePlayerId) return null;
    return getPlayerView(gameState, activePlayerId);
  }, [gameState, activePlayerId]);

  // Current effective phase
  const currentPhase = gameState ? gameState.status : navigationView;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Navbar
        playerView={playerView}
        allPlayers={gameState ? gameState.players : []}
        activePlayerId={activePlayerId}
        onSwitchSeat={handleSwitchSeat}
        onLeaveRoom={handleLeaveRoom}
        phase={currentPhase}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPhase === GAME_PHASES.LANDING && (
          <LandingPage
            onCreateRoomClick={() => setNavigationView(GAME_PHASES.CREATE_ROOM)}
            onJoinRoomClick={() => setNavigationView(GAME_PHASES.JOIN_ROOM)}
            onQuickDemoClick={handleQuickDemo}
          />
        )}

        {currentPhase === GAME_PHASES.CREATE_ROOM && (
          <CreateRoom
            onCreateRoom={handleCreateRoom}
            onBack={() => setNavigationView(GAME_PHASES.LANDING)}
          />
        )}

        {currentPhase === GAME_PHASES.JOIN_ROOM && (
          <JoinRoom
            onJoinRoom={handleJoinRoom}
            onBack={() => setNavigationView(GAME_PHASES.LANDING)}
            defaultRoomCode={gameState?.roomCode || ''}
          />
        )}

        {currentPhase === GAME_PHASES.LOBBY && (
          <Lobby
            playerView={playerView}
            onStartGame={handleStartGame}
            onAddBot={handleAddBot}
            onRemovePlayer={handleRemovePlayer}
          />
        )}

        {currentPhase === GAME_PHASES.SENTENCE_CONSTRUCTION && (
          <SentenceInput
            playerView={playerView}
            onSubmitFragment={handleSubmitFragment}
            onAutoSubmitBots={handleAutoSubmitBots}
            onAdvanceStep={handleAdvanceStep}
          />
        )}

        {currentPhase === GAME_PHASES.FINAL_SENTENCE && (
          <FinalSentence
            playerView={playerView}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleLeaveRoom}
          />
        )}
      </main>

      {/* Simulated Multiplayer Helper Drawer (for local testing) */}
      {gameState && (
        <SimulatedBar
          state={gameState}
          activePlayerId={activePlayerId}
          onSwitchSeat={handleSwitchSeat}
          onAutoSubmitBots={handleAutoSubmitBots}
        />
      )}
    </div>
  );
}
