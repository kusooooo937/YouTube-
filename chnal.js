const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";
const channelId = new URLSearchParams(location.search).get("id");

// チャンネル情報
fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        const c = d.items[0];

        const icon = c.snippet.thumbnails.default.url;
        const title = c.snippet.title;
        const desc = c.snippet.description;
        const subs = c.statistics.subscriberCount
            ? Number(c.statistics.subscriberCount).toLocaleString()
            : "非公開";

        document.getElementById("channelHeader").innerHTML = `
            <img src="${icon}">
            <div class="channel-info">
                <h2>${title}</h2>
                <div class="stats">登録者 ${subs} 人</div>
                <div class="desc">${desc}</div>
            </div>
        `;
    });


// 最新動画一覧
fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=30&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        d.items.forEach(v => {
            const html = `
                <a class="video" href="watch.html?id=${v.id.videoId}">
                    <img src="${v.snippet.thumbnails.medium.url}">
                    <div class="title">${v.snippet.title}</div>
                    <div class="channel">${v.snippet.channelTitle}</div>
                </a>
            `;
            channelVideos.insertAdjacentHTML("beforeend", html);
        });
    });
