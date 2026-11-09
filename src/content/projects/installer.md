---
order: 4
title: Installer
blurb: A desktop app that puts BetterDiscord into Discord.
icon: ../../assets/projects/icons/installer.png
repo: BetterDiscord/Installer
website: https://betterdiscord.app
banner: ../../assets/projects/images/installer.webp
tags: ["go", "wails", "svelte", "sveltekit", "typescript", "goreleaser"]
---


BetterDiscord is a client mod for Discord, and for most people the installer is the first piece of it they ever touch. Across all its releases, the installer alone has been downloaded more than 17 million times. That makes it a strange kind of project, because its whole job is to edit the files of an app I don't control, on a machine I've never seen, and then get out of the way. If it does that well, nobody really thinks about it. If it doesn't, someone's Discord stops opening entirely.

So the installer has to know where Discord lives on every platform, across the Stable, PTB, and Canary release channels, in native installs, per-user Flatpaks, and even a Windows install when seen from inside WSL. It has to notice when Discord is running and holding its own files open, close it, wait for it to actually exit, do the work, and start it back up. And when something goes wrong halfway through, it has to put everything back the way it found it.

## Where it started (Electron, 2021)

The first version shipped in March 2021 as an Electron app with a Svelte 3 frontend. We spent a lot of that first month on the feel of it, with custom page transitions, a native-looking macOS titlebar, live install logs that scroll as they stream in, and a layout that stays small and focused on the one thing you came to do. Most of the initial designing was the work of [Tropical](https://github.com/tropicaaal), with me doing live refinements as needed during implementation. I also leaned on [Gibbu](https://github.com/Gibbu) a lot for sanity checking the design.

That version did its job for years. It survived through the 1.x releases and a change to how BetterDiscord injected itself in late 2022. But it carried the usual Electron weight. Every download was about **79 MB**, and users were not shy about expressing their disappointment. Shipping a whole copy of Chromium for a tool most people run once and forget was one of the most common complaints about the installer. Keeping a portable 32-bit Windows build working also pinned the app to an old Electron, while the webpack toolchain around it was aging faster than the app itself.

<!-- TODO: if I ever do a project page for the CLI, I should link that instead -->
In the meantime, I had separately written and released the [BetterDiscord CLI](https://github.com/BetterDiscord/cli) in Go, which already knew how to find Discord and install BetterDiscord into it. Since a Wails app has a Go backend, moving the installer to Wails meant both tools could share that code instead of keeping a JavaScript/TypeScript copy and a Go copy of the same logic in step.

## The long road to Wails

Replacing Electron was obviously the right call. Actually doing it took more than three years.

The reason it took so long wasn't *really* the port. The old installer kept working, so there was never a big fire to force the switch. And a rewrite of the tool that touches people's Discord installs is not something to ship half finished. The bigger blocker was that I wanted the new installer to launch with a new way of injecting BetterDiscord, which is a breaking change on its own and required coordination with the BetterDiscord client itself. Shipping the rewrite first would have meant breaking things twice, so the branch waited until both were ready.

#### May 2023
Right after the last Electron release (v1.3.0), I started a Wails prototype on the side to see how a Go backend with a web frontend would hold up.

#### March 2024
The repo itself was converted to the Wails layout, and the core install logic was ported to Go. Then life and other BetterDiscord work took over, and the branch sat untouched.

#### June 2025
I picked it back up and rebuilt the frontend from scratch on SvelteKit and Svelte 5 runes, added initial Snap and Flatpak support, and brought the backend in line with the BetterDiscord CLI's Go modules so both tools find and patch Discord the same way. Along the way I scaffolded the same app in Tauri and in Wails' v3 alpha to make sure Wails v2 was still the right bet.

#### February 2026
Added a new configuration page with real repair options, backups of key files before a repair, keyboard navigation, and the first proper backend and frontend test suites.

#### July 2026
Releases moved to GoReleaser, which builds every platform from one config and publishes to winget and Homebrew. A full pre-merge review of the branch fixed bugs, hardened the backend, and rewrote the docs.

#### August 2026
The rewrite merged and shipped as **v2.0.0**.

## Rethinking how BetterDiscord gets in

The old method overwrote a file inside one of Discord's internal modules. That worked, but Discord's own updater would silently replace that module fairly often, so people had to run the installer again after updates.

The new method shadows Discord's `app.asar` instead, which changes less often. The installer moves Discord's original archive aside and puts a tiny loader in its place, which starts BetterDiscord and then hands off to the real Discord. Because the loader runs before Discord's updater does, BetterDiscord can keep itself injected across Discord updates, and most people only ever need to run the installer once.

Since this means rearranging files inside another app's install folder, every step is guarded. The installer probes whether it can write before it changes anything. It rolls back if any step fails. It handles the case where a previous uninstall left things half finished. And it restores Discord's original files *exactly* on uninstall. It was painstakingly verified by hand on native Windows (with Discord both closed and running), macOS, native Linux, and per-user Flatpak.

## The result

| | Electron (v1.3.0) | Wails (v2.0.0) |
| --- | --- | --- |
| Windows | ~79 MB | ~11 MB |
| macOS | ~78 MB | ~8 MB (universal) |
| Linux | ~79 MB | ~4 MB |

That's roughly a tenth of the size for an app that does more than the old one did. It also has a Go backend shared with the BetterDiscord CLI, a modern Svelte frontend, a universal macOS binary, Linux builds as both an AppImage and a plain zip, and installs through `winget` and `brew`.

## What I took away from it

- A rewrite doesn't actually have to happen all at once. Keeping it on a branch for years was slow, but it meant the shipped installer never got worse while the new one got figured out.
- The most valuable code in an installer is the code for when things go wrong. Probes, rollbacks, and "close Discord, wait, retry" paths are invisible when they work, and they are what make people trust the tool. The new installer has already cut down the rate of bug reports.
- Cross-platform development is still not a "solved" problem, even with bigger frameworks like Wails. I ran into many oddly specific edge cases when testing the installer out across platforms and setups.
