import fetch from 'node-fetch';
import express from 'express';

let rain = (list) => {
    let rain = false

    for (let i=0; i<list.length; i++){
        if (list[i].hasOwnProperty('rain')){
            rain = true
            break
        }
    }
    return rain
}

let temp = (list) => {
    let sum = 0 
    for (let i=0; i<list.length; i++){
        sum = sum + list[i].main.temp
    }
    let avg_temp = sum / list.length - 273.15
    //console.log(avg_temp)

    let temp
    if (avg_temp < 10){
        temp = "Cold"
    }
    else if (avg_temp >= 20){
        temp = "Hot"
    }
    else {
        temp = "Warm"
    }

    return temp
}

let table_info = (list) => {
    let temp = []
    let wind = []
    let rain = []

    for (let i=0; i<list.length; i++){
        temp[i] = list[i].main.temp

        if (list[i].hasOwnProperty('wind')){
            wind[i] = list[i].wind.speed
        }
        else {
            wind[i] = 0
        }

        if (list[i].hasOwnProperty('rain')){
            rain[i] = list[i].rain["3h"]
        }
        else {
            rain[i] = 0
        }
    }

    let table = {temp, wind, rain}
    return table
}

let weather = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return  fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            let list = []
            list = result.list
            let umbrella = rain(list)
            let clothes_type = temp(list)
            let table = table_info(list)
            return {umbrella, clothes_type, table}
            //console.log("umbrella " + umbrella + "\nclothes type " + clothes_type + "\ntable " + table)
        })
        .catch(error => console.log('error', error));   
}

let coordinates = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            return result.coord
        })
        .catch(error => console.log('error', error));   
}

let pollution = (coord, key) => {
    let url = 'http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=' + coord.lat + '&lon=' + coord.lon + '&appid=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return  fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            let list = result.list
            
            for (let i=0; i<list.length; i++){
                if (list[i].components.pm2_5 > 10){
                    return true
                }
            }

            return false
        })
        .catch(error => console.log('error', error));   
}

let mask = (location, key) => {
    let prom = new Promise((resolve, reject) => {
        resolve(coordinates(location, key))
    });
    prom.then(coord => pollution(coord, key))
    .then(mask => {
        return mask
    });
}

let data_retrieval = (location) => {
    let key = "3e2d927d4f28b456c6bc662f34350957"

    let p1 = new Promise((resolve, reject) => {
        resolve(weather(location, key))
    });
    
    let p2 = new Promise((resolve, reject) => {
        resolve(mask(location, key))
    });
    p2.then(mask => {
        console.log(mask)
    })
  /*  
    Promise.all([p1, p2]).then(values => {
        console.log(values)
    })
    */
}

let server = () => {
    const port = 3000
    var app = express();
    
    app.get('/', function (req, res) {
       res.send('Hello');
    })
    
    var server = app.listen(port, function () {
       var host = server.address().address
       var port = server.address().port
       
       console.log("Example app listening at http://%s:%s", host, port)
    })

    data_retrieval("Dublin,Ireland")
}

server()





