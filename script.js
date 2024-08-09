// List of cities and their AccuWeather API ids
const cities = [
  { name: "Chennai", id: "206671" },
  { name: "Bangalore", id: "204108" },
  { name: "Hyderabad", id: "3-202190_1_al" },
  { name: "Gurgaon", id: "188408" },
  { name: "Ahmedabad", id: "202438" },
  { name: "Bhubaneshwar", id: "189781" },
];

//Selecting Elemnts
let cityName = document.getElementById("cityName");
let weatherIcon = document.getElementById("weatherIcon");

let tempMain = document.getElementById("tempMain");
let realFeel = document.getElementById("realFeel");
let minTemp = document.getElementById("minTemp");
let maxTemp = document.getElementById("maxTemp");
let dewPoint = document.getElementById("dewPoint");

let humidityMain = document.getElementById("humidityMain");
let indHumidity = document.getElementById("indHumidity");
let wetBulb = document.getElementById("wetBulb");
let API_KEY = 'OP1LSfphgOdIP7TzqPyG4cOCq6C7yz7w';
let precipitationMain = document.getElementById("precipitationMain");
let uvIndex = document.getElementById("uvIndex");

let windMain = document.getElementById("windMain");
let windGusts = document.getElementById("windGusts");
let visibilityMain = document.getElementById("visibilityMain");
let pressureMain = document.getElementById("pressureMain");
let cloudCover = document.getElementById("cloudCover");

let queryCity = "New Delhi";

//fetching the location key
async function getLocationKey(queryCity) {
  const BASE_URL = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${queryCity}&language=en-us`;
  try {
    let res = await fetch(BASE_URL);
    let data = await res.json();
    // console.log("Location Data: ", data);
    cityName.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data[0].LocalizedName}, ${data[0].AdministrativeArea.LocalizedName}, ${data[0].Country.LocalizedName}`;
    return data[0].Key;
  } catch (err) {
    // console.log("Error: ", err);
  }
}

