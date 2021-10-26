import fetch from 'node-fetch';
import express from 'express';

const rain = (list) => {
    return new Promise(resolve => {
        let rain_bool = false
        let rain = []

        for (let i=0; i<list.length; i++){
            if (list[i].hasOwnProperty('rain')){
                rain_bool = true
                rain[i] = list[i].rain["3h"]
            }
            else {
                rain[i] = 0
            }
        }
        resolve({rain_bool, rain})
    })
}

const temp = (list) => {
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

const wind = (list) => {
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

const weather = async(location, key) => {
    let list = await get_list(location, key)
    console.log(list)
}

/*
            let list = []
            list = result.list
            let rain_return = await rain(list)
            let umbrella = rain_return.rain_bool
            let rain = rain_return.rain
            let temp_return = await temp(list)
            let clothes = temp_return.clothes
            let temp = temp_return.temp
            let wind = await wind(list)
            console.log({umbrella, clothes, rain, temp, wind})
            resolve({umbrella, clothes, rain, temp, wind})
*/

weather("Dublin, Ireland", "3e2d927d4f28b456c6bc662f34350957")