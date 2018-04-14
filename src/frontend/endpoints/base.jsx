// Should be changed as appropriate
const BASE_URI = 'http://localhost:5000/';

function handleError(reject, err) {
    console.log('FETCH ERROR: ', err);
    if (_.isString(err)) {
        reject(err);
    } else {
        reject('An unknown error has occurred. Please try again later.');
    }
}

export function get(url) {
    return new Promise((resolve, reject) => {
        fetch(`${BASE_URI}${url}`)
        .then(res => {
            if (res.ok) return res.json();
            handleError(reject, res.status);
        })
        .then(res => resolve(res))
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
            return res.json();
        })
        .then(res => {
            console.log(res);
            if (res.ok) return res.json();
            handleError(reject, res.status);
        })
        .then(res => resolve(res))
        .catch(err => handleError(reject, err));
    });
}
