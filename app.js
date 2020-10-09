
const key = 'UaP2ou06sEWBbP49ECYbTP5oGBQy6Xfg';
const form = document.querySelector('.form-control');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = form.city.value.trim();
    Send(city, Receive);
    form.reset();
});

function Send(city, callback) {
    const url = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${key}&q=${city}`;
    const request = new XMLHttpRequest();
    request.open('GET', url + query, true);
    request.onload = function () {
        const data = JSON.parse(request.responseText);
        console.log(data);
        const loc_key = data[0].Key;
        const country = data[0].Country.LocalizedName;
        callback(loc_key, city,country, populate);
    };
    request.send();
}

function Receive(loc_key,city,country,callback) {
    const forecast = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${loc_key}`;
    const fetch_query = `?apikey=${key}`;
    const frcast = new XMLHttpRequest();
    frcast.open('GET', forecast + fetch_query, true);
    frcast.onload = function () {
        const jdata = JSON.parse(frcast.responseText);
        console.log(jdata);
        callback(city,jdata,country);
    };
    frcast.send();
}

function populate(city,jdata,country) {
    let tem = jdata[0].Temperature.Value;
    tem = Math.round((tem - 32) * (5 / 9));
    const timet = jdata[0].IsDaylight;
    const ic = jdata[0].WeatherIcon;
    document.querySelector('.icon').innerHTML=`<img src="icons/${ic}.png">`;
    if (timet) {

        document.querySelector('.card img').setAttribute('src', `https://source.unsplash.com/400x220/?${city},sunlight`);
    }
    else {
        document.querySelector('.card img').setAttribute('src', `https://source.unsplash.com/400x220/?${city},night`);
    }
    document.querySelector('.card').classList.add('show');
    document.querySelector('.temper').querySelector('span').innerText = tem;
    document.querySelector('.card-details h4').innerText = String(city)[0].toUpperCase()+String(city).substring(1)+", "+country;
    document.querySelector('.wt-cond span').innerText=jdata[0].IconPhrase;
}
