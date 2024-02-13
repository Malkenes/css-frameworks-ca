
export function timePassed(created) {
    const div = document.createElement("p");
    div.classList.add("text-black-50");
    const date = Date.parse(created);
    const timeElapsed = Date.now() - date;
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    div.textContent = `Posted ${days} days ago`;
    let time = "";
    switch (true) {
        case timeElapsed > 1000 * 60 * 60 * 24 * 7:
            time = Math.floor(timeElapsed / (1000 * 60 * 60 * 24 * 7)) + " weeks";
            break;
        case timeElapsed > 1000 * 60 * 60 * 24:
            time = Math.floor(timeElapsed / (1000 * 60 * 60 * 24)) + " days";
            break;
        case timeElapsed > 1000 * 60 * 60:
            time = Math.floor(timeElapsed / (1000 * 60 * 60)) + " hours";
            break;
        case timeElapsed > 1000 * 60:
            time = Math.floor(timeElapsed / (1000 * 60)) + " minutes";
        default:
            break;
    }
    div.textContent = `Posted ${time} ago`;
    return div;
}
