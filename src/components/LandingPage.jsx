import React from 'react';
import { PlusCircle, LogIn, Play, Sparkles, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export default function LandingPage({
  onCreateRoomClick,
  onJoinRoomClick,
  onQuickDemoClick,
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center text-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-5 border border-amber-200 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        V1 Prototype • Sentence Passing
      </div>

      {/* Main Title */}
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-none mb-4">
        The Telephone <span className="text-amber-500">Game</span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-600 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
        Pass sentence fragments in secret! Each player only sees the immediately preceding clue. Watch a simple sentence mutate into hilarious chaos.
      </p>

      {/* Primary Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 mb-10">
        <button
          onClick={onCreateRoomClick}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-display font-semibold text-lg shadow-md shadow-amber-500/25 transition-all transform active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Room</span>
        </button>

        <button
          onClick={onJoinRoomClick}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-display font-semibold text-lg border-2 border-slate-200 shadow-xs transition-all transform active:scale-98 cursor-pointer"
        >
          <LogIn className="w-5 h-5 text-slate-500" />
          <span>Join with Room Code</span>
        </button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-2 text-slate-400 font-medium tracking-wider">
              Instant Local Test
            </span>
          </div>
        </div>

        <button
          onClick={onQuickDemoClick}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 active:bg-indigo-100 text-indigo-700 font-semibold text-sm border border-indigo-200 transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
          <span>Quick 4-Player Match (You + 3 Bots)</span>
        </button>
      </div>

      {/* How it Works Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs text-left">
        <h2 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <span>How It Works</span>
          <span className="text-xs font-normal text-slate-400">4 to 7 Players</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="text-xl mb-1.5 font-bold">1️⃣ WHO</div>
            <div className="text-xs font-bold text-amber-900 mb-1">Start a Character</div>
            <p className="text-xs text-slate-600 leading-snug">
              Every player writes the first fragment in parallel (e.g. <em>"A vampire"</em>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div className="text-xl mb-1.5 font-bold">2️⃣ PASS</div>
            <div className="text-xs font-bold text-indigo-900 mb-1">Secret Passing</div>
            <p className="text-xs text-slate-600 leading-snug">
              You only see the single clue from the previous person (e.g. <em>"wearing Crocs"</em>). No full sentence!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="text-xl mb-1.5 font-bold">3️⃣ REVEAL</div>
            <div className="text-xs font-bold text-rose-900 mb-1">Final Stories</div>
            <p className="text-xs text-slate-600 leading-snug">
              All fragments are joined back together. Read the hilarious mutated results!
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero Leaks:</strong> Players never receive hidden chain data. Engineered for realtime backend sync.
          </span>
        </div>
      </div>
    </div>
  );
}
