if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getWeatherData);

} else {
  alert("Can't access the location, Please turn on GPS")
}



async function getWeatherData(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const location = { lat, long };

  const options = {
    method: "POST",
    body: JSON.stringify(location),
    headers: {
      "Content-Type": "application/json",
      'Accept': 'application/json'
    }
  };

  // Client request for weather data to server
  const response = await fetch('/', options);
  const result = await response.json();

  showWeatherData(result);
};

const tz = document.getElementById('location');
const temp = document.getElementById('temp');
const desc = document.getElementById('description');

function showWeatherData(result) {
  tz.innerText = result.data.timezone;
  temp.innerText = result.data.current.temp.toPrecision(2) + '°';
  desc.innerText = result.data.current.weather[0].description;
  console.log(result.status);
}

