import { commentSection } from "../components/commentSection.mjs";
import { handlePostInteraction } from "../components/postHandler.mjs";
import { displayPost } from "../components/postList.mjs";
import { sortByPopularity, sortByTrending, getTagCount } from "../components/sort.mjs";
import { apiCall } from "../services/apiServices.mjs";
import { showLoadingSpinner, hideLoadingSpinner, displayError, displayNoPosts } from "../utils/feedbackUtils.mjs";

/**
 * @description Retrieves and displays the feed of posts, including options for sorting and filtering.
 * @returns {void}
 */
export async function getFeed() {
    const postPerPage = 10;
    let currentPage = 1;
    try {
        showLoadingSpinner();
        const data = await getAllPosts();
        const originalData = [...data];
        let dataCopy = sortByTrending(data);

        const recent = document.querySelector("#recent");
        const trending = document.querySelector("#trending");
        const popular = document.querySelector("#popular");

        if (dataCopy.length === 0) {
            dataCopy = originalData;
            setActive(recent);
        }
    
    
        window.onscroll = function() {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
                currentPage += 1;
                const startIndex = (currentPage - 1) * postPerPage;
                const endIndex = startIndex + postPerPage;
                displayFeed(dataCopy.slice(startIndex,endIndex));
            }
        }
    
        trending.addEventListener("click", () => {
            dataCopy = sortByTrending(data);
            clearFeed();
            if (dataCopy.length === 0) {
                displayNoPosts("No new posts the last 24 hours");
            }
            displayFeed(dataCopy.slice(0,10));
            setActive(trending);
        })
        recent.addEventListener("click", () => {
            dataCopy = originalData;
            clearFeed();
            displayFeed(dataCopy.slice(0,10));
            setActive(recent);
        })
        popular.addEventListener("click", () => {
            dataCopy = sortByPopularity(data);
            clearFeed();
            displayFeed(dataCopy.slice(0,10));
            setActive(popular);
        })
    
        const TagSelection = document.querySelector("#tag-selection");
        const popularTags = getTagCount(data);
        const bsOffcanvas = new bootstrap.Offcanvas("#offcanvasResponsive");
        for (let i = 0; i < 10; i++) {
            const tagElement = document.createElement("li");
            tagElement.classList.add("list-group-item", "list-group-item-action");
            if (i % 2) {
                tagElement.classList.add("list-group-item-primary");
            }
            const tagButton = document.createElement("button");
            tagButton.classList.add("btn");
            tagButton.textContent = popularTags[i];
            
            tagButton.onclick = async function() {
                clearFeed();
                bsOffcanvas.hide();
                try {
                    showLoadingSpinner();
                    const apiData = await apiCall("/social/posts?_author=true&_reactions=true&_comments=true&_tag=" + tagButton.textContent);
                    dataCopy = apiData.data;
                    displayFeed(dataCopy.slice(0,10));    
                    hideLoadingSpinner();
                } catch (error) {
                    console.log(error);
                    displayError();
                    hideLoadingSpinner();
                }
            }
            
            tagElement.append(tagButton);
            TagSelection.append(tagElement);
        }
    
        displayFeed(dataCopy.slice(0,10));

        hideLoadingSpinner();
            
    } catch (error) {
        console.log(error);
        displayError();
        hideLoadingSpinner();
    }
}

/**
 * @description Displays a feed containing posts with the provided data.
 * @param {Array} data
 * @returns {void}
 */
export function displayFeed(data) {
    const feed = document.querySelector("#feed");
    data.forEach(element => {
        const post = document.createElement("div");
        post.classList.add("container", "bg-white", "p-3", "mb-3");
        post.dataset.id = element.id;
        post.innerHTML= `<a href="../post/index.html?id=${element.id}" class="float-end"><i class="fas fa-arrow-up-right-from-square"></i></a>`;
        const postContent = displayPost(element);
        const postComments = commentSection(element.comments, element.reactions);
        post.append(postContent);
        post.append(postComments);
        feed.append(post);

        const bodyText = post.querySelector(".content");
        const bodyShowMore = post.querySelector(".show-more");
        if (bodyText.clientHeight < bodyText.scrollHeight) {
            bodyShowMore.style.display = "block";
        }
    });
    const postTest = feed.querySelectorAll("[data-id]");
    postTest.forEach(post => {
        post.addEventListener("click", handlePostInteraction);
    });            

} 

/**
 * @description Clear the content of the feed element.
 */
export function clearFeed() {
    const feed = document.querySelector("#feed");
    feed.innerHTML = "";
}

export function showAll(div, btn) {
    div.style.maxHeight = "none";
    btn.style.display = "none";
}

/**
 * @description Retrieve all posts with associated author, reactions, and comments data.
 * @returns {Promise<Array>} - A promise that resolves to an array containing all posts data.
 */
async function getAllPosts() {
    let datatest = await apiCall("/social/posts?_author=true&_reactions=true&_comments=true");
    const allDatatest = [];
    allDatatest.push(...datatest.data);
    while (!datatest.meta.isLastPage) {
        datatest = await apiCall(`/social/posts?_author=true&_reactions=true&_comments=true&page=${datatest.meta.currentPage + 1}`);
        allDatatest.push(...datatest.data);
    }
    return allDatatest;
}

/**
 * @description Set the active state for a specific button within a group of buttons.
 * @param {HTMLElement} button
 */
function setActive(button) {
    const myTabs = document.querySelectorAll("#myTab button");
    Array.from(myTabs).forEach(tab => {
        if (tab === button) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    })
}