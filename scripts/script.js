fetch('http://www.omdbapi.com/?type=series&s=friends&plot=full&r=json&page=5&apikey=6b6ec75b')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }
      response.json().then(function(data) {
          console.log(data)
            //showData(data['Search']);
      });
    }
  )
  .catch(function(err) {
    console.log('Error: ', err);
  });

  function showData(data){
        let box = document.getElementById("series_container")
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

