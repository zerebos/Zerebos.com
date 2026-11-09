let observers: IntersectionObserver[] = [];

/**
 * Marks the link for the section being read: the last heading above the top 30% of the window. The last
 * section is often too short to reach that line, so it's also marked once the end of the post is in view.
 */
function bindContentsBox() {
    for (const observer of observers) observer.disconnect();
    observers = [];

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".contents-box a"));
    const idOf = (link: HTMLAnchorElement) => decodeURIComponent(link.hash.slice(1));
    const headings = links
        .map((link) => document.getElementById(idOf(link)))
        .filter((heading): heading is HTMLElement => heading !== null);
    if (headings.length === 0) return;

    const end = document.querySelector(".detail-body .content > :last-child");

    const update = () => {
        const line = window.innerHeight * 0.3;
        let current = headings[0];
        for (const heading of headings) {
            if (heading.getBoundingClientRect().top <= line) current = heading;
        }
        if (end && end.getBoundingClientRect().bottom <= window.innerHeight) current = headings[headings.length - 1];
        for (const link of links) {
            if (idOf(link) === current.id) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        }
    };

    // The observers only say when a heading crosses the line or the end comes into view, and `update` works out
    // which section is current.
    const headingObserver = new IntersectionObserver(update, {rootMargin: "0px 0px -70% 0px"});
    for (const heading of headings) headingObserver.observe(heading);
    observers.push(headingObserver);
    if (end) {
        const endObserver = new IntersectionObserver(update, {threshold: 1});
        endObserver.observe(end);
        observers.push(endObserver);
    }
    update();
}

document.addEventListener("astro:page-load", bindContentsBox);
