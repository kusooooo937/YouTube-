const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";

let nextPageToken = "";
let mode = "home"; // "home" か "search"
let currentQuery = ""; // 検索ワード保持

// 初回ロード（人気動画）
loadVideos(true);

// -------------------------
// 人気動画ロード（ホーム）
// -------------------------
function loadVideos(reset = false) {
    if (reset) {
        videoContainer.innerHTML = "";
        nextPageToken = "";
    }

    let url =
        "https://www.googleapis.com/youtube/v3/videos" +
        `?part=snippet&chart=mostPopular&regionCode=JP&maxResults=50` + // ← 50件
        (nextPageToken ? `&pageToken=${nextPageToken}` : "") +
        `&key=${API_KEY}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            nextPageToken = data.nextPageToken || "";
            renderVideos(data.items);
        });
}

// -------------------------
// 動画描画
// -------------------------
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

// -------------------------
// 検索
// -------------------------
searchBtn.onclick = () => doSearch();
searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
});

function doSearch(reset = true) {
    const q = reset ? searchInput.value : currentQuery;

    mode = "search";
    currentQuery = q;

    if (reset) {
        videoContainer.innerHTML = "";
        nextPageToken = "";
    }

    const url =
        "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=50` + // ← 50件
        (nextPageToken ? `&pageToken=${nextPageToken}` : "") +
        `&key=${API_KEY}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            nextPageToken = data.nextPageToken || "";

            // search API は id: { videoId: ... } なので整形
            const converted = data.items.map(i => ({
                id: i.id.videoId,
                snippet: i.snippet
            }));

            renderVideos(converted);
        });
}

// -------------------------
// 無限スクロール（ホーム & 検索共通）
// -------------------------
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        if (!nextPageToken) return;

        if (mode === "home") loadVideos(false);
        if (mode === "search") doSearch(false);
    }
});

// -------------------------
// ダークモード
// -------------------------
document.getElementById("darkModeBtn").onclick = () => {
    document.body.classList.toggle("dark");
};
