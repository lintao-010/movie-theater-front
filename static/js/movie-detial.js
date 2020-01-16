let container = document.querySelector(".movie-container")

function getMovieDetails(id) {
  options = {
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

getMovieDetails(26942674);

function renderDetailPage(data){
  console.log(JSON.stringify(data));
  renderMovieName(data.title, data.original_title,  data.year);
}

function renderMovieName(cnName, oriName, year) {
  let htmlStr = `
<h2 class="movie-name">${cnName} — ${oriName}（${year}）</h2>
  `
  container.insertAdjacentHTML("afterbegin", htmlStr)
}

