const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";

let nextPageToken = "";
let mode = "home";

// 初回ロード
loadVideos();

// 動画ロード
function loadVideos(reset = false) {
    if (reset) {
        videoContainer.innerHTML = "";
        nextPageToken = "";
    }

    let url =
        "https://www.googleapis.com/youtube/v3/videos" +
        `?part=snippet&chart=mostPopular&regionCode=JP&maxResults=20` +
        (nextPageToken ? `&pageToken=${nextPageToken}` : "") +
        `&key=${API_KEY}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            nextPageToken = data.nextPageToken || "";
            renderVideos(data.items);
        });
}

// 動画描画
function renderVideos(list) {
    list.forEach(v => {
        const html = `
        <a class="video" href="watch.html?id=${v.id}">
            <img src="${v.snippet.thumbnails.medium.url}">
            <div class="title">${v.snippet.title}</div>
            <div class="channel">${v.snippet.channelTitle}</div>
        </a>`;
        videoContainer.insertAdjacentHTML("beforeend", html);
    });
}

// 検索
searchBtn.onclick = () => doSearch();
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
});
function doSearch() {
    const q = searchInput.value;
    mode = "search";
    videoContainer.innerHTML = "";
    nextPageToken = "";

    const url =
        "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=20&key=${API_KEY}`;

    fetch(url)
        .then(r => r.json())
        .then(data => renderVideos(data.items.map(i => ({ id: i.id.videoId, snippet: i.snippet }))));
}

// 無限スクロール
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        if (nextPageToken) loadVideos();
    }
});

// ダークモード
document.getElementById("darkModeBtn").onclick = () => {
    document.body.classList.toggle("dark");
};
