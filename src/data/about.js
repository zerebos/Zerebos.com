const links = require("./links");

module.exports = {
    title: "Engineer, Creator, Educator",
    blurb: "A programmer with a mind that never stops ticking. Never sticks to just one language&mdash;use the right tools for the job. Works on multiple <b>open-source</b> projects. Always looks to do more for the developer community.",
    byline: "Keeping systems running <span>@IBM</span> System Z",
    current: ["Creating tools for developers and users", "Trying out new libraries", "Enjoying the learning journey"],
    banner: {url: "/assets/images/about.webp", caption: "A combined hardware/firmware/software project."},
    sections: [
        {
            title: "Origin",
            content: "I get asked about this a lot, but the origin of this pseudonym is quite simple. I took the first letter of my real name, <b>Z</b>, and combined it with something I thought was cool. At the time, I was really into Greek mythology, so I went with the god Erebus (also spelled Erebos). But it wasn't originally intended to become my online pseudonym, it was a name for my Skyrim character. Using it as a pseudonym came shortly thereafter because I liked it so much!<br /><br />I also get asked about avatar I use. This was much more recent. During my graduate school work, I took a course on computer graphics and ai. So I built my own ai from scratch and trained it on a specific style of imagery. Once I got the ai to the point I thought was acceptable, I prompted it with just my pseudonym <b>Zerebos</b> and it came up with this. I've been using it ever since, but I really would like to have one made in the same style by a real artist. So if you happen to be an artist&mdash;or know one with this style&mdash;please reach out!"
        },
        {
            title: "Current",
            content: `I work at IBM as a firmware engineer for the System Z mainframes. I specifically work in the recovery area, so when something goes wrong, my code kicks in to try and fix things and get them back to a working state. Outside of that, I work on <a href="https://betterdiscord.app/" target="_blank" rel="noreferrer">BetterDiscord</a> and the ecosystem around it. I run a <a href="https://discord.com/servers/49ers-322620751817736192" target="_blank" rel="noreferrer">Discord server</a> for the San Francisco 49ers. I <a href="${links.icons.find(l => l.icon === "twitter").href}" target="_blank" rel="noreferrer">tweet</a>. I play <a href="${links.categories.find(l => l.label.includes("Other")).links.find(l => l.label.toLowerCase() === "steam").href}" target="_blank" rel="noreferrer">video games</a>. And occasionally, I work on other small side projects that get put up on <a href="${links.icons.find(l => l.icon === "github").href}" target="_blank" rel="noreferrer">GitHub</a>. Other than that, I don"t do too much under this pseudonym just yet.`
        },
        {
            title: "Future",
            content: "I think going forward I might try to get a little more into the content creator space. A lot of my friends have encouraged me to start streaming games because I have funny reactions and commentary. And users from the BetterDiscord world have encouraged me to do development streams. It definitely seems like there's a potential audience, and streaming seems kinda fun. So who knows? Maybe that's in my near future.<br /><br />As for future projects, I don't have anything big cooking at the time of writing. But I'm sure something will come up soon. It usually does when I least expect it."
        },
    ],
};