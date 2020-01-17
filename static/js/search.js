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
            $movieTable.innerHTML += `<div class="movie-item">
            <a target='_blank' href="../pages/movie-detail.html?id=${movies[i+20*(page-1)].id}" id=${movies[i+20*(page-1)].id}>
            <img src=${movies[i+20*(page-1)].images.small} alt="cover">
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
    let movies = JSON.parse(localStorage.getItem('temp_data'));
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
    let movies = JSON.parse(localStorage.getItem('temp_data'));
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
    }
    let $movies = JSON.parse(localStorage.getItem('original_Data'));
    let $matchedMovies = [];
    for(let i=0;i<$movies.length;i++){
        if(toHanzi($movies[i].title).indexOf(searchInfo)!==-1){
            $matchedMovies.push($movies[i]);
        }
    }
    if($matchedMovies.length>0){
        localStorage.setItem('temp_data', JSON.stringify($matchedMovies));
        loadMovies(1, $matchedMovies);
    }
    else{
        alert('没有找到相关影片！')
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
    localStorage.setItem('temp_data', $original_Data);
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

function searchGenres(event){
    let searchInfo = event.target.innerHTML;
    let $movies = JSON.parse(localStorage.getItem('original_Data'));
    let $matchedMovies = [];
    for(let i=0;i<$movies.length;i++){
        for(let j=0;j<$movies[i].genres.length;j++){
            if(toHanzi($movies[i].genres[j]).indexOf(searchInfo)!==-1){
                $matchedMovies.push($movies[i]);
            }
        }
    }
    if($matchedMovies.length>0){
        localStorage.setItem('temp_data', JSON.stringify($matchedMovies));
        loadMovies(1, $matchedMovies);
    }
    else{
        alert('没有找到相关影片！')
    }
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

searchMovies();