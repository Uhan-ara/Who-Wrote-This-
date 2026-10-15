import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, Sparkles, AlertTriangle, ArrowRight, Bot } from 'lucide-react';

export default function SentenceInput({
  playerView,
  onSubmitFragment,
  onAutoSubmitBots,
  onAdvanceStep,
}) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const {
    currentStepType,
    currentPrompt,
    currentPlaceholder,
    previousFragmentText,
    hasSubmitted,
    stepIndex = 0,
    totalSteps = 5,
    players = [],
    submittedCount = 0,
    allSubmitted = false,
    isHost = false,
    activePlayer,
  } = playerView || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please write a fragment to continue the story.');
      return;
    }
    onSubmitFragment(inputText.trim());
    setInputText('');
    setError('');
  };

  // Step icons/colors
  const stepMeta = {
    WHO: { icon: '🧙', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
    WHEN: { icon: '⏰', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    WHERE: { icon: '📍', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    'DO WHAT': { icon: '⚡', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    'WITH WHOM': { icon: '🎭', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  }[currentStepType] || { icon: '📝', badge: 'bg-slate-100 text-slate-800 border-slate-200' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>
            Step {stepIndex + 1} of {totalSteps}: {currentStepType}
          </span>
          <span>
            {submittedCount} / {players.length} Submitted
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Contribution Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
        {/* Step Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stepMeta.badge}`}>
            <span>{stepMeta.icon}</span>
            <span>{currentStepType}</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Player: <strong className="text-slate-700">{activePlayer?.nickname}</strong>
          </span>
        </div>

        {/* Prompt Header */}
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2">
          {currentPrompt}
        </h2>

        {/* PREVIOUS FRAGMENT (Crucial hidden information mechanic) */}
        {previousFragmentText ? (
          <div className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200/90 text-left relative overflow-hidden">
            <div className="text-[11px] font-bold text-amber-800/80 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>📩 Previous Player Wrote:</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-amber-950 tracking-tight">
              "{previousFragmentText}"
            </div>
            <p className="text-xs text-amber-700/80 mt-2">
              ⚠️ You only know this clue! Continue the sentence based strictly on this fragment.
            </p>
          </div>
        ) : (
          <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Starting Step:</strong> You are writing the beginning fragment (WHO) for this story chain!
            </span>
          </div>
        )}

        {/* Submission Form OR Submitted Confirmation */}
        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Contribution
              </label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError('');
                }}
                placeholder={currentPlaceholder || 'Type your fragment here...'}
                autoFocus
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-medium text-slate-800 text-base placeholder-slate-400 resize-none"
              />
              {error && <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-display font-bold text-base shadow-sm shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Submit Fragment</span>
            </button>
          </form>
        ) : (
          <div className="mt-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Fragment Submitted!</div>
              <div className="text-xs text-emerald-700">
                Waiting for remaining players to finish writing...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Players Progress Status List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Player Status
          </span>
          {/* Helper button for simulated bots */}
          {onAutoSubmitBots && !allSubmitted && (
            <button
              onClick={onAutoSubmitBots}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Auto-Fill Pending Bots</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {players.map((p) => (
            <div
              key={p.id}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                p.hasSubmitted
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="truncate mr-1">{p.nickname}</span>
              {p.hasSubmitted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-slate-400 shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Pass Trigger */}
      {allSubmitted && (
        <div className="p-5 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-center animate-fade-in">
          <div className="font-display font-bold text-lg text-indigo-950 mb-1">
            Everyone has submitted their fragment! 🎉
          </div>
          <p className="text-xs text-indigo-700 mb-4">
            {stepIndex + 1 < totalSteps
              ? 'Fragments will be passed to other players in secret.'
              : 'All fragments collected! Ready to assemble the final stories.'}
          </p>
          <button
            onClick={onAdvanceStep}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-display font-bold text-base shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
          >
            <span>{stepIndex + 1 < totalSteps ? 'Pass Fragments to Next Players' : 'Reconstruct & Reveal Stories!'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
