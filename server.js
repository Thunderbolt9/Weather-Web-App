const express = require('express');
const app = express();
const https = require('https');
require('dotenv').config();

app.listen(3000, () => {
  console.log("Listening to 3000");
});

app.use(express.static('public'));

app.use(express.json());


app.post('/', (req, res) => {
  const lat = req.body.lat.toFixed(2);
  const lon = req.body.long.toFixed(2);
  const api_key = process.env.API_KEY;
  const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${api_key}&units=metric`;

  https.get(api_url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json({
        status: "success",
        data: JSON.parse(data)
      });
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});