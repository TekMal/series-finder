let searchButton = document.getElementById('find')
searchButton.addEventListener('click', searchSeries)

function searchSeries(){
    let inputSearch = (document.getElementById('series-search').value).toString()
    fetch(`http://www.omdbapi.com/?type=series&s=${inputSearch}&plot=full&r=json&apikey=6b6ec75b`)
    .then(
    function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }
      response.json().then(function(data) {
          createUrlForPages(Math.ceil(data['totalResults'] / 10), inputSearch)
      });
    }
  )
  .catch(function(err) {
    console.log('Error: ', err);
  });
}


function createUrlForPages(pages, title){
    let urlsForPages = []
    for(let i=1; i<=pages; i++){
        urlsForPages.push(fetch(`http://www.omdbapi.com/?type=series&s=${title}&plot=full&r=json&page=${i}&apikey=6b6ec75b`))
    }
    Promise.all(urlsForPages).then(response => response.forEach(response => response.json().then(data => showData(data['Search']))))
} 

  function showData(data){
        let box = document.getElementById("series-container")
        data.forEach(item => {
            let image = document.createElement("img")
            image.className = 'poster'
            if(item.Poster !== "N/A"){
                image.src = item.Poster}
            else{
                image.src = "https://images.unsplash.com/photo-1497514440240-3b870f7341f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80"
            }
        box.appendChild(image)
      })
  }

  //10 results 
  //fetch title
  //scroll 
  //rwd
