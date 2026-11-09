/** Formats a count with its noun, adding an "s" for anything but one: "1 post", "3 posts". */
export function countLabel(count: number, noun: string): string {
    return `${count} ${count === 1 ? noun : `${noun}s`}`;
}
