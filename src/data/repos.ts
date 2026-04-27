// TODO: dynamically all repos from GitHub API instead of hardcoding them here
// Should use a high cache time since repos don't change that often, and this will reduce the number of API calls significantly
export const betterdiscord = [
    "BetterDiscord/BetterDiscord",
    "BetterDiscord/Installer",
    "BetterDiscord/docs",
    "BetterDiscord/cli",
    "BetterDiscord/PublicServers",
    "BetterDiscord/BetterDiscordBot",
];

export const personal = [
    "ghostty-config",
    "BetterDiscordAddons",
    "BDPluginLibrary",
    "BBDInstaller",
    "Nox",
    "Trilium-SingleFile",
    "Trilium-Breadcrumbs",
    "Trilium-MarkdownPreview",
    "trilium.rocks",
    "discordbot.py",
    "Trilium-LaTeXPreview",
    "VHDL-Communications",
    "trilium-etapi",
    "trilium-types",
    "trilium-pack",
    "BlockCatcher",
    "EnhancedDiscordPlugins",
    "TableTennisDB",
    "Planum",
    "dotfiles",
    "better-formatting",
    "BoiBot",
    "ModernRenai",
    "Citador",
    "asar.net",
    "Intelligent-Line-And-Marker-Tracking-Car",
    "BlockCatcherFX",
    "BetterDiscordPlugins",
    "EnhancedDiscord",
    "Object3D-Demo",
    "Hangman",
    "Tools-and-Utilities",
];


const jssucks = [
    "JsSucks/BetterDiscordApp",
    "JsSucks/BDI",
    "JsSucks/BDEdit",
];


export default [...betterdiscord, ...personal, ...jssucks];