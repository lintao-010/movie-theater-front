function searchMovieData(searchInfo) {
    var startTime = new Date().getTime();
    let options = {
      url: `http://localhost:8080/searchSimpleMovieInfo/${searchInfo}`,
      async: 'false',
      method: "get",
      headers: {
      },
      data: "",
      success: function(result) {
        localStorage.setItem(`searchData`, result);
        var endTime = new Date().getTime();
        console.log((endTime-startTime)/1000)
        if(result.length<10){
            alert("没有找到相关电影！")
        } else {
            loadMovies(1, JSON.parse(result));
        }
      }, 
      fail: function(error) {console.log('OMG!')}
    }
    ajax(options);
}

function searchGenreMovieData(genre) {
    var startTime = new Date().getTime();
    let options = {
      url: `http://localhost:8080/searchGenreSimpleMoviesInfo/${genre}`,
      async: 'false',
      method: "get",
      headers: {
      },
      data: "",
      success: function(result) {
        localStorage.setItem(`searchData`, result);
        var endTime = new Date().getTime();
        console.log((endTime-startTime)/1000)
        if(result.length<10){
            alert('没有找到相关类型影片！');
        } else {
            loadMovies(1, JSON.parse(result));
        }
      }, 
      fail: function(error) {console.log('OMG!')}
    }
    ajax(options);
}

function loadMovies(page, movies){
    let $movieTable = document.getElementById('movie-table');
    let $allMovies = $movieTable.parentElement;
    $allMovies.setAttribute('id', `allMoviesPage${page}`);
    $movieTable.innerHTML = '';
    for(let i=0;i<20;i++){
        if(i+20*(page-1)>movies.length-1){
            return;
        }
        else{
            let $imagesInfo = movies[i+20*(page-1)].images;
            let $smallImage = JSON.parse($imagesInfo.replace(/'/g, '"'));
            $movieTable.innerHTML += `<div class="movie-item">
            <a target='_blank' href="../pages/movie-detail.html?id=${movies[i+20*(page-1)].id}" id=${movies[i+20*(page-1)].id}>
            <img src=${$smallImage.small} alt="cover">
            </a>
            <div class="movie-info">
            <p>${toHanzi(movies[i+20*(page-1)].title)}</p>
            <p>${movies[i+20*(page-1)].year}</p>
            </div>
            </div>`;
        }
    }
}

function loadNextPage(event){
    let page =  Number(event.target.parentElement.id.slice(13,))+1;
    let movies = JSON.parse(localStorage.getItem('searchData'));
    if(page>Math.ceil(movies.length/20)){
        alert('没有更多电影了！');
        return;
    }
    else{
        loadMovies(page, movies);
    }
}

function loadPreviousPage(event){
    let page =  Number(event.target.parentElement.id.slice(13,))-1;
    let movies = JSON.parse(localStorage.getItem('searchData'));
    if(page===0){
        alert('已经是第一页！');
        return;
    }
    else{
        loadMovies(page, movies);
    }
}

function searchMovies(){
    let searchInfo = localStorage.getItem('searchInfo');
    document.getElementById('search-input').value = searchInfo;
    if(!searchInfo){
        alert('请输入搜索关键字！')
        return;
    } else {
        searchMovieData(searchInfo);
    }
}

function openSearch(event){
    let searchInfo = document.getElementById('search-input').value;
    if(!searchInfo){
        alert('请输入搜索关键字！')
        return;
    }
    else{
        localStorage.setItem('searchInfo', searchInfo);
    }
    document.getElementById('search-input').value = "请输入电影名称";
}

function initHomePage(){
    var $original_Data = localStorage.getItem('original_Data');
    localStorage.setItem('searchData', $original_Data);
    loadMovies(1, JSON.parse($original_Data));
}

function toHanzi(str){
    return eval('"'+str+'"');
}

function inArray(search,array){
    for(var i in array){
      if(array[i]===search){
      return true;
        }
    }
    return false;
}

function searchGenres(){
    let genre = localStorage.getItem('genre');
    console.log(genre+" searching");
    searchGenreMovieData(genre);
}

function openGenres(event){
    let searchInfo = event.target.innerHTML;
    localStorage.setItem('genre', searchInfo);
}

function sendMovieId(event){
    let $movieId = event.target.parentElement.id;
    console.log($movieId);
    localStorage.setItem('movieId', $movieId);
}

function openHomePage(){
    if(localStorage.getItem('orginal_Data')){
        initHomePage();
    }
    else{
        loadAllData();
    }
}

searchGenres();