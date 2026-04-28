import blockcatcherIcon from "../assets/projects/icons/blockcatcher.png";
import betterdiscordIcon from "../assets/projects/icons/betterdiscord.png";
import mastodonIcon from "../assets/icons/mastodon.svg";
import steamIcon from "../assets/icons/steam.svg";
import type {ImageMetadata} from "astro";
import type {SocialIconName} from "../lib/icons";

interface IconLink {
    icon: SocialIconName;
    href: string;
}

interface CategoryLink {
    label: string;
    href: string;
    icon: ImageMetadata;
}

interface LinkCategory {
    label: string;
    links: CategoryLink[];
}

interface LinksData {
    icons: IconLink[];
    categories: LinkCategory[];
}

export default {
    icons: [

        {icon: "instagram", href: "https://instagram.com/IAmZerebos"},
        {icon: "twitter", href: "https://twitter.com/IAmZerebos"},
        {icon: "github", href: "https://github.com/zerebos"},
        {icon: "twitch", href: "https://twitch.tv/Zerebos"},
        {icon: "youtube", href: "https://www.youtube.com/@zerebos"},

    ],
    categories: [
        {
            label: "Featured Projects",
            links: [
                {label: "BetterDiscord", href: "https://betterdiscord.app/", icon: betterdiscordIcon},
                {label: "Block Catcher", href: "http://zerebos.github.io/BlockCatcher/", icon: blockcatcherIcon}
            ]
        },
        {
            label: "Other Socials",
            links: [
                {label: "Steam", href: "https://steamcommunity.com/id/Zerebos/", icon: steamIcon},
                {label: "Mastodon", href: "https://mstdn.social/@zerebos", icon: mastodonIcon}
            ]
        }
    ]
} satisfies LinksData;
