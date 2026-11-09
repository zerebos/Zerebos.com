---
order: 2
title: Block Catcher
blurb: A tiny arcade game about catching falling blocks.
icon: ../../assets/projects/icons/blockcatcher.png
repo:  zerebos/BlockCatcher
website: https://zerebos.github.io/BlockCatcher/
websiteLabel: Play the demo
banner: ../../assets/projects/images/blockcatcher.png
tags: ["typescript", "webgl", "bun"]
---

You get a paddle, sixty seconds, and a steady rain of colored blocks. Pink blocks are big, slow, and worth 1 point. Purple ones are worth 5. The small, fast cyan blocks are worth 25. Reach 500 points before the clock runs out and you win. The arrow keys move the paddle, and space starts and pauses the game.

That's it. That's the whole game. It's small on purpose, which is exactly what makes it useful.

## Where it started

Block Catcher began in 2016 as a group project for a graduate-level computer graphics class. It was plain WebGL built on the helper libraries from the course. Initial design had a green paddle, blocks in red, blue, and white, and a win at 250 points. Each block type had its own fragment shader, and everything moved by way of a translation matrix in the vertex shader. It got one patch in 2018 to fix a jittery paddle and a screen flicker whenever you caught a block, and then it sat untouched for five years.

## Rewrites

I've come back to it a couple times since then. A small, finished game turns out to be a great place to try new tooling, because nothing important breaks if an experiment goes sideways.

### 2023
The loose scripts and prototypes became classes, the build moved to webpack, the code got linted, and a GitHub Actions workflow started publishing it to GitHub Pages. Around the same time, I dug up a [JavaFX version](https://github.com/zerebos/BlockCatcherFX) from the same era, which lives in its own repo.

### 2025
The whole thing moved to TypeScript and [Bun](https://bun.sh), picked up a test suite, and gained pausing, sound effects, a volume slider, and the current neon look. The goal also went up to 500 points after tweaking the block spawn rate.

### 2026
Added a local leaderboard, built around a small provider interface so a global leaderboard can be added later without touching the game itself.

## How it's built

### No engine
Rendering is raw WebGL with a single, very small shader pair. Each block's vertex buffer is built when it spawns, and from then on it only moves by way of position uniforms, so nothing gets re-uploaded to the GPU frame by frame.

### No audio files
Every sound is synthesized at runtime with the Web Audio API. Catching a block plays a short square-wave blip whose pitch rises with the block's value, so a cyan catch sounds a lot more satisfying than a pink one.

### Object pooling
Blocks come from a pre-allocated pool and go back into it when they're caught or fall off the screen. The game isn't constantly creating and throwing away objects mid-round, so the garbage collector has nothing to interrupt it with.

### Accessible where possible
A canvas game is a hard case for screen readers, so the score, the timer, and the game status are announced through ARIA live regions. The canvas itself is focusable and describes its controls. Labels are added to the volume slider and the leaderboard form too.

### Tested
About 150 tests run on Bun's test runner, with Happy DOM standing in for the browser. The same GitHub Actions workflow runs them before every deploy.
