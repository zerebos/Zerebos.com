const GAP = 24;

let side: HTMLElement | null = null;
let observer: ResizeObserver | null = null;

/**
 * Sets the sticky side column's `top`. A column that fits sticks 24px below the top of the window. A taller one
 * gets a negative `top`, so it scrolls with the page until its bottom is 24px above the bottom of the window and
 * then stays there, which keeps the contents box at its end in view.
 */
function updateSideTop() {
    if (!side) return;
    const top = Math.min(GAP, window.innerHeight - side.offsetHeight - GAP);
    side.style.setProperty("--side-top", `${top}px`);
}

function bindSideColumn() {
    observer?.disconnect();
    side = document.querySelector<HTMLElement>(".post-side");
    if (!side) return;
    observer = new ResizeObserver(updateSideTop);
    observer.observe(side);
    updateSideTop();
}

window.addEventListener("resize", updateSideTop);
document.addEventListener("astro:page-load", bindSideColumn);
