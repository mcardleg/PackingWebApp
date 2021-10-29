import fetch from 'node-fetch';

const get_list = () => {
    let url = 'http://localhost:8080/?location=Dublin,Ireland'

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return (fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
        .catch(error => console.log('error', error)) 
    )
}

get_list()