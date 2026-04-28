import externalLinkIcon from "../assets/icons/external-link.svg";
import githubIcon from "../assets/icons/github.svg";
import instagramIcon from "../assets/icons/instagram.svg";
import linkedinIcon from "../assets/icons/linkedin.svg";
import mastodonIcon from "../assets/icons/mastodon.svg";
import menuIcon from "../assets/icons/menu.svg";
import steamIcon from "../assets/icons/steam.svg";
import twitchIcon from "../assets/icons/twitch.svg";
import twitterIcon from "../assets/icons/twitter.svg";
import youtubeIcon from "../assets/icons/youtube.svg";

export const namedIcons = {
    "external-link": externalLinkIcon,
    github: githubIcon,
    instagram: instagramIcon,
    linkedin: linkedinIcon,
    mastodon: mastodonIcon,
    menu: menuIcon,
    steam: steamIcon,
    twitch: twitchIcon,
    twitter: twitterIcon,
    youtube: youtubeIcon,
} as const;

export type NamedIcon = keyof typeof namedIcons;

export function getIconByName(icon: string) {
    const normalizedIcon = icon.trim().toLowerCase();
    return namedIcons[normalizedIcon as NamedIcon];
}

export {externalLinkIcon, linkedinIcon, menuIcon, twitterIcon};
