let container = document.querySelector(".movie-container")

function getMovieDetails(id) {
  let options = {
    url: `http://localhost:8080/theater_api/movie/${id}`,
    method: "get",
    headers: {
    },
    data: "",
    success: function (result) {
      result = JSON.parse(result);
      console.log(result);
      renderMovieName(result.title, result.originalTitle, result.year);
      renderMovieGeneral(result);
      getMovieLinks(movieId);
    },
    fail: function (error) { }
  }
  ajax(options);
}

function renderDetailPage(data) {
  // renderMovieName(data.title, data.original_title,  data.year);
  // renderMovieGeneral(data);
  renderMovieDescribe(data);
  renderMovieComment(data);
  getSimilarMovies(data.genres);
}

function renderMovieName(cnName, oriName, year) {
  document.title = cnName;
  let htmlStr = `
<h2 class="movie-name">${cnName} — ${oriName}（${year}）</h2>
  `
  container.insertAdjacentHTML("afterbegin", htmlStr)
}

function renderMovieGeneral(data) {
  let directors = JSON.parse(data.directors.replace(/'/g, '"'));
  console.log(directors)
  let htmlDirectorsStr = directors.reduce((pre, cur) => pre += `，${cur.name}`, "");
  htmlDirectorsStr = htmlDirectorsStr.substring(1);

  let languages = JSON.parse(data.languages.replace(/'/g, '"'));
  let htmlLangStr = languages.reduce((pre, cur) => pre += `/${cur}`, "");
  htmlLangStr = htmlLangStr.substring(1);

  let casts = JSON.parse(data.casts.replace(/'/g, '"'))
  let htmlCastsStr = casts.reduce((pre, cur) => pre += ` ${cur.name}`, "");
  htmlCastsStr = htmlCastsStr.substring(1);

  let genres = JSON.parse(data.genres.replace(/'/g, '"'));
  let htmlGenresStr = genres.reduce((pre, cur) => pre += `，${cur}`, "");
  htmlGenresStr = htmlGenresStr.substring(1);


  let pubdates = JSON.parse(data.pubdate.replace(/'/g, '"'));
  let htmlPubdatesStr = pubdates.reduce((pre, cur) => pre += `，${cur}`, "");
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
    <p class="debut-date">上映时间：${htmlPubdatesStr}</p>
    <p class="score">豆瓣评分：${data.average}</p>
    <button class="watch-online-btn">在线观看，选取线路</button>
  </div>`
  
  container.insertAdjacentHTML("beforeend", htmlStr);
}

function getMovieLinks(id) {
  let options = {
    url: `http://localhost:8080/theater_api/videos/${id}`,
    method: "get",
    headers: {
    },
    data: "",
    success: function (result) {
      result = JSON.parse(result);
      console.log("=============video==============")
      console.log(result);
      renderVideoLinks(result);
      getMovieDescribe(movieId);
    },
    fail: function (error) { }
  }
  ajax(options);
}

function renderVideoLinks(data) {
  let htmlStr = `
    <div class="movie-links">
      <h4>电影链接 ·  ·  · </h4>
      <ul>
        ${getHtmlLinksStr(data)}
      <ul>
    </div>
  </div> `
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getHtmlLinksStr(links) {
  let LinksStr = "";
  console.log("=============")
  console.log(links[0]);
  // TODO Sql Video增加name字段
  links.forEach(obj => {
    let needPay = "VIP收费"
    let needPayClassName = "need-pay"
    if (!obj.need_pay) {
      needPay = "免费！"
      needPayClassName = "free-watch"
    }
    let tmpStr = `<li>● <a href="${obj.sample_link}">${obj.name}</a><span class="${needPayClassName}">${needPay}</span></li>`
    LinksStr += tmpStr;
  })
  return LinksStr;
}

function getMovieDescribe(id) {
  let options = {
    url: `http://localhost:8080/theater_api/movie/${id}`,
    method: "get",
    headers: {
    },
    data: "",
    success: function (result) {
      result = JSON.parse(result);
      renderMovieDescribe(result);
      getMovieComment(id);
    },
    fail: function (error) { }
  }
  ajax(options);
}

function renderMovieDescribe(data) {
  let htmlStr = `
<div class="describe">
  <h3 class="movie-subtitle">剧情简介</h3>
  <p>${data.summary}</p>
</div>
`
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getMovieComment(id) {
  let options = {
    url: `http://localhost:8080/theater_api/popular_views/${id}`,
    method: "get",
    headers: {
    },
    data: "",
    success: function (result) {
      result = JSON.parse(result);
      renderMovieComment(result);
      getSimilarMovies();
    },
    fail: function (error) { }
  }
  ajax(options);
}

function renderMovieComment(data) {
  let htmlStr = `
<div class="comment">
  <h3 class="movie-subtitle">豆瓣影评 TOP5</h3>
  <ul class="comment-container">
    ${getCommentsLisStr(data.slice(0, 5))}
  </ul>
</div>
`
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getCommentsLisStr(reviews) {
  let lisStr = "";
  reviews.forEach(obj => {
    let author = JSON.parse(obj.author.replace(/'/g, '"'))
    let tmpStr = `
    <li class="comment-row">
      <div>
        <img src="${author.avatar}" class="user-avatar">
        <span>${author.name}: ${obj.title}</span>
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
        ${getSimilarMovieItemsStr(data)}
      </div>
    </div> `
  container.insertAdjacentHTML("beforeend", htmlStr)
}

function getSimilarMovieItemsStr(items) {
  // items => list of 12 movie obj.
  let htmlStr = "";
  items.forEach(item => {
    let imagesInfo = item.images;
    let largeImage = JSON.parse(imagesInfo.replace(/'/g, '"')).large;
    // TODO ratingAverage
    let tmpStr = `
      <div class="movie-item">
        <a target='_blank' href="./movie-detail.html?id=${item.id}" class="movie-item-image"><img src="${largeImage}"/></a>
        <a target='_blank' href="./movie-detail.html?id=${item.id}" class="movie-item-name">${item.title}</a>
        <a target='_blank' href="./movie-detail.html?id=${item.id}" class="movie-item-score">评分：${9.8}</a>
      </div>`
    htmlStr += tmpStr;
  })
  return htmlStr
}

function getSimilarMovies() {
  let max = 200;
  let randomNum = parseInt(Math.random() * (max + 1), 10);
  let options = {
    url: `http://localhost:8080/theater_api/similar?start=${randomNum}&count=12&apikey=0df993c66c0c636e29ecbb5344252a4a`,
    method: "get",
    headers: {},
    data: "",
    success: function (result) {
      result = JSON.parse(result);
      renderSimilarMovies(result);
    },
    fail: function (error) { }
  }
  ajax(options);
}

function getIdFromURL() {
  return window.location.href.split("=")[1];
}

let movieId = getIdFromURL();
getMovieDetails(movieId);