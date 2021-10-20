import fetch from 'node-fetch';
import { resolve } from 'path/posix';

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
        })
        .catch(error => console.log('error', error));   
}

let coordinates = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return  fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            return result.coord
        })
        .catch(error => console.log('error', error));   
}

/*
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
*/

//async function main(){
    let location = "Dublin,Ireland"
    let key = "3e2d927d4f28b456c6bc662f34350957"

    let p1 = new Promise((resolve, reject) => {
        resolve(weather(location, key))
    });
   
    let p2 = new Promise((resolve, reject) => {
        resolve(coordinates(location,key))
    });

   // let coords = await p2;
  //  console.log(coords)

//}




//main()