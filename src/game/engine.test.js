import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addPlayer,
  advanceStep,
  assembleSentence,
  canStartGame,
  computeNextHolders,
  createRoom,
  isStepComplete,
  startGame,
  submitFragment,
} from './engine.js';
import { GAME_PHASES } from './types.js';
import { getPlayerView } from './viewFilter.js';

test('createRoom creates a room in LOBBY with host player', () => {
  const room = createRoom('Alice');
  assert.equal(room.status, GAME_PHASES.LOBBY);
  assert.equal(room.players.length, 1);
  assert.equal(room.players[0].nickname, 'Alice');
  assert.equal(room.players[0].isHost, true);
  assert.equal(room.roomCode.length, 4);
});

test('addPlayer enforces max 7 players limit', () => {
  let room = createRoom('P1');
  for (let i = 2; i <= 7; i++) {
    room = addPlayer(room, `P${i}`);
  }
  assert.equal(room.players.length, 7);
  assert.throws(() => addPlayer(room, 'P8'), /Room is full/);
});

test('canStartGame requires at least 4 players', () => {
  let room = createRoom('P1');
  assert.equal(canStartGame(room), false);
  room = addPlayer(room, 'P2');
  room = addPlayer(room, 'P3');
  assert.equal(canStartGame(room), false);
  room = addPlayer(room, 'P4');
  assert.equal(canStartGame(room), true);
});

test('computeNextHolders derangement guarantees no self-passing', () => {
  const players = [
    { id: 'p1' },
    { id: 'p2' },
    { id: 'p3' },
    { id: 'p4' },
  ];
  const chains = [
    { id: 'c1', currentHolderId: 'p1', fragments: [{ authorId: 'p1', text: 'f1' }] },
    { id: 'c2', currentHolderId: 'p2', fragments: [{ authorId: 'p2', text: 'f2' }] },
    { id: 'c3', currentHolderId: 'p3', fragments: [{ authorId: 'p3', text: 'f3' }] },
    { id: 'c4', currentHolderId: 'p4', fragments: [{ authorId: 'p4', text: 'f4' }] },
  ];

  // Test across multiple runs for randomization robustness
  for (let trial = 0; trial < 20; trial++) {
    const nextHolders = computeNextHolders(chains, players);
    assert.equal(nextHolders.length, 4);

    // Each player assigned exactly once
    const unique = new Set(nextHolders);
    assert.equal(unique.size, 4);

    // No chain given to the player who just authored its last fragment
    chains.forEach((chain, idx) => {
      assert.notEqual(nextHolders[idx], chain.currentHolderId);
    });
  }
});

test('getPlayerView strictly hides full state and earlier fragments', () => {
  let room = createRoom('Alice');
  room = addPlayer(room, 'Bob');
  room = addPlayer(room, 'Charlie');
  room = addPlayer(room, 'Dave');
  room = startGame(room);

  // In step 0 (WHO), nobody has submitted yet
  const aliceView0 = getPlayerView(room, room.players[0].id);
  assert.equal(aliceView0.currentStepType, 'WHO');
  assert.equal(aliceView0.previousFragmentText, null); // Nothing previous for WHO
  assert.equal(aliceView0.hasSubmitted, false);

  // Submit WHO for all
  room = submitFragment(room, room.players[0].id, 'A mysterious penguin');
  room = submitFragment(room, room.players[1].id, 'A frantic barista');
  room = submitFragment(room, room.players[2].id, 'An angry grandma');
  room = submitFragment(room, room.players[3].id, 'A space pirate');

  assert.equal(isStepComplete(room), true);

  // Advance to step 1 (WHEN)
  room = advanceStep(room);
  assert.equal(room.currentStepIndex, 1);

  // Inspect Bob's view
  const bobView1 = getPlayerView(room, room.players[1].id);
  assert.equal(bobView1.currentStepType, 'WHEN');
  assert.ok(bobView1.previousFragmentText !== null); // Has exactly the previous fragment
  assert.equal(typeof bobView1.previousFragmentText, 'string');

  // Verify that bobView1 does NOT contain other players' full chains or state
  assert.equal(bobView1.chains, undefined);
  assert.equal(bobView1.reconstructedStories, undefined);
});

test('full 5-step game loop successfully reconstructs final sentences', () => {
  let room = createRoom('P1');
  room = addPlayer(room, 'P2');
  room = addPlayer(room, 'P3');
  room = addPlayer(room, 'P4');
  room = startGame(room);

  const sampleTexts = [
    ['A vampire', 'A werewolf', 'A detective', 'A robot'],
    ['at 3 AM', 'at noon', 'during tea time', 'last Tuesday'],
    ['in a supermarket', 'at the airport', 'on Mars', 'in a library'],
    ['buying sunglasses', 'doing backflips', 'dancing tango', 'eating noodles'],
    ['with Batman', 'with a cat', 'wearing Crocs', 'holding balloons'],
  ];

  for (let step = 0; step < 5; step++) {
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const pId = room.players[pIdx].id;
      room = submitFragment(room, pId, sampleTexts[step][pIdx]);
    }
    room = advanceStep(room);
  }

  assert.equal(room.status, GAME_PHASES.FINAL_SENTENCE);
  assert.equal(room.reconstructedStories.length, 4);

  // Each reconstructed story has 5 fragments and a formatted sentence
  room.reconstructedStories.forEach((story) => {
    assert.equal(story.fragments.length, 5);
    assert.ok(story.fullSentence.length > 15);
    assert.ok(story.fullSentence.endsWith('.'));
  });
});
