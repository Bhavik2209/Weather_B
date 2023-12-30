const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const port = 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const weatherData = {};

app.get("/", (req, res) => {
    res.render("index", {
        name: weatherData.name,
        temperature: weatherData.temperature,
        description: weatherData.description,
       
    });
});

app.post("/", (req, res) => {
    const city = req.body.cityName;
    const apiKey = "4244d0976f3b8dbeaaa7e375ca7a344d"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

   
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const weatherInfo = JSON.parse(data);
                weatherData.name = weatherInfo.name;
                weatherData.temperature = weatherInfo.main.temp;
                weatherData.description = weatherInfo.weather[0].description;
                // const icon = weatherData.weather[0].icon
                // weatherData.img = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                
                res.redirect("/");
            } catch (error) {
                console.error('Error parsing weather data:', error.message);
                res.status(500).send('Internal Server Error');
            }
        });
    }).on('error', (error) => {
        console.error('Error making API request:', error.message);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
