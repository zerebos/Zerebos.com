---
order: 7
title: BetterDiscord Plugins
blurb: Plugins, a theme, and the library behind them.
icon: ../../assets/projects/icons/betterdiscord-plugins.webp
repo: zerebos/BetterDiscordAddons
website: https://betterdiscord.app/developers/Zerebos
websiteLabel: See them on BetterDiscord
banner: ../../assets/projects/images/betterdiscord-plugins/permissions-viewer.webp
tags: ["javascript", "typescript", "svelte"]
---

Before I ran BetterDiscord, I wrote plugins for it. Over the years that grew into more than two dozen plugins, a theme, and a library that a lot of other plugins were built on. Seven of those plugins are still maintained to this day.

## Where it started

I made the repo for my plugins on July 7, 2017, and the first year was busy, with over 300 commits. My first plugin was BetterFormattingRedux, a rewrite of Anxeal's BetterFormatting that added a formatting toolbar and new options. It's still around, and still one of the most active plugins in the repo.

<video src="/assets/projects/betterdiscord-plugins/better-formatting-redux.mp4" poster="/assets/projects/betterdiscord-plugins/better-formatting-redux-poster.webp" width="768" height="198" autoplay loop muted playsinline controls aria-label="BetterFormattingRedux demo: selecting a message and applying a style from the formatting toolbar"></video>

A lot of the early plugins started that way, as someone else's work that I took over and kept going. Anxeal had also written a couple of smaller role color plugins, which I maintained as gists for a while before combining them, plus more, into BetterRoleColors. PermissionsViewer, which shows every permission for a user, a server, or a channel, grew out of a much smaller proof-of-concept plugin by noodlebox. I briefly took over EmoteSearch from cate, too. In 2019 I picked up Beard's Material Design Theme after he retired and handed it off to me. We agreed it needed a new name, so I continued it as [Nox](https://github.com/zerebos/Nox), a dark material theme for Discord.

## The library

Writing that many plugins meant writing the same code over and over, like settings panels, popouts, modals, and the tricky work of finding Discord's internals. That shared code started out inside the repo, and in May 2018 it became [ZeresPluginLibrary](https://github.com/zerebos/BDPluginLibrary), with a repo of its own. It also came with a build tool on `npm`, so anyone could start a plugin and build it the same way mine were built.

Other developers picked it up fast. At its peak, nearly every plugin developer used it, apart from [DevilBro](https://github.com/mwittrien), who had a library of his own called BetterDiscord For DevilBro (BDFDB). Some developers even built their own libraries on top of mine, and then built their plugins on those. For years, "requires ZeresPluginLibrary" was about as common a line as a plugin description could have. The downside was that each plugin using it had to have boilerplate around requiring it, as BetterDiscord has no dependency management for plugins. Users without the library got prompts about installing it. And for developers it ended up being one more breaking point outside of their control.

Running BetterDiscord changed what the library needed to be. Once I was leading the project, I could put those APIs where they belonged, in BetterDiscord itself. And I brought over almost every one of them, improving on them along the way. Eventually the library had nothing left to do that BetterDiscord didn't do better. In December 2024 I rewrote my own plugins to drop it, and made a public announcement in the developer community Discord server to all plugin developers that it would be going away. In February of 2025 I archived it, with a notice pointing any remaining developers at the built-in API. It ended up being a huge relief to archive the library, as it was one less thing I needed to maintain. For users it was one less thing to download, one less pop-up when installing a plugin, and a much more seamless experience.

## Letting plugins go

Discord changes constantly, and every plugin is one more thing that can break with each update. Keeping two dozen of them working stopped making sense for me, so over time I cut the list down to the ones people used most. Others simply weren't needed anymore, because Discord or BetterDiscord started doing the same thing natively. BDContextMenu, for example, became part of BetterDiscord itself. There was a big round of discontinuations in 2020, another cleanup in 2022, and one more in December 2024. Where someone else had built a good replacement, like MoreRoleColors for BetterRoleColors, the plugin's page now points there.

## Today

The seven that remain are BetterFormattingRedux, BlurNSFW, DoNotTrack, HideDisabledEmojis, HideIconBadge, PermissionsViewer, and RoleMembers. Since December 2024 they've been written in TypeScript and built from one shared source tree. RoleMembers was rebuilt with Svelte in January 2026, and PermissionsViewer got a full rewrite of its permission modals that March.

<video src="/assets/projects/betterdiscord-plugins/permissions-viewer.mp4" poster="/assets/projects/betterdiscord-plugins/permissions-viewer-poster.webp" width="902" height="838" controls muted playsinline preload="none" aria-label="PermissionsViewer demo: browsing a member's permissions by role, with each permission marked Allowed, Neutral, or Denied"></video>
