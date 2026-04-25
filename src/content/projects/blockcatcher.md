---
title: Block Catcher
blurb: A retro style WebGL game.
icon: blockcatcher.png
repo:  zerebos/BlockCatcher
layout: project.njk
banner: /assets/projects/images/blockcatcher.png
---

You can play a demo of the game at [http://zerebos.github.io/BlockCatcher/](http://zerebos.github.io/BlockCatcher/)

## 🎮 **How to Play**

### Controls
```
← → Arrow Keys    Move your paddle
SPACE             Start game / Pause
Audio Button      Toggle sound
```

### Strategy Tips

- **Start with pink blocks** to build momentum
- **Chase cyan blocks** when you're confident
- **Watch the timer** - panic leads to mistakes
- **Use audio cues** to anticipate block drops

### 🎯 **The Challenge**

Time is ticking. Neon blocks cascade from the digital sky. Your mission? **Catch them all.**

In this retro-futuristic arena, you control a sleek white paddle in a race against time. Each block type demands different strategies:

- **🌸 Pink Blocks** → *1 point* • Large & leisurely • Perfect for beginners
- **🟣 Purple Blocks** → *5 points* • Medium challenge • The sweet spot
- **🔷 Cyan Blocks** → *25 points* • Lightning fast • High risk, high reward

**Goal:** Score **500 points** in **60 seconds**. Sounds easy? Think again.

## Architecture Highlights

### 🏗️ **Clean Architecture**
```
src/
├── managers/    # System orchestration (audio, DOM, input, rendering, pools)
├── entities/    # Game objects (player, blocks) with behavior
├── utils/       # Pure functions (math, geometry, vectors)
├── audio/       # Modular sound effect system
├── types/       # TypeScript definitions
└── styles/      # Synthwave CSS architecture
```

### 🧪 **Testing Philosophy**
- **Unit tests** for individual components
- **Integration tests** for game mechanics
- **DOM tests** using Happy-DOM for realistic environments
- **Edge case coverage** including accessibility scenarios

### 🚀 **Performance Features**
- **Object pooling** prevents garbage collection hitches
- **Efficient collision detection** using AABB algorithms
- **Minimal DOM manipulation** with batch updates
- **Optimized bundle** under 20KB total
- **WebGL Shaders** for hardware acceleration

---

## 📊 **Technical Stats**

<!-- <div align="center"> -->

| Metric | Value |
|:--------|-------:|
| **Bundle Size** | 18.81 KB (JS) + 13.40 KB (CSS) |
| **Test Coverage** | 141 tests, 100% core functionality |
| **Performance** | 60 FPS WebGL rendering |
| **Accessibility** | WCAG 2.1 AA compliant |
| **Browser Support** | All modern browsers with WebGL |

<!-- </div> -->

---

## 🌟 **The Tech Stack**

**Why these choices?**

- **[Bun](https://bun.sh)** → Lightning-fast runtime and bundler
- **[TypeScript](https://typescriptlang.org)** → Type safety without complexity
- **[WebGL](https://webgl.org)** → Hardware-accelerated graphics
- **[Web Audio API](https://webaudio.github.io/web-audio-api/)** → Immersive sound design
- **[Happy-DOM](https://github.com/capricorn86/happy-dom)** → Realistic testing environment
- **[GitHub Actions](https://github.com/features/actions)** → Automated deployment
