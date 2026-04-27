const containerElem = document.querySelector("#marquee") as HTMLElement | null;
const listElem = document.querySelector("#marquee > div") as HTMLElement | null;
const SPEED = 40;

if (containerElem && listElem) {
    const marqueeList = listElem;
    let currentLeftValue = 0;
    let previous: number | undefined;

    window.requestAnimationFrame(animationLoop);

    function animationLoop(timestamp: number) {
        if (previous === undefined) {
            previous = timestamp;
            window.requestAnimationFrame(animationLoop);
            return;
        }

        const elapsed = timestamp - previous;
        previous = timestamp;
        const firstItem = marqueeList.firstElementChild as HTMLElement | null;

        if (!firstItem) {
            return;
        }

        currentLeftValue -= (SPEED * elapsed) / 1000;

        const gap = Number.parseFloat(window.getComputedStyle(marqueeList).gap || "0");
        const firstItemWidth = firstItem.getBoundingClientRect().width + gap;

        if (-currentLeftValue >= firstItemWidth) {
            currentLeftValue += firstItemWidth;
            marqueeList.appendChild(firstItem);
        }

        marqueeList.style.transform = `translateX(${currentLeftValue}px)`;
        window.requestAnimationFrame(animationLoop);
    }
}
