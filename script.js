const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE"; // ←ここを書き換える！

function search() {
    const q = document.getElementById("query").value;
    if (!q) return;

    fetch("https://www.googleapis.com/youtube/v3/search?" + new URLSearchParams({
        key: API_KEY,
        part: "snippet",
        q: q,
        maxResults: 12,
        type: "video"
    }))
    .then(res => res.json())
    .then(data => {
        const results = document.getElementById("results");
        results.innerHTML = "";

        data.items.forEach(item => {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const thumb = item.snippet.thumbnails.medium.url;

            const div = document.createElement("div");
            div.className = "video";
            div.innerHTML = `
                <img src="${thumb}">
                <p>${title}</p>
            `;
            div.onclick = () => {
                document.getElementById("player").src =
                    `https://www.youtube.com/embed/${videoId}`;
            };

            results.appendChild(div);
        });
    });
}
