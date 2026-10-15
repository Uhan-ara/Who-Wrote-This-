import React, { useState } from 'react';
import { Bot, ChevronUp, ChevronDown, Sparkles, UserCheck } from 'lucide-react';
import { GAME_PHASES } from '../game/types.js';

export default function SimulatedBar({
  state,
  activePlayerId,
  onSwitchSeat,
  onAutoSubmitBots,
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!state || state.status === GAME_PHASES.LANDING) return null;

  const bots = state.players.filter((p) => p.isBot);
  const activePlayer = state.players.find((p) => p.id === activePlayerId);

  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-6 sm:w-96 z-50">
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 overflow-hidden text-xs">
        {/* Toggle Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Simulated Multiplayer Bar</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[11px]">Seat: {activePlayer?.nickname}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Content */}
        {isOpen && (
          <div className="p-3.5 space-y-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Switch Player Perspective:</span>
                <span className="text-slate-500">({state.players.length} players)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.players.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSwitchSeat(p.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      p.id === activePlayerId
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p.isHost ? '👑 ' : ''}{p.nickname} {p.isBot ? '🤖' : '👤'}
                  </button>
                ))}
              </div>
            </div>

            {state.status === GAME_PHASES.SENTENCE_CONSTRUCTION && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-slate-400 text-[11px]">
                  Pending Bots: {bots.filter((b) => !state.chains.find((c) => c.currentHolderId === b.id)?.fragments.length > state.currentStepIndex).length}
                </span>
                <button
                  onClick={onAutoSubmitBots}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Auto-Submit Bots</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
