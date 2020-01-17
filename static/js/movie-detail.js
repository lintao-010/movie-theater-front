let container = document.querySelector(".movie-container")

function getMovieDetails(id) {
  let options = {
    url: `http://localhost:8888/v2/movie/subject/${id}?apikey=0df993c66c0c636e29ecbb5344252a4a`,
    method: "get",
    headers: {
    },
    data: "",
    success: function(result) {
      result = JSON.parse(result);
      renderDetailPage(result);
    }, 
    fail: function(error) {}
  }
  ajax(options);
}

function renderDetailPage(data){
  renderMovieName(data.title, data.original_title,  data.year);
  renderMovieGeneral(data);
  renderMovieDescribe(data);
  renderMovieComment(data);
  getSimilarMovies(data.genres);
}

function renderMovieName(cnName, oriName, year) {
  let htmlStr = `
<h2 class="movie-name">${cnName} — ${oriName}（${year}）</h2>
  `
  container.insertAdjacentHTML("afterbegin", htmlStr)
}

function renderMovieGeneral(data) {
  let htmlDirectorsStr = data.directors.reduce((pre, cur) => pre += `，${cur.name}`, "");
  htmlDirectorsStr = htmlDirectorsStr.substring(1);
  let htmlLangStr = data.languages.reduce((pre, cur) => pre += `/${cur}`, "");
  htmlLangStr = htmlLangStr.substring(1);
  let htmlCastsStr = data.casts.reduce((pre, cur) => pre += ` ${cur.name}`, "");
  htmlCastsStr = htmlCastsStr.substring(1);
  let htmlGenresStr = data.genres.reduce((pre, cur) => pre += `，${cur}`, "");
  htmlGenresStr = htmlGenresStr.substring(1);
  let htmlPubdatesStr = data.pubdates.reduce((pre, cur) => pre += `，${cur}`, "");
  htmlPubdatesStr = htmlPubdatesStr.substring(1);
  let htmlStr = `
<div class="movie-general">
  <img src="${data.images.large}" alt="Movie-image" class="movie-pic">
  <div class="movie-metadata">
    <p class="director-name">导演：${htmlDirectorsStr}</p>
    <p class="cast">主演：${htmlCastsStr}</p>
    <p class="categories">类型：${htmlGenresStr}</p>
    <p class="region">制片国家/地区：${data.countries}</p>
    <p class="lang">语言：${htmlLangStr}</p>
    <p class="movie-length">片长：${data.durations}</p>
    <p class="debut-date">上映时间：${htmlPubdatesStr}</p>
    <p class="score">豆瓣评分：${data.rating.average}</p>
    <button class="watch-online-btn">在线观看，选取线路</button>
  </div>
  <div class="movie-links">
    <h4>电影链接---</h4>
    <ul>
      ${getHtmlLinksStr(data.videos)}
    <ul>
  </div>
</div>
  `
  container.insertAdjacentHTML("beforeend", htmlStr);
}

function getHtmlLinksStr(links){
  let LinksStr = "";
  links.forEach(obj => {
    let needPay = "VIP收费"
    if (!needPay) {
      needPay = "免费！"
    }
    let tmpStr = `<li>● <a href="${obj.sample_link}">${obj.source.name}</a><span class="need-pay">${needPay}</span></li>`
    LinksStr += tmpStr;
  })
  return LinksStr;
}

function renderMovieDescribe(data){
  let htmlStr = `
<div class="describe">
  <h3 class="movie-subtitle">剧情简介</h3>
  <p>${data.summary}</p>
</div>
`
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function renderMovieComment(data){
  let htmlStr = `
<div class="comment">
  <h3 class="movie-subtitle">豆瓣影评 TOP5</h3>
  <ul class="comment-container">
    ${getCommentsLisStr(data.popular_reviews.slice(0, 5))}
  </ul>
</div>
`
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getCommentsLisStr(reviews){
  let lisStr = "";
  reviews.forEach(obj => {
    let tmpStr = `
    <li class="comment-row">
      <div>
        <img src="${obj.author.avatar}" class="user-avatar">
        <span>${obj.author.name}: ${obj.title}</span>
      </div>
      <p>${obj.summary}</p>
    </li>
    `
    lisStr += tmpStr;
  })
  return lisStr;
}

function renderSimilarMovies(data) {
  let htmlStr = `
    <div class="similar-movies">
      <h3 class="movie-subtitle">相似电影推荐</h3>
      <div class="movie-item-container">
        ${getSimilarMovieItemsStr(data.subjects)}
      </div>
    </div> `
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getSimilarMovieItemsStr(items){
  // items => list of 12 movie obj.
  let htmlStr = "";
  items.forEach(item => {
    let tmpStr = `
      <div class="movie-item">
        <img src="${item.images.large}"/>
        <p class="movie-item-name">${item.title}</p>
        <p class="movie-item-score">评分：${item.rating.average}</p>
      </div>`
    htmlStr += tmpStr;
  })
  return htmlStr
}

function getSimilarMovies() {
  let max = 200;
  let randomNum = parseInt(Math.random()*(max+1),10);
  let options = {
    url: `http://localhost:8888/v2/movie/top250?start=${randomNum}&count=12&apikey=0df993c66c0c636e29ecbb5344252a4a`,
    method: "get",
    headers: {},
    data: "",
    success: function(result) {
      result = JSON.parse(result);
      renderSimilarMovies(result);
    }, 
    fail: function(error) {}
  }
  ajax(options); 
}

getMovieDetails(JSON.parse(localStorage.getItem('movieId')));