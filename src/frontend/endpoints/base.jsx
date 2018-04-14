// Should be changed as appropriate
const BASE_URI = 'http://localhost:5000/';

function handleError(reject, err) {
    console.log('FETCH ERROR: ', err);
    if (_.has(err, 'err') && _.has(err, 'field')) {
        reject(err);
    } else {
        reject({ err: 'An unknown error has occurred. Please try again later.' });
    }
}

export function get(url) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URI}${url}`)
        .then(res => {
            if (res.ok) return resolve(res.json());
            res.json().then(json => handleError(reject, json));
        })
        .catch(err => handleError(reject, err));
    });
}

export function post(url, data) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URI}${url}`, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
        })
        .then(res => {
            if (res.ok) return resolve(res.json());
            res.json().then(json => handleError(reject, json));
        })
        .catch(err => handleError(reject, err));
    });
}
