import fetch from 'node-fetch';
import express from 'express';

const rain_func = (list) => {
    let prom = new Promise(resolve => {
        let rain_bool = false
        let rain_array = []

        for (let i=0; i<list.length; i++){
            if (list[i].hasOwnProperty('rain')){
                rain_bool = true
                rain_array[i] = list[i].rain["3h"]
            }
            else {
                rain_array[i] = 0
            }
        }
        resolve({rain_bool, rain_array})
    })
    return (prom)
}

const temp_func = (list) => {
    return new Promise(resolve => {
        var sum = 0 
        let temp = []
        var clothes

        for (let i=0; i<list.length; i++){
            sum = sum + list[i].main.temp
            temp[i] = list[i].main.temp
        }
        let avg_temp = sum / list.length - 273.15
    
        if (avg_temp < 10){
            clothes = "Cold"
        }
        else if (avg_temp >= 20){
            clothes = "Hot"
        }
        else {
            clothes = "Warm"
        }
        resolve({clothes, temp})
    })
}

const wind_func = (list) => {
    return new Promise(resolve => {
        let wind = []

        for(let i=0; i<list.length; i++){
            if (list[i].hasOwnProperty('wind')){
                wind[i] = list[i].wind.speed
            }
            else {
                wind[i] = 0
            }
        }
        resolve(wind)
    })
}

const get_list = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return (fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            let list = []
            list = result.list
            return(list)
        })
        .catch(error => console.log('error', error))   
    )
}

const coordinates_func = (location, key) => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    return (fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            return result.coord
        })
        .catch(error => console.log('error', error))  
    )
}

const mask_func = async(location, key) => {
    let coord = await coordinates_func(location, key)
    const url = 'http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=' + coord.lat + '&lon=' + coord.lon + '&appid=' + key

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return (fetch(url, requestOptions)
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
    .catch(error => console.log('error', error))
    )
}

const data_func = async(location, key) => {
    let list, rain_return, temp_return, wind, umbrella, rain, clothes, temp, mask
    list = await get_list(location, key)
    rain_return = await rain_func(list)
    temp_return = await temp_func(list)
    wind = await wind_func(list)   
    mask = await mask_func(location, key)

    umbrella = rain_return.rain_bool
    rain = rain_return.rain_array
    clothes = temp_return.clothes
    temp = temp_return.temp
    return({umbrella, clothes, rain, temp, wind, mask})
}

const create_object = async(location) => {
    const key = "3e2d927d4f28b456c6bc662f34350957"
    let data, mask
    data = await data_func(location, key)
    console.log(data)
}

create_object("Moscow,Russia")