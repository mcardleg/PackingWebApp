import fetch from 'node-fetch';


let location = "Dublin,Ireland"
let key = "3e2d927d4f28b456c6bc662f34350957"
let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + key

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
    .catch(error => console.log('error', error));

