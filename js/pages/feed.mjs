export function displayFeed(data) {
    const feed = document.querySelector("#feed");
    data.data.forEach(element => {
        feed.append(displayPost(element));
    });
} 

function displayPost(data) {
    const post = document.createElement("div");
    post.classList.add("container", "bg-white" , "p-3", "mb-3");
    const header = createPostHeader(data);
    const body = createPostBody(data);
    const reactions = createReactElements(data);
    const comments = createComments(data);
    post.append(header);
    post.append(body);
    post.append(reactions);
    post.append(comments);
    return post;
}

function createPostHeader(data , comment = false) {
    const header = document.createElement("div");
    header.classList.add("border-bottom");
    if (comment) {
        header.innerHTML = `
        <div class="d-flex gap-2 align-items-center">
            <img src="${data.author.avatar.url}" class="user-icon-sm" alt="${data.author.avatar.alt}">
            <h4 class="fs-6">${data.author.name}</h4>
        </div>
        `
    } else {
        header.innerHTML = `
        <div class="d-flex gap-2 align-items-center">
            <img src="${data.author.avatar.url}" class="user-icon" alt="${data.author.avatar.alt}">
            <h2>${data.author.name}</h2>
        </div>
        `
    }
    const time = timePassed(data.created);
    header.append(time);
    return header;
}

function createPostBody(data) {
    const body = document.createElement("div");
    body.innerHTML = `
    <h3 class="sr-only">${data.title}</h3>
    <p>${data.body}</p>
    `
    if (data.media) {
        const image = createMediaElement(data.media);
        body.append(image);
    }
    return body;
}

function createReactElements(data) {
    const div = document.createElement("div");
    div.classList.add("bg-primary-subtle");
    div.innerHTML = `
    <button class="btn fs-3">💗</button>
    <button class="btn fs-3">😀</button>
    <button class="btn fs-3">🙁</button>
    <button class="btn" data-bs-toggle="collapse" data-bs-target="#collapseComment-${data.id}">Reply</button>
    `
    return div;
}

function createComments(data) {
    const div = document.createElement("div");
    div.classList.add("bg-body", "p-3");
    div.innerHTML = `
    <div class="d-inline-block border-bottom border-primary mb-3">
        <h3 class="fs-5">Comments (${data.comments.length})</h3>
    </div>
    <div class="collapse bg-body mb-3" id="collapseComment-${data.id}">
        <form class="col d-flex align-items-stretch rounded-pill">
            <div class="user-icon position-absolute"></div>
            <textarea class="form-control rounded-start-pill ps-5" style="height: 48px;" aria-label="post a comment"></textarea>
            <div class="d-grid">
                <button class="btn btn-primary rounded-end-pill">Comment</button>
            </div>
        </form>
    </div>
    `
    Array.from(data.comments).forEach(comment => {
        const com = document.createElement("div");
        const header = createPostHeader(comment, true);
        const body = createPostBody(comment);
        com.append(header);
        com.append(body);
        div.append(com);
    })
    return div;
}

function createMediaElement(media) {
    const image = document.createElement("img");
    image.classList.add("img-fluid");
    image.src = media.url;
    image.alt = media.alt;
    return image;
}

function timePassed(created) {
    const div = document.createElement("p");
    div.classList.add("text-black-50");
    const date = Date.parse(created);
    const timeElapsed = Date.now() - date;
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    div.textContent = `Posted ${days} days ago`;
    let time = "";
    switch (true) {
        case timeElapsed > 1000*60*60*24*7:
            time = Math.floor(timeElapsed / (1000*60*60*24*7)) + " weeks";
            break;
        case timeElapsed > 1000*60*60*24:
            time = Math.floor(timeElapsed / (1000*60*60*24)) + " days";
            break;
        case timeElapsed > 1000*60*60:
            time = Math.floor(timeElapsed / (1000*60*60)) + " hours";
            break;
        case timeElapsed > 1000*60:
            time = Math.floor(timeElapsed / (1000*60)) + " minutes"
        default:
            break;
    }
    div.textContent = `Posted ${time} ago`;
    return div;
}