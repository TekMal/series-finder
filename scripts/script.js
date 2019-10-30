fetch('http://www.omdbapi.com/?type=series&s=friends&plot=full&r=json&apikey=6b6ec75b')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Error: ', err);
  });