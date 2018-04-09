// Should be changed as appropriate
const BASE_URI = 'http://localhost:5000/';

function handleError(reject, err) {
    console.log('FETCH ERROR: ', err);
    reject(err);
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
