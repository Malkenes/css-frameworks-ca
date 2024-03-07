import { apiCall } from "../services/apiServices.mjs";

const searchInput = document.querySelector("#search-input");

/**
 * @description Handles input change events and performs API calls to retrieve search results for posts and profiles.
 * @param {Event} event
 * @returns {Promise<void>}
 */
async function handleInputChange(event) {
    const postList = document.querySelector("#post-list");
    postList.innerHTML = "";
    const profileList = document.querySelector("#profile-list");
    profileList.innerHTML = "";

    if (event.target.value.length > 3) {
        const postApiData = await apiCall("/social/posts/search?q=" + event.target.value);
        const posts = postApiData.data;
        const numPosts = Math.min(posts.length, 3);
        for (let i = 0; i < numPosts; i++) {
            const post = document.createElement("li");
            post.classList.add("list-group-item");
            post.innerHTML = `<a href="../post/index.html?id=${posts[i].id}">${posts[i].title}</a>`
            postList.append(post);
        }

        const profileApiData = await apiCall("/social/profiles/search?q=" + event.target.value);
        const profiles = profileApiData.data;
        const numProfiles = Math.min(profiles.length, 3);
        for (let i = 0; i < numProfiles; i++) {
            const profile = document.createElement("li");
            profile.classList.add("list-group-item");
            const profileName = document.createElement("a");
            profileName.href = `../profile/index.html?user=${profiles[i].name}`;
            profileName.innerHTML = `<img class=user-icon-sm src=${profiles[i].avatar.url}>${profiles[i].name}`
            profile.append(profileName);
            profileList.append(profile);
        }
    }
}

/**
 * @description Display live search results based on user input.
 */
export function displayLiveSearch() {
    const searchResults = new bootstrap.Collapse("#search-results", {toggle: false});
    const debouncedHandleInput = debounce(handleInputChange, 300);
    searchInput.addEventListener("input", debouncedHandleInput);
    searchInput.addEventListener("focusin", () => {
        searchResults.show();
    })
    searchInput.addEventListener("focusout", () => {
        setTimeout(function() {
            searchResults.hide();
        },1000);
    })

}

/**
 * @description Execute a search operation based on the input value.
 * @param {Event} event
 */
export function executeSearch(event) {
    event.preventDefault();
    if (searchInput.value.length > 0) {
        window.location.href = "/search/index.html?search=" + searchInput.value;
    }

}

function debounce(func, delay) {
    let timerId;
    return function(...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
}
  