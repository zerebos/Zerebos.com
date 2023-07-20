---
title: BetterDiscord
blurb: The Discord customization project.
icon: betterdiscord.png
repo: BetterDiscord/BetterDiscord
layout: project.njk
banner: /assets/projects/images/bdbanner.webp
---

BetterDiscord is a client modification for Discord. This allows you to add plugins and themes to your personal copy of Discord. BetterDiscord also adds a number of other features out of the box.

## In The News

 - Article on WIRED by Cecilia D'Anastasio - [BetterDiscord Lets Users Mod the App to Their Heart’s Content](https://www.wired.com/story/betterdiscord-lets-users-mod-chat-app/)
 - Article on PCGamer by Morgan Park - [The best Discord themes and plugins](https://www.pcgamer.com/the-best-discord-themes-and-plugins/)
 - Article on MakeUseOf by Nico Posateri - [How to Set Up and Use BetterDiscord](https://www.makeuseof.com/how-to-set-up-use-betterdiscord/)
 - Article on OnlineTechTips by Emma Collins - [What Is BetterDiscord?](https://www.online-tech-tips.com/software-reviews/what-is-betterdiscord-and-how-to-install-it/)

 
## BetterDiscord Architecture

BetterDiscord is currently broken up into three packages--the local injector, the preload, and the renderer application. They form this miniature monorepo that is managed by [`pnpm`](https://pnpm.io/).

### Injector

The main job of this package is to inject into Discord and load the renderer package. The injector and its code live in the `injector` folder.

### Preload

Preload is the preload script for Discord's main `BrowserWindow` object. This sets up our cross-context APIs. The preload package and its code live in the `preload` folder.

### Renderer Application

This is the main payload of BetterDiscord. This is what gets executed in the renderer context by the [injector](#injector). This portion is where most of the user interaction and development will be. This module is responsible for loading plugins and themes, as well as handling settings, emotes and more. The renderer and its code live in the `renderer` folder.

