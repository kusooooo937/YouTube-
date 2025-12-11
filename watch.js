const API_KEY = "AIzaSyBGFcZMm0b_H258F-CB7GkP-ycSg5ZsZOE";

const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

document.getElementById("player").src =
    `https://www.youtube.com/embed/${videoId}?autoplay=1`;

loadRelated();

async function loadRelated() {
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=10&key=${API_KEY}`
    );
    const data = await res.json();

    const area = document.getElementById("relatedList");
    area.innerHTML = "";

    data.items.forEach(v => {
        const div = document.createElement("div");
        div.className = "related-item";
        div.innerHTML = `
            <img src="${v.snippet.thumbnails.medium.url}">
            <div>
                <p><b>${v.snippet.title}</b></p>
                <p>${v.snippet.channelTitle}</p>
            </div>
        `;
        div.onclick = () => {
            location.href = `watch.html?id=${v.id.videoId}`;
        };
        area.appendChild(div);
    });
}
