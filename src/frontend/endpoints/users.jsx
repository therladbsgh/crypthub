import * as Backend from './base';

export function signup(signupObj) {
    return Backend.post('passport/signup', signupObj);
}

export function login(loginObj) {
    return Backend.post('passport/login', loginObj);
}

export function forgot(forgotObj) {
    return Backend.post('forgot', forgotObj);
}
