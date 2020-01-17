// Main Functions
function loadPartData(times) {
    var startTime = new Date().getTime();
    let start = times*100;
    let count = 100;
    if(times===2){count = 50;}
    let options = {
      url: `http://localhost:8888/v2/movie/top250?start=${start}&count=${count}&apikey=0df993c66c0c636e29ecbb5344252a4a`,
      async: 'false',
      method: "get",
      headers: {
      },
      data: "",
      success: function(result) {
        localStorage.setItem(`partData${times}`, result);
        console.log(`Data Get${times}`);
        var endTime = new Date().getTime();
        console.log((endTime-startTime)/1000)
        localStorage.setItem('flag', times);
      }, 
      fail: function(error) {console.log('OMG!')}
    }
    ajax(options);
  }

function loadAllData(){
    localStorage.clear();
    let $allData = [];
    for(let i=0;i<3;i++){
        loadPartData(i);
    }
    if(localStorage.getItem('flag')!=='0'){
        setTimeout( function(){
            for(let j=0;j<3;j++){
                var $tempData = JSON.parse(localStorage.getItem(`partData${j}`)).subjects;
                $allData = $allData.concat($tempData);
                localStorage.removeItem(`partData${j}`);
            }
            localStorage.setItem('original_Data', JSON.stringify($allData));
            initHomePage();
            console.log('Movie Loading Finished')
        }, 8000); 
    }
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
            $movieTable.innerHTML += `<div class="movie-item">
            <a target='_blank' href="../pages/movie-detial.html" onclick='sendMovieId(event)' id=${movies[i+20*(page-1)].id}>
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
    let searchInfo = document.getElementById('search-input').value;
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

// Some Helper Functions
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

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
    }//暂停一段时间 10000=1S。
}



//loadAllData();