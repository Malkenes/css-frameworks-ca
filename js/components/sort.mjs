/**
 * @description Sorts the given array of posts by their popularity score and filters out posts older than 24 hours.
 * @param {Array<Object>} data 
 * @returns {Array<Object>}
 */
export function sortByTrending(data) {
    data.sort((a,b) => calculatePopularityScore(b) - calculatePopularityScore(a));

    const filteredAllPosts = data.filter((post) => {
        const date = Date.parse(post.created);
        const timeElapsed = Date.now() - date;
        if (timeElapsed <= 1000*60*60*24) {
            return true;
        } else {
            return false;
        }
    })
    return filteredAllPosts;
}

/**
 * @description Sorts the given array of data objects by their popularity score in descending order.
 * @param {Array<Object>} data
 * @returns {Array<Object>} Returns a sorted array of data objects by popularity score.
 */
export function sortByPopularity(data) {
    const newData = data.sort((a,b) => calculatePopularityScore(b) - calculatePopularityScore(a));
    return newData;
}

/**
 * @description Calculates the count of tags in the provided array of posts and returns them sorted by count in descending order.
 * @param {Array<Object>} posts
 * @returns {Array<string>}
 */
export function getTagCount(posts) {
    const tagCount = {};

    posts.forEach(post => {
        post.tags.forEach(tag => {
            if (tag.length > 1) {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            }
        })
    })

    Object.keys(tagCount).forEach(tag => {
        if (tagCount[tag] === 1) {
            delete tagCount[tag];
        }
    })

    const tagsTest = Object.keys(tagCount).map(tag => ({tag, count: tagCount[tag]})); 

    tagsTest.sort((a,b) => b.count - a.count);
    const sortedTags = tagsTest.map(item => item.tag);
    return sortedTags;
}

/**
 * @description Calculates the popularity score of a post based on the number of comments and reactions it has.
 * @param {Object} post
 * @param {number} [post._count.comments=0]
 * @param {number} [post._count.reactions=0]
 * @returns {number}
 */
function calculatePopularityScore(post) {
    const comments = post._count.comments || 0;
    const reactions = post._count.reactions || 0;
    return comments*2 + reactions;
}