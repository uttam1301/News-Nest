const API_KEY = "28f9109669624d109b020002daa86b13";
const url = "https://newsapi.org/v2/everything?q=";

const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

toggleBtn.addEventListener('click', ()=>{
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    const isDark = body.classList.contains('dark-theme');
    themeIcon.textContent = isDark ? '☀️' : '🌙';  

    localStorage.setItem('theme', body.className);
});

window.addEventListener('DOMContentLoaded', ()=>{
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme){
        body.className = savedTheme;
        themeIcon.textContent = savedTheme == 'dark-theme' ? '☀️' : '🌙';
    }
});

window.addEventListener("load", () => fetchNews("India"));

function reload(){
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles){
    const cardContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardContainer.innerHTML = '';

    articles.forEach(article => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardContainer.appendChild(cardClone);
    })
}

function fillDataInCard(cardClone, article){
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} • ${date}`;

    cardClone.firstElementChild.addEventListener("click", ()=>{
        window.open(article.url, "_blank");
    });
}

let selectedNav = null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem = document.getElementById(id);
    selectedNav?.classList.remove("active");
    selectedNav = navItem;
    selectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", ()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    selectedNav?.classList.remove("active");
    selectedNav = null;
});

