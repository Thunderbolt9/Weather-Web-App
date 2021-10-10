const express = require('express');
const app = express();
const https = require('https');
const opencage = require('opencage-api-client');
const port = process.env.PORT || 3000;
require('dotenv').config();

app.listen(port, () => {
  console.log("Listening to 3000");
});

app.use(express.static('public'));

app.use(express.json());

// Post request for weather data
app.post('/', (req, res) => {
  const lat = req.body.lat;
  const lon = req.body.long;
  const api_key = process.env.API_KEY;
  const openCageApiKey = process.env.OPENCAGE_API_KEY;
  const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${api_key}&units=metric`;
  const api_url_cityName = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&pretty=1&key=${openCageApiKey}`;

  https.get(api_url_cityName, (response) => {
    let cn_data = '';
    response.on('data', (chunk) => {
      cn_data += chunk;
    });
    response.on('end', () => {
      cn_data = JSON.parse(cn_data);
      const countryCode = cn_data.results[0].components.country_code;
      const city_name = cn_data.results[0].components.city + ', ' + countryCode.charAt(0).toUpperCase() + countryCode.charAt(1);
      getData(city_name, api_url);
    });
  });


  function getData(city_name, api_url) {
    https.get(api_url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.json({
          status: "success",
          data: JSON.parse(data),
          cn: city_name
        });
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

});