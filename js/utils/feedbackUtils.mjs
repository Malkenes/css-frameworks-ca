
export function showLoadingSpinner() {
    const spinner = document.querySelector("#loading-spinner");
    spinner.classList.remove("d-none");
}
export function hideLoadingSpinner() {
    const spinner = document.querySelector("#loading-spinner");
    spinner.classList.add("d-none");
}
export function displayError() {
    const errorMessage = document.querySelector("#display-error");
    errorMessage.classList.remove("d-none");
}
export function displayNoPosts(content) {
    const feed = document.querySelector("#feed");
    feed.classList.add("text-center");
    feed.innerHTML = content;
}