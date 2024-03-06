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

export function sortByPopularity(data) {
    const newData = data.sort((a,b) => calculatePopularityScore(b) - calculatePopularityScore(a));
    return newData;
}

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

function calculatePopularityScore(post) {
    const comments = post._count.comments || 0;
    const reactions = post._count.reactions || 0;
    return comments*2 + reactions;
}