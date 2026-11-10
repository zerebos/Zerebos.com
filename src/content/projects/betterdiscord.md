---
order: 1
title: BetterDiscord
blurb: The Discord customization project.
icon: ../../assets/projects/icons/betterdiscord.png
repo: BetterDiscord/BetterDiscord
website: https://betterdiscord.app
banner: ../../assets/projects/images/bdbanner.webp
tags: ["typescript", "electron", "bun", "open-source"]
---

BetterDiscord is a client mod for Discord. It lets people add plugins and themes to their own copy of the app, and it gives developers the APIs to build them. But I didn't create it. I inherited it. At first, it happened unofficially. Then I inherited the name as well, and led it from 2017 until I handed it off at the end of 2025.

Over those eight years the codebase went from a patch layer on someone else's code to a rewrite, then to a typed, modern project that a team could run without me. Leading it also changed across the years, from fixing things alone to deciding things together. The two kept shaping each other, so this page covers both, not just the technical side.

## Inheriting a legacy (2017–2020)

I got into BetterDiscord the way most people did, by writing plugins for it. I also took over plugins whose authors had moved on, and over time I built a reputation with the other developers in the community.

In October 2017, I forked BetterDiscord. It was partly a learning exercise, and partly a way to add the APIs that other developers and I kept wishing for. I also added some core fixes, like loading BetterDiscord locally instead of from a remote server. People started using the fork without me ever really advertising it, and the more the official version broke, the more of them showed up. Moderators and helpers in the BetterDiscord server (which I wasn't one of yet) actually started pointing people with problems at my fork.

Once it had real traction, I named it BandagedBD and forked the installer to install it directly. That turned out to matter more than I expected. In early 2018, the official BetterDiscord broke *completely* for a while. I helped its creator, Jiiks, get it working again. But after that, its development stopped, and everything the server's moderators controlled was pointing at BandagedBD. Eventually even the official website pointed there. In practice I was maintaining BetterDiscord, just not under that name yet.

Jiiks' energy went into BDv2, a ground-up rewrite that started in early 2018. Some of us helped, but it was mostly a siloed effort, and a lot of us didn't agree with the decisions being made. Meanwhile I was prototyping a client mod of my own, Zipcord, with a totally different architecture. Once Zipcord became visible on GitHub, the name finally changed hands. In mid-2020 Jiiks gave me their blessing to use the BetterDiscord name and branding.

Around the same time, the first core team formed. Pu, square, and Green took on the website. The project moved into its own GitHub organization, and I kept working on the client (still mostly on my own). Later, after Jiiks' Discord account was deleted, I appealed to Discord and took ownership of both community servers as the project's lead.

## The rewrite (2019–2021)

BandagedBD was still a layer of patches on top of code I hadn't designed myself, so in May 2019 I started rewriting the client from scratch. That first burst lasted about a month before life got busy, and the rewrite sat for a year. I picked it back up in July 2020, moved it to the BetterDiscord name, and wrote a migration so people's existing BetterDiscord data carried over.

Discord itself inadvertently forced the timing of the rest. Its switch to context isolation broke the old way of loading, so in March 2021 I restructured the rewrite into three small packages (an injector, a preload script, and the renderer) and shipped it as BetterDiscord 1.0. BandagedBD got a final "unsupported" notice a few weeks later.

Zipcord didn't survive the rewrite, but its lessons did. The more I grew into running BetterDiscord, the clearer it became that the two couldn't be merged anyway. BetterDiscord's plugin ecosystem is huge and wide open, and Zipcord's architecture only worked by being much more restrictive.

## Keeping it alive (2021–2024)

A client mod lives downstream of an app that changes every week without warning. A lot of these years went into keeping up with Discord, like changing how BetterDiscord injected itself and adding a Webpack API so plugin developers could find Discord's internals without guessing. Along the way, the license also moved to Apache 2.0.

Most of that work was still mine. Until 2024 I wrote somewhere between 72 and 82 percent of the commits each year, and most changes went straight in rather than through pull requests. Contributors like Strencher and Tropical helped a great deal, but the client mostly moved when I moved it.

In 2022, I tried to fix the codebase's growing pains with a proper monorepo. Strencher carried on this effort into 2023. It was mostly a mechanical move of the code into new packages, and ultimately that's why we dropped it. Rearranging the code didn't fix what made it painful to work on.

## Protecting users

An app that runs other people's code inside your chat client is an obvious target. Before the current website existed, there were a couple of incidents where plugins stole account tokens. Once I was the de facto maintainer, I added protections in the client to stop the low-effort versions of those attacks.

The bigger fix came from the core team's new website, which added an addon store with a review process for both submissions and updates. Since then there has been exactly one *incident*, and it wasn't even a security issue. A developer who stopped supporting their plugin pushed an update that made the plugin delete itself. Because it changed files on users' computers without them asking, we counted it as a failure on our end. But it was a far cry from the old days of token stealers.

We were also deliberately conservative about Discord's terms of service. Our communication with Discord started strong, then grew sparse, and eventually stopped. So we had to make our own calls on a lot of things. BetterDiscord's users skewed more toward everyday people than other client mods' users did, so we banned plugins for message logging and for showing hidden channels (for privacy reasons), and self-botting (because it puts accounts at risk). That stance cost us users, and it gave another client mod, Vencord, a real boost.

## Building a team (2024–2025)

In 2024, one user's frustration over a GitHub issue escalated far past anything a GitHub issue should, and it took me most of a year to come back. For months, almost nothing happened in the repository.

What brought me back was the people. [doggybootsy](https://github.com/doggybootsy) had experience building their own client mod, and from the first time they hinted at wanting to do more for BetterDiscord, I kept pulling them in. I asked for their ideas and opinions, brought them into the core team's private server, and decided with them what to work on and when. [Arven](https://github.com/zrodevkaan) came along with them. After watching how BDv2 had been run... I wanted the opposite. The developers doing the actual work should also be part of the decisions.

The `1.13` overhaul in 2025 was how I put that into practice. It moved the build to [Bun](https://bun.sh) and [esbuild](https://esbuild.github.io), converted the client to TypeScript, and reorganized the code. Every one of those changes (hopefully) made the project easier for someone other than me to work on. It was a cleanup and an onboarding project at the same time. That's also where modernizing and leading collided the hardest. Every structural change had to be timed around the developers learning the codebase while it also changed under them.

The numbers show the shift from the previous era (2021–2024). In 2025, **73 pull requests** from other contributors were merged, against 13 commits I pushed directly. And my share of commits actually fell below half for the first time.

## Handing it off

In December 2025 I officially stepped back, and doggybootsy became the lead developer with Arven joining the core team. I wrote about that in [Passing the Torch](/blog/betterdiscord-passing-the-torch).

The team has kept shipping without me as the bottleneck, which was the whole point of the last few years. That includes the `1.14` release in August 2026 with a new injection method and a published types package for plugin developers.

## In the news

- Article on WIRED by Cecilia D'Anastasio: [BetterDiscord Lets Users Mod the App to Their Heart's Content](https://www.wired.com/story/betterdiscord-lets-users-mod-chat-app/)
- Article on PC Gamer by Morgan Park: [The best Discord themes and plugins](https://www.pcgamer.com/the-best-discord-themes-and-plugins/)
- Article on MakeUseOf by Nico Posateri: [How to Set Up and Use BetterDiscord](https://www.makeuseof.com/how-to-set-up-use-betterdiscord/)
- Article on OnlineTechTips by Emma Collins: [What Is BetterDiscord?](https://www.online-tech-tips.com/software-reviews/what-is-betterdiscord-and-how-to-install-it/)

## What I took away from it

- Inheriting a project means inheriting its users before you inherit its code. People depended on BandagedBD long before I had the name, or the right to change anything big. That experience has forever shaped the way I steward my open source projects.
- A rewrite pays off most when something directly forces it. Our biggest rewrite was shaped by Discord's context isolation change. In contrast, the monorepo that nothing forced us into was the one we ended up dropping.
- Modernizing a codebase and building a team are ultimately the same project, not two. The cleanest code in the world can't help if only one person understands it, and new people can't contribute to a codebase that fights against them.
- Being protective of users costs something. We gave up users by saying no to some features. But at the end of the day, we still had to do what we felt was right to protect our users.
- Letting go of a long-running project is *hard*, even when you know it's time. I had put an enormous number of hours into BetterDiscord, and even once I could see my burnout holding it back, part of me still didn't want to let go. Handing it off was the hardest call I ever made on the project, and *by far* the best one for it.
- Handing off a project isn't a single moment. Knowledge passes over gradually, and every time I thought I was "done," there was something else to hand over. Almost a year after stepping down, I'm still answering architecture questions and reviewing PRs.
