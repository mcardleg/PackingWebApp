import fetch from 'node-fetch';

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
    let table = []

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

    table[0] = temp
    table[1] = wind
    table[2] = rain
    return table
}

let weather = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + key
    let umbrella
    let clothes_type
    let table
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            let list = []
            list = result.list
            umbrella = rain(list)
            clothes_type = temp(list)
            table = table_info(list)
            console.log("umbrella " + umbrella + "\nclothes type " + clothes_type + "\ntable " + table)
        })
        .catch(error => console.log('error', error));    
}

let pollution = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            let coordinates = result.coord
        })
        .catch(error => console.log('error', error));
}

let location = "Dublin,Ireland"
let key = "3e2d927d4f28b456c6bc662f34350957"
//weather(location, key)
//pollution(location, key)

let coord = coordinates(location, key)
console.log(coord)


