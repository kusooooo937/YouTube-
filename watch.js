const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";
const videoId = new URLSearchParams(location.search).get("id");

// ---- 動画埋め込み ----
document.getElementById("player").src =
    `https://www.youtube.com/embed/${videoId}`;

// ---- 動画詳細 ----
fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        const v = d.items[0].snippet;
        videoTitle.textContent = v.title;
        videoChannel.textContent = v.channelTitle;
    });

// ---- 関連動画（修正版） ----
fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=20&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        d.items.forEach(v => {
            const html = `
            <a class="video" href="watch.html?id=${v.id.videoId}">
                <img src="${v.snippet.thumbnails.medium.url}">
                <div class="title">${v.snippet.title}</div>
                <div class="channel">${v.snippet.channelTitle}</div>
            </a>`;
            related.insertAdjacentHTML("beforeend", html);
        });
    });
