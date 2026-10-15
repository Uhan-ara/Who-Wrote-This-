import React, { useState } from 'react';
import { RotateCcw, Home, Sparkles, BookOpen, ChevronRight, User } from 'lucide-react';

export default function FinalSentence({
  playerView,
  onPlayAgain,
  onBackToHome,
}) {
  const { reconstructedStories = [] } = playerView || {};
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Stories Reconstructed!
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          The Final <span className="text-amber-500">Telephone Stories</span>
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto mt-2">
          Here is how your secret fragments mutated from the first clue to the finished sentence!
        </p>
      </div>

      {/* Story Tabs (if multiple stories) */}
      {reconstructedStories.length > 1 && (
        <div className="flex items-center sm:justify-center flex-wrap gap-2 pb-3 mb-6">
          {reconstructedStories.map((story, idx) => (
            <button
              key={story.chainId}
              onClick={() => setSelectedStoryIndex(idx)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedStoryIndex === idx
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Story #{idx + 1} ({story.originalPlayer})
            </button>
          ))}
        </div>
      )}

      {/* Selected Story Card */}
      {reconstructedStories[selectedStoryIndex] && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
            Completed Sentence #{selectedStoryIndex + 1}
          </div>

          {/* Full Reconstructed Sentence Callout */}
          <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-slate-900 font-display font-bold text-2xl sm:text-3xl leading-snug tracking-tight mb-8">
            "{reconstructedStories[selectedStoryIndex].fullSentence}"
          </div>

          {/* Step-by-Step Chain Breakdown */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Step-by-Step Evolution</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {reconstructedStories[selectedStoryIndex].fragments.map((frag, fIdx) => (
                <div key={fIdx} className="relative group">
                  {/* Bullet Marker */}
                  <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-xs" />

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {frag.type}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>written by <strong>{frag.authorNickname}</strong></span>
                      </span>
                    </div>
                    <div className="text-slate-800 font-medium text-sm">
                      "{frag.text}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Stories Summary Grid (if user wants to see all at once) */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          All Completed Stories ({reconstructedStories.length})
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {reconstructedStories.map((story, idx) => (
            <div
              key={story.chainId}
              onClick={() => setSelectedStoryIndex(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedStoryIndex === idx
                  ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-300/40'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-slate-600">Story #{idx + 1}</span>
                <span>Started by {story.originalPlayer}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                "{story.fullSentence}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-display font-bold text-base shadow-sm shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Round</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>Leave Room</span>
        </button>
      </div>
    </div>
  );
}
