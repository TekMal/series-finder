const searchButton = document.getElementById('find')
const mainSection = document.getElementById("series-container")
const plotLength = 100
searchButton.addEventListener('click', searchSeries)

function searchSeries(){
    clearBox('series-container')
    const inputSearch = (document.getElementById('series-search').value).toString()
    fetch(`http://www.omdbapi.com/?type=series&s=${inputSearch}&r=json&apikey=6b6ec75b`)
    .then(
    function(response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function(data) {
          if(data['Response'] === 'True'){
            getTotalResults(Math.ceil(data['totalResults'] / 10), inputSearch)
          }
          else{
            noResults('No results')
          }
      })
    }
  )
  .catch(function(err) {
    console.log('Error: ', err)
  })
}
function getTotalResults(pages, title){
    const urlsForPages = []
    for(let i=1; i<=pages; i++){
        urlsForPages.push(fetch(`http://www.omdbapi.com/?type=series&s=${title}&r=json&page=${i}&apikey=6b6ec75b`))
    }
    Promise.all(urlsForPages).then(response => response.forEach(response => response.json().then(data => getAllData(data['Search']))))
}

function getAllData(data){
    data.forEach(item => {
        getSingleSeriesById(item.imdbID)
      })
}
const allResults = []
function getSingleSeriesById(id){
    fetch(`http://www.omdbapi.com/?type=series&i=${id}&plot=short&r=json&apikey=6b6ec75b`)
    .then(
    function(response) {
      if (response.status !== 200) {
        console.log(response.status)
      }
      response.json().then(function(data) {
          if(data['Response'] === 'True'){
            mainSection.appendChild(createSingleSeriesItem(data))
            allResults.push(data)
            console.log(allResults)
          }
          else{
            console.log("no result response : false")
          }
      })
    }
  )
  .catch(function(err) {
    console.log('Error: ', err)
  })
}

function createSingleSeriesItem(item){
    const seriesBox = createElementWithClassname('div', 'single-series')
    const poster = createElementWithClassname('div', 'poster-box')
    const description = createElementWithClassname('div', 'description')
    poster.appendChild(createPoster(item))
    description.appendChild(createTitle(item))
    description.appendChild(createDate(item))
    description.appendChild(createRuntime(item))
    description.appendChild(createRating(item))
    description.appendChild(createPlot(item))
    seriesBox.appendChild(poster)
    seriesBox.appendChild(description)
    return seriesBox
}

function createPoster(item){
    const image = createElementWithClassname('img', 'poster')
        if(item.Poster !== "N/A"){
            image.src = item.Poster}
        else{
            image.src = "https://images.unsplash.com/photo-1497514440240-3b870f7341f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80"
        }
    return image
}
function createTitle(item){
    const title = createElementWithClassname('h2', 'title')
    title.innerHTML = item.Title
    return title
}
function createDate(item){
    const year = createElementWithClassname('p', 'year')
        if(item.Year !== "N/A"){
            year.innerHTML = item.Year}
        else{
            year.innerHTML = "unknown"
        }
    return year
}
function createRuntime(item){
    const runtime = createElementWithClassname('p', 'runtime')
    if(item.Runtime !== "N/A"){
        runtime.innerHTML = item.Runtime}
    else{
        runtime.innerHTML = "unknown"
    }
    return runtime
}
function createRating(item){
    const rating = createElementWithClassname('p', 'rating')
    if(item.Ratings.length !== 0){
        rating.innerHTML = item.Ratings[0].Value}
    else{
        rating.innerHTML = "unknown"
    }
    return rating
}
function createPlot(item){
    const plot = createElementWithClassname('p', 'plot')
    if(item.Plot !== "N/A"){
        plot.innerHTML = item.Plot.substring(0, plotLength)}
    else{
        plot.innerHTML = "unknown"
    }
    return plot
}

function clearBox(elementID){
    document.getElementById(elementID).innerHTML = ""
}

function createElementWithClassname(elementTag, elementClassName){
    const element = document.createElement(elementTag)
    element.className = elementClassName
    return element
}

function noResults(content){
    const box = document.getElementById("series-container")
    const info = createElementWithClassname('h2', 'info-no-results')
    info.innerHTML = content
    box.appendChild(info)
}
