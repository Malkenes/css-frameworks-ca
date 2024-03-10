import { apiCall } from "../services/apiServices.mjs";

const searchInput = document.querySelector("#search-input");

export function initializeSearch() {
    const searchResultContainer = document.querySelector("#search-results");
    if (searchResultContainer) {
        displayLiveSearch();
    }

    const searchForm = document.querySelector("#search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", executeSearch)
    }
}

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
        try {
            const postApiData = await apiCall("/social/posts/search?limit=3&q=" + event.target.value);
            const posts = postApiData.data;
            if (posts.length === 0) {
                const item = createListItem("No results");
                postList.append(item);
            } else {
                posts.forEach(post => {
                    const item = createListItem(`<a href="/post/index.html?id=${post.id}">${post.title}</a>`);
                    postList.append(item);
                });    
            }

        } catch (error) {
            console.log(error);
            const item = createListItem("Cant reach server");
            item.classList.add("list-group-item-danger");
            postList.append(item);
        }
        try {
            const profileApiData = await apiCall("/social/profiles/search?limit=3&q=" + event.target.value);
            const profiles = profileApiData.data;
            if (profiles.length === 0) {
                const item = createListItem("No results");
                profileList.append(item);
            } else {
                profiles.forEach(profile => {
                    const item = createListItem(`
                        <a href="/profile/index.html?user=${profile.name}">
                            <img class=user-icon-sm src=${profile.avatar.url}>
                            <span class="ps-2">${profile.name}</span>
                        </a>`
                    );
                    profileList.append(item);
                })
            }
        } catch (error) {
            console.log(error);
            const item = createListItem("Cant reach server");
            item.classList.add("list-group-item-danger");
            profileList.append(item);
        }
    }
}

/**
 * @description Display live search results based on user input.
 */
function displayLiveSearch() {
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
function executeSearch(event) {
    event.preventDefault();
    if (searchInput.value.length > 0) {
        window.location.href = "/search/index.html?search=" + searchInput.value;
    }

}

function createListItem(content) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.innerHTML = content;
    return listItem;
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
  