getLocationKey(queryCity)
  .then((locationKey) => {
    // console.log("Getting location key");
    getLocationInfo(locationKey, API_KEY);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Fetching weather data for the selected location
async function getLocationInfo(locationKey, API_KEY) {
  const MAIN_URL = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&language=en-us&details=true`;
  try {
    let res = await fetch(MAIN_URL);
    // console.log(res);

    if (res.ok==false) {
      // Parse JSON from the response
      let errorData = await res.json();

      // Check for specific error messages or codes
      if (res.status === 503 && errorData.Code === "ServiceUnavailable") {
        alert("API Calls Limit exceeded. Please try again after 24 hours.");
        return; // Exit the function to prevent further processing
      } else {
        // Handle other non-200 responses
        throw new Error(alert("Searched city could not be found"));
      }
    }

    let data = await res.json();
    // console.log("Weather Data: ", data);

    let iconNumber = data[0].WeatherIcon;
    function iconinfo(num) {
        if (num < 10){
            iconNumber = `0${num}`;
        }else {
            iconNumber = num;
        }
    };
    iconinfo(iconNumber);
    weatherIcon.innerHTML = `<img typeof="foaf:Image" class="img-responsive" 
    src="https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png" 
    width="75" height="45" alt="Weather Icon" title="Weather Icon"> ${data[0].WeatherText}`;

    tempMain.innerHTML = `${data[0].Temperature.Metric.Value} &deg; C`;
    realFeel.innerHTML = `REAL FEEL : ${data[0].RealFeelTemperature.Metric.Value} &deg; C`;
    minTemp.innerHTML = `MINIMUM TEMPERATURE : ${data[0].TemperatureSummary.Past24HourRange.Minimum.Metric.Value} &deg; C`;
    maxTemp.innerHTML = `MAXIMUM TEMPERATURE : ${data[0].TemperatureSummary.Past24HourRange.Maximum.Metric.Value} &deg; C`;
    dewPoint.innerHTML = `DEW POINT : ${data[0].DewPoint.Metric.Value} &deg; C`;

    humidityMain.innerHTML = `${data[0].RelativeHumidity} %`;
    indHumidity.innerHTML = `INDOOR HUMIDITY : ${data[0].IndoorRelativeHumidity} %`;
    wetBulb.innerHTML = `WET BULB TEMPERATURE : ${data[0].WetBulbTemperature.Metric.Value} &deg; C`;
    precipitationMain.innerHTML = `PRECIPITATION (PAST 24 HOURS) : ${data[0].PrecipitationSummary.Past24Hours.Metric.Value} mm`;
    uvIndex.innerHTML = `UV INDEX : ${data[0].UVIndex} (${data[0].UVIndexText})`;

    windMain.innerHTML = `${data[0].Wind.Speed.Metric.Value} Km/Hr --> ${data[0].Wind.Direction.Localized}`;
    windGusts.innerHTML = `WIND GUSTS : ${data[0].WindGust.Speed.Metric.Value} Km/Hr`;
    visibilityMain.innerHTML = `VISIBILITY : ${data[0].Visibility.Metric.Value} Km`;
    pressureMain.innerHTML = `PRESSURE : ${data[0].Pressure.Metric.Value} mb`;
    cloudCover.innerHTML = `CLOUD COVER : ${data[0].CloudCover} %`;
  } catch (err) {
    console.log("Error MAIN: ", err);
    alert("API Calls Limit exceeded. Please try again after 24 hours");
  }
}

// fetching weather information for table
async function fetchWeather(locationKey, API_KEY, cityName) {
  const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${API_KEY}&language=en-us&details=true`;
  // Fetch weather data from AccuWeather API
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await res.json();
    return data; // Assuming API returns current weather data
  } catch (error) {
    console.error(`Error fetching weather data for ${cityName} in table`, error);
    alert(`Error fetching weather data for ${cityName} in table`);
    return;
  }
}

// populate weather data in the table
async function populateWeatherData(cities, API_KEY) {
  try{
  const table = document.getElementById("weatherTable"); // Assuming table has id="weatherTable"
  const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr"); // Get the rows in tbody

  // Loop through each location key to fetch and populate weather data
  for (let i = 0; i < cities.length; i++) {
    const locationKey = cities[i].id;
    // console.log(locationKey);
    const data = await fetchWeather(locationKey, API_KEY, cities[i].name);
    // console.log(data);

    if (!data) {
      console.error(`Failed to fetch weather data for location key: ${locationKey}`);
      continue;
    }

    // Populate table cells with weather data for the current city
    rows[i].cells[1].textContent = `${Math.round(data[0].Temperature.Metric.Value)}`; //Temperature
    rows[i].cells[2].textContent = `${Math.round(data[0].RealFeelTemperature.Metric.Value)}`; //Real Feel
    rows[i].cells[3].textContent = `${data[0].RelativeHumidity}`; //Humidity
    rows[i].cells[4].textContent = `${Math.round(data[0].TemperatureSummary.Past24HourRange.Minimum.Metric.Value)}`; //Minimum Temperature
    rows[i].cells[5].textContent = `${Math.round(data[0].TemperatureSummary.Past24HourRange.Maximum.Metric.Value)}`; //Maximum Temperature
    rows[i].cells[6].textContent = `${data[0].UVIndex}`; //uv index
    rows[i].cells[7].textContent = `${Math.round(data[0].PrecipitationSummary.Past24Hours.Metric.Value)}`; //precip_mm index
    rows[i].cells[8].textContent = `${Math.round(data[0].Visibility.Metric.Value)}`; //visibility
    rows[i].cells[9].textContent = `${Math.round(data[0].Wind.Speed.Metric.Value)}`; //wind speed
    rows[i].cells[10].textContent = `${Math.round(data[0].DewPoint.Metric.Value)}`; //dew point
  }
  } catch (error) {
    console.error("Error populating weather data:", error);
    alert("Error populating weather data for table");
  }
}
populateWeatherData(cities, API_KEY);


// Search functionality
let searchButton = document.getElementById("searchButton");
searchButton.addEventListener('click', function() {
  queryCity = document.getElementById("searchInput").value.trim();
  if (queryCity === "") {
    alert("Please enter a city name");
    return;
  }
  getLocationKey(queryCity)
   .then((locationKey) => {
      // console.log(locationKey);
      getLocationInfo(locationKey, API_KEY);
    })
   .catch((error) => {
      console.error("Error:", error);
    });
});

// Function to handle city selection
function handleCityClick(event) {
  const city = event.currentTarget.getAttribute('value');
  if (city) {
    // console.log('city selected is ' + city);
    getLocationKey(city)
    .then((locationKey) => {
      // console.log("Getting location key");
      getLocationInfo(locationKey, API_KEY);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
}

// Add click event listeners to all dropdown items
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', handleCityClick);
});

//Preventing user to refresh the page frequently
