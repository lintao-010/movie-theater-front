localStorage.setItem('data', JSON.stringify(movies));

function loadMovies(page, movies){
    let $movieTable = document.getElementById('movie-table');
    let $allMovies = $movieTable.parentElement;
    $allMovies.setAttribute('id', `allMoviesPage${page}`);
    $movieTable.innerHTML = '';
    for(let i=0;i<20;i++){
        $movieTable.innerHTML += `<div class="movie-item">
                                  <img src=${movies.subjects[i+20*(page-1)].images.small} alt="cover">
                                  <div class="movie-info">
                                  <p>${movies.subjects[i+20*(page-1)].original_title}</p>
                                  <p>${movies.subjects[i+20*(page-1)].year}</p>
                                  </div>
                                  </div>`;
    }
}

function loadNextPage(event){
    let page =  Number(event.target.parentElement.id.split('').pop())+1;
    if(page>=5){
        alert('没有更多电影了！')
        return
    }
    movies = JSON.parse(localStorage.getItem('data'));
    console.log(page);
    loadMovies(page, movies);
}

function loadPreviousPage(event){
    let page =  Number(event.target.parentElement.id.split('').pop())-1;
    if(page===0){
        alert('已经是首页！');
        return
    }
    movies = JSON.parse(localStorage.getItem('data'));
    console.log(page);
    loadMovies(page, movies);
}

loadMovies(1, movies)