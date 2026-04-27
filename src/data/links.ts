import blockcatcherIcon from "../assets/projects/icons/blockcatcher.png";

interface IconLink {
    icon: string;
    href: string;
}

interface CategoryLink {
    label: string;
    href: string;
    icon: string;
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
                {label: "BetterDiscord", href: "https://betterdiscord.app/", icon: "https://betterdiscord.app/resources/favicon/favicon-32x32.png"},
                {label: "Block Catcher", href: "http://zerebos.github.io/BlockCatcher/", icon: blockcatcherIcon.src}
            ]
        },
        {
            label: "Other Socials",
            links: [
                {label: "Steam", href: "https://steamcommunity.com/id/Zerebos/", icon: "/assets/icons/steam.svg"},
                {label: "Mastodon", href: "https://mstdn.social/@zerebos", icon: "/assets/icons/mastodon.svg"}
            ]
        }
    ]
} satisfies LinksData;
