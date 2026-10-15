import React, { useState } from 'react';
import { Copy, Check, UserPlus, Play, Bot, Crown, Trash2, AlertCircle } from 'lucide-react';
import { ROOM_LIMITS } from '../game/types.js';

export default function Lobby({
  playerView,
  onStartGame,
  onAddBot,
  onRemovePlayer,
}) {
  const [copied, setCopied] = useState(false);

  const {
    roomCode,
    isHost,
    players = [],
    canStart,
  } = playerView || {};

  const playerCount = players.length;
  const isFull = playerCount >= ROOM_LIMITS.MAX_PLAYERS;
  const needsMore = playerCount < ROOM_LIMITS.MIN_PLAYERS;

  const handleCopy = () => {
    if (roomCode) {
      navigator.clipboard?.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fun color palette for player avatars
  const avatarColors = [
    'from-amber-400 to-orange-500',
    'from-indigo-400 to-purple-600',
    'from-emerald-400 to-teal-600',
    'from-rose-400 to-pink-600',
    'from-cyan-400 to-blue-600',
    'from-fuchsia-400 to-rose-500',
    'from-lime-400 to-emerald-600',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Room Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs mb-6 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wider uppercase mb-2">
          Room Code
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="font-mono font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-wider">
            {roomCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            title="Copy room code"
            aria-label="Copy room code"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Share this 4-letter code with friends or add simulated bots to test locally.
        </p>
      </div>

      {/* Players List Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">
              Lobby Players
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                needsMore
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {playerCount} / {ROOM_LIMITS.MAX_PLAYERS}
            </span>
          </div>

          {/* Add Bot Action (for local simulation/testing) */}
          {isHost && !isFull && (
            <button
              onClick={onAddBot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>+ Add Bot</span>
            </button>
          )}
        </div>

        {/* Player List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {players.map((player, idx) => {
            const gradient = avatarColors[idx % avatarColors.length];
            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${gradient} text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0`}
                  >
                    {player.isBot ? '🤖' : player.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-1.5">
                      <span>{player.nickname}</span>
                      {player.isHost && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold inline-flex items-center gap-0.5">
                          <Crown className="w-3 h-3 text-amber-600 inline" />
                          Host
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {player.isBot ? 'Simulated Player' : 'Ready'}
                    </span>
                  </div>
                </div>

                {/* Remove Bot button (host only, bots only) */}
                {isHost && player.isBot && onRemovePlayer && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove bot"
                    aria-label={`Remove bot ${player.nickname}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Empty slot placeholders */}
          {Array.from({ length: Math.max(0, ROOM_LIMITS.MIN_PLAYERS - playerCount) }).map(
            (_, emptyIdx) => (
              <div
                key={`empty-${emptyIdx}`}
                className="flex items-center justify-center p-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-medium"
              >
                Waiting for player...
              </div>
            )
          )}
        </div>

        {/* Player requirements hint */}
        {needsMore && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Need at least <strong>{ROOM_LIMITS.MIN_PLAYERS} players</strong> to start the game ({ROOM_LIMITS.MIN_PLAYERS - playerCount} more required).
              {isHost && (
                <button
                  onClick={onAddBot}
                  className="ml-1.5 underline font-bold hover:text-amber-700 cursor-pointer"
                >
                  Click here to add bots!
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Start Game Action */}
      <div className="flex flex-col items-center gap-2">
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-2.5 transition-all shadow-md ${
              canStart
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-500/25 cursor-pointer transform active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Game</span>
          </button>
        ) : (
          <div className="w-full py-4 px-6 rounded-2xl bg-slate-100 text-slate-500 text-center text-sm font-semibold border border-slate-200">
            Waiting for the host to start the game...
          </div>
        )}
      </div>
    </div>
  );
}
