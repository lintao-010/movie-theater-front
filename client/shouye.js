localStorage.setItem('original_data', JSON.stringify(movies.subjects));

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
            <img src=${movies[i+20*(page-1)].images.small} alt="cover">
            <div class="movie-info">
            <p>${toHanzi(movies[i+20*(page-1)].title)}</p>
            <p>${movies[i+20*(page-1)].year}</p>
            </div>
            </div>`;
        }
    }
}

function loadNextPage(event){
    let page =  Number(event.target.parentElement.id.split('').pop())+1;
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
    let page =  Number(event.target.parentElement.id.split('').pop())-1;
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
    let searchInfo = document.getElementById('search-input').value;
    if(!searchInfo){
        alert('请输入搜索关键字！')
        return;
    }
    let $movies = JSON.parse(localStorage.getItem('original_data'));
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

function initHomePage(){
    var $original_data = localStorage.getItem('original_data');
    localStorage.setItem('temp_data', $original_data);
    loadMovies(1, JSON.parse($original_data));
}

function toHanzi(str){
    return eval('"'+str+'"');
}

initHomePage();

console.log(eval('"'+"\u72af\u7f6a"+'"'))