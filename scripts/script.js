const searchButton = document.getElementById('find')
const inputSearch = document.getElementById('series-search')
const mainSection = document.getElementById("series-container")
const ratingButtons = document.querySelectorAll("[id=filter-rating]")
const plotLength = 100
let allResults = []
//const controller = new AbortController()
//const signal = controller.signal
searchButton.addEventListener('click', searchSeries)
addKeypressSearch(inputSearch)
function searchSeries(){
    allResults = []
    clearBox('series-container')
    const inputSearchValue = inputSearch.value.toString()
    fetch(`http://www.omdbapi.com/?type=series&s=${inputSearchValue}&r=json&apikey=40e9cece`)
    .then(
    function(response) {
        if (response.status !== 200) {
            console.log(response.status)
        }
        response.json().then(function(data) {
            if(data['Response'] === 'True'){
                getTotalResults(Math.ceil(data['totalResults'] / 10), inputSearchValue)
            }
            else{
                noResults('Any results')
            }
        })
    })
  .catch(function(err) {
        console.log('Error: ', err)
  })
}
function getTotalResults(pages, title){
    const urlsForPages = []
    for(let i=1; i<=pages; i++){
        urlsForPages.push(fetch(`http://www.omdbapi.com/?type=series&s=${title}&r=json&page=${i}&apikey=40e9cece`))
    }
    Promise.all(urlsForPages).then(response => response.forEach(response => response.json().then(data => getAllData(data['Search']))))
}
function getAllData(data){
    data.forEach(item => {
        getSingleSeriesById(item.imdbID)
    })
}
function getSingleSeriesById(id){
    fetch(`http://www.omdbapi.com/?type=series&i=${id}&plot=short&r=json&apikey=40e9cece`)
    .then(
    function(response) {
        if (response.status !== 200) {
            console.log(response.status)
        }
        response.json().then(function(data) {
            if(data['Response'] === 'True'){
                mainSection.appendChild(createSingleSeriesItem(data))
                allResults.push(data)
            }
            else{
                console.log("no result response : false")
            }
        })
    })
    .catch(function(err) {
        console.log('Error: ', err)
    })
}
function createSingleSeriesItem(item){
    const seriesBox = createElementWithClassname('div', 'main-section__single-series')
    const poster = createElementWithClassname('div', 'single-series__poster-box')
    const description = createElementWithClassname('div', 'single-series__description')
    poster.appendChild(createPoster(item))
    description.appendChild(createTitle(item))
    description.appendChild(createDate(item))
    description.appendChild(createRuntime(item))
    description.appendChild(createRating(item))
    description.appendChild(createPlot(item))
    if(item.Awards !== "N/A"){
        let star = createElementWithClassname('img', 'star')
        star.src="https://img.icons8.com/color/48/000000/star--v2.png"
        description.appendChild(star)
    }
    seriesBox.appendChild(poster)
    seriesBox.appendChild(description)
    return seriesBox
}
function createPoster(item){
    const image = createElementWithClassname('img', 'poster-box__poster')
        if(item.Poster !== "N/A"){
            image.src = item.Poster}
        else{
            image.src = "https://images.unsplash.com/photo-1497514440240-3b870f7341f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80"
        }
    return image
}
function createTitle(item){
    const title = createElementWithClassname('h2', 'description__title')
    title.innerHTML = item.Title
    return title
}
function createDate(item){
    const year = createElementWithClassname('p', 'description__year')
        if(item.Year !== "N/A"){
            if(isNaN(item.Year.slice(-1))){
                year.innerHTML = item.Year.slice(0, -1)
            }
            else{
                year.innerHTML = item.Year
            }
        }
        else{
            year.innerHTML = "unknown"
        }
    return year
}
function createRuntime(item){
    const runtime = createElementWithClassname('p', 'description__runtime')
    if(item.Runtime !== "N/A"){
        runtime.innerHTML = item.Runtime}
    else{
        runtime.innerHTML = "unknown"
    }
    return runtime
}
function createRating(item){
    const rating = createElementWithClassname('p', 'description__rating')
    if(item.Ratings.length !== 0){
        rating.innerHTML = item.Ratings[0].Value
    }
    else{
        rating.innerHTML = "unknown"
    }
    return rating
}
function createPlot(item){
    const plot = createElementWithClassname('p', 'description__plot')
    if(item.Plot !== "N/A"){
        plot.innerHTML = "Plot: " + item.Plot.substring(0, plotLength)}
    else{
        plot.innerHTML = "unknown"
    }
    return plot
}
document.getElementById('sort-year').addEventListener('click', function (){
    sortItemByYear(allResults)
})
document.getElementById('sort-rating').addEventListener('click', function (){
    sortItemByRating(allResults)
})
document.getElementById('sort-title').addEventListener('click', function (){
    sortItemByTitle(allResults)
})

ratingButtons.forEach(item => {
    item.addEventListener('click', function (){
        filterRating(item.innerHTML, allResults)
    })
})
function filterRating(rating, data){
    const filteredData = data.filter(item => {
        if(item.Ratings.length !== 0){
            return item.Ratings[0].Value.slice(0, 1) == rating
        }
    })
    renderNewFilteredOrSortedData(filteredData, 'No series found with this rating')
}
function sortItemByYear(data){
    const sortedData = data.sort(function(a, b){return parseInt(a.Year.slice(0, 3)) - parseInt(b.Year.slice(0, 3))})
    renderNewFilteredOrSortedData(sortedData, 'Any results')
}
function sortItemByRating(data){
    const sortedData = data.sort(function(a, b){
        if(a.Ratings.length !== 0 && b.Ratings.length !== 0){
            return a.Ratings[0].Value.slice(0, 1) - b.Ratings[0].Value.slice(0, 1)
        }
        else{
            return 0
        }
    })
    renderNewFilteredOrSortedData(sortedData, 'Any results')
}
function sortItemByTitle(data){
    const sortedData = data.sort((a,b) => (a.Title > b.Title) ? 1 : ((b.Title > a.Title) ? -1 : 0))
    renderNewFilteredOrSortedData(sortedData, 'Any results')
}
function renderNewFilteredOrSortedData(data, info){
    clearBox('series-container')
    if(data.length > 0){
        data.forEach(item => {
            mainSection.appendChild(createSingleSeriesItem(item))
        })
    }
    else{
        noResults(info)
    }
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
function addKeypressSearch(element){
    element.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {
            searchSeries()
        }
    })
}