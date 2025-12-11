const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";
const videoId = new URLSearchParams(location.search).get("id");

document.getElementById("player").src =
    `https://www.youtube.com/embed/${videoId}`;

// 詳細取得
fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        const v = d.items[0].snippet;
        videoTitle.textContent = v.title;
        videoChannel.textContent = v.channelTitle;
    });

// コメント取得
fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        d.items.forEach(c => {
            const t = c.snippet.topLevelComment.snippet;
            comments.insertAdjacentHTML("beforeend", `
                <div style="padding:10px;border-bottom:1px solid #444;">
                    <div><b>${t.authorDisplayName}</b></div>
                    <div>${t.textOriginal}</div>
                </div>
            `);
        });
    });

// 関連動画
fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=15&key=${API_KEY}`)
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
