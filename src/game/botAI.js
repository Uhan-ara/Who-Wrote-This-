/**
 * Bot AI / Simulated Player Generator
 * Provides humorous, contextual, or varied sentence fragments
 * so the game can be tested thoroughly with 4-7 players.
 */

import { BOT_NAMES, BOT_SUGGESTIONS } from '../data/recipes.js';

/**
 * Returns a bot name that is not already in the players list.
 */
export function getUniqueBotName(existingPlayers) {
  const existingNames = new Set(existingPlayers.map((p) => p.nickname.toLowerCase()));
  for (const name of BOT_NAMES) {
    if (!existingNames.has(name.toLowerCase())) {
      return name;
    }
  }
  return `Bot ${existingPlayers.length + 1}`;
}

/**
 * Generates a humorous fragment for a given step type.
 */
export function generateBotFragment(stepType) {
  const pool = BOT_SUGGESTIONS[stepType] || BOT_SUGGESTIONS['WHO'];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
