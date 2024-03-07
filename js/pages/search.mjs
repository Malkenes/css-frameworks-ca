import { apiCall } from "../services/apiServices.mjs";

/**
 * @description Displays search results for posts and profiles based on the provided search parameter.
 * @param {string} param
 */
export function displaySearchResults(param) {
    
    const searchPosts = document.querySelector("#search-posts");
    const searchProfiles = document.querySelector("#search-profiles");
    const nextPage = document.querySelector("#next-page");
    const prevPage = document.querySelector("#prev-page");
    const searchTitle = document.querySelector("#search-result-title");
    const title = document.querySelector("title");

    searchTitle.textContent += " for: " + param;
    title.textContent += " - " + param;

    // Initialize
    let currentPage = 1;
    let currentEndpoint = "/social/posts/search?limit=10&_author=true&q=" + param;
    let extractData = item => ({
        title: item.title,
        body: item.body,
        href: `../post/index.html?id=${item.id}`,
    });
    displaySearchAmount(param);

    /**
    * @description Fetches search results from the specified endpoint and displays them on the page.
    * @param {string} endpoint
    * @param {Function} data
    * @param {number} page
    */
    async function displayResults(endpoint, data, page) {
        try {
            const searchResult = await apiCall(endpoint + "&page=" + page);
            console.log(searchResult);
            if (searchResult.meta.isLastPage) {
                nextPage.disabled = true;
            } else {
                nextPage.disabled = false;
            }
            if (searchResult.meta.isFirstPage) {
                prevPage.disabled = true;
            } else {
                prevPage.disabled = false;
            }
            const searchResults = document.querySelector("#search");
            searchResults.innerHTML = "";
            searchResult.data.forEach(item => {
                const extractData = data(item);
                const searchItem = document.createElement("div");
                searchItem.classList.add("bg-white", "mb-3");
                const searchText = document.createElement("a");
                searchText.href = extractData.href;
                searchText.classList.add("text-black", "link-underline","link-underline-opacity-0", "p-2", "d-flex", "align-items-center", "gap-3");
                let htmlContent = `<strong>${extractData.title}</strong>`
                if (extractData.body) {
                    htmlContent += `<p>${extractData.body}</p>`
                }
                if (extractData.avatar) {
                    const avatarImg = document.createElement("img");
                    avatarImg.src = extractData.avatar;
                    avatarImg.classList.add("user-icon");
                    searchText.append(avatarImg);
                }
                searchText.innerHTML += `<div>${htmlContent}</div>`;
                searchItem.append(searchText);
                searchResults.append(searchItem);
            })
    
        } catch (error) {
            console.log("error");
        }
    }

    // event listener for search posts button
    searchPosts.addEventListener("click", () => {
        currentPage = 1;
        currentEndpoint = "/social/posts/search?limit=10&_author=true&q=" + param;
        extractData = item => ({
            title: item.title,
            body: item.body,
            href: `../post/index.html?id=${item.id}`,
        });
    
        displayResults(currentEndpoint, extractData, currentPage);
    });

    // event listener for search profiles button
    searchProfiles.addEventListener("click", () => {
        currentPage = 1;
        currentEndpoint = "/social/profiles/search?limit=10&q=" + param;
        extractData = item => ({
            title: item.name, 
            body: item.bio, 
            href: `../profile/index.html?user=${item.name}`, 
            avatar: item.avatar.url
        });
        displayResults(currentEndpoint, extractData, currentPage);
    });

    // initial display of search results
    displayResults(currentEndpoint, extractData, currentPage);

    nextPage.addEventListener("click", () => {
        currentPage++;
        displayResults(currentEndpoint, extractData, currentPage);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
    prevPage.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults(currentEndpoint, extractData, currentPage);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })    
        }
    })
}

/**
 * @description Fetches and displays the total count of search results for posts and profiles based on the provided search parameter.
 * @param {string} param
 * @throws {Error}
 */
async function displaySearchAmount(param) {
    const postAmount = await apiCall("/social/posts/search?q=" + param);
    const postBadge = document.querySelector("#search-post-amount");
    postBadge.textContent = postAmount.meta.totalCount;

    const profileAmount = await apiCall("/social/profiles/search?q=" + param);
    const profileBadge = document.querySelector("#search-profiles-amount");
    profileBadge.textContent = profileAmount.meta.totalCount;
}