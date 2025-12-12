const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";
const videoId = new URLSearchParams(location.search).get("id");

document.getElementById("player").src =
    `https://www.youtube.com/embed/${videoId}`;

// 動画詳細
fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
    .then(r => r.json())
    .then(d => {
        const v = d.items[0].snippet;
        const channelId = d.items[0].snippet.channelId;     // ←追加
        const channelName = v.channelTitle;

        // タイトル
        videoTitle.textContent = v.title;

        // ⭐チャンネル名をリンクに変更（チャンネルページへ飛べる）
        videoChannel.innerHTML = `
            <a href="channel.html?id=${channelId}" 
               style="color: var(--fg); text-decoration:none; font-weight:bold;">
               ${channelName}
            </a>`;
    });


// 関連動画（安定版）
fetch(`
https://www.googleapis.com/youtube/v3/search
    ?part=snippet
    &relatedToVideoId=${videoId}
    &type=video
    &maxResults=20
    &regionCode=JP
    &key=${API_KEY}
`.replace(/\s+/g, ''))
    .then(r => r.json())
    .then(d => {
        if (!d.items || d.items.length === 0) {
            related.innerHTML = "<div style='padding:10px;'>関連動画が取得できませんでした。</div>";
            return;
        }

        d.items.forEach(v => {
            const html = `
                <a class="video" href="watch.html?id=${v.id.videoId}">
                    <img src="${v.snippet.thumbnails.medium.url}">
                    <div class="title">${v.snippet.title}</div>
                    <div class="channel">${v.snippet.channelTitle}</div>
                </a>`;
            related.insertAdjacentHTML("beforeend", html);
        });
    })
    .catch(err => {
        related.innerHTML = "エラー: " + err;
    });
