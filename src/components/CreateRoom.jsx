import React, { useState } from 'react';
import { ArrowLeft, Sparkles, User } from 'lucide-react';

export default function CreateRoom({ onCreateRoom, onBack }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Please enter a nickname.');
      return;
    }
    onCreateRoom(nickname.trim());
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl mb-3">
            👑
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Create a New Room
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You will be the host and can start the game once 4–7 players join.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Nickname
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={20}
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Captain Mystery"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-medium text-slate-800 placeholder-slate-400 text-sm"
              />
            </div>
            {error && <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-display font-semibold text-base shadow-sm shadow-amber-500/30 transition-all cursor-pointer mt-2"
          >
            Create Room & Go to Lobby
          </button>
        </form>
      </div>
    </div>
  );
}
