
/**
 * @description Calculate the time elapsed since a given timestamp and format it as a human-readable string.
 * @param {string} created
 * @returns {HTMLDivElement}
 */
export function timePassed(created) {
    const div = document.createElement("p");
    div.classList.add("text-black-50");
    const date = Date.parse(created);
    const timeElapsed = Date.now() - date;
    const weeks = Math.floor(timeElapsed / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
    const minutes = Math.floor(timeElapsed / (1000 * 60));
    let time = "";
    switch (true) {
        case weeks > 0:
            time = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
            break;
        case days > 0:
            time = days === 1 ? "1 day ago" : `${days} days ago`;
            break;
        case hours > 0:
            time = hours === 1 ? "1 hour ago" : `${hours} hours ago`;
            break;
        case minutes > 0:
            time = minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
            break;
        default:
            time = "now"
            break;
    }
    div.textContent = `Posted ${time}`;
    return div;
}
