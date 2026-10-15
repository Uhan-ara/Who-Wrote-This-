import React, { useState } from 'react';
import { Copy, Check, User, Users, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { GAME_PHASES } from '../game/types.js';

export default function Navbar({
  playerView,
  allPlayers = [],
  activePlayerId,
  onSwitchSeat,
  onLeaveRoom,
  phase,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (playerView?.roomCode) {
      navigator.clipboard?.writeText(playerView.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isInGameOrLobby =
    phase === GAME_PHASES.LOBBY ||
    phase === GAME_PHASES.SENTENCE_CONSTRUCTION ||
    phase === GAME_PHASES.FINAL_SENTENCE;

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-amber-200">
            📞
          </div>
          <div>
            <span className="font-display font-bold text-lg text-slate-800 tracking-tight block leading-tight">
              Telephone Game
            </span>
            <span className="text-xs text-slate-400 font-medium">Mutating Story Party</span>
          </div>
        </div>

        {/* Room & Player Info */}
        {isInGameOrLobby && playerView && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Room Code Badge */}
            <button
              onClick={handleCopyCode}
              title="Click to copy room code"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold tracking-wider transition-colors border border-slate-200 cursor-pointer"
            >
              <span className="text-slate-400 font-normal">ROOM:</span>
              <span className="font-mono font-bold text-indigo-600">{playerView.roomCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Active Player / Perspective Switcher */}
            {allPlayers.length > 1 ? (
              <div className="relative flex items-center">
                <select
                  value={activePlayerId || ''}
                  onChange={(e) => onSwitchSeat && onSwitchSeat(e.target.value)}
                  className="text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 rounded-lg py-1.5 pl-2 pr-6 appearance-none cursor-pointer hover:bg-amber-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  title="Switch player seat (for local simulated multiplayer)"
                >
                  {allPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.isHost ? '👑 ' : ''}{p.nickname} {p.isBot ? '(Bot)' : ''} {p.id === activePlayerId ? '• You' : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 text-amber-700 text-[10px]">▼</div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>{playerView.activePlayer?.nickname || 'Player'}</span>
              </div>
            )}

            {/* Exit Room */}
            <button
              onClick={onLeaveRoom}
              className="text-xs text-slate-500 hover:text-rose-600 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
              title="Leave Room"
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
