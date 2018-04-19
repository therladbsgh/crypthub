import * as Backend from './base';

export function getUser() {
    return Backend.get('passport/user');
}

export function signup(signupObj) {
    return Backend.post('passport/signup', signupObj);
}

export function login(loginObj) {
    return Backend.post('passport/login', loginObj);
}

export function forgot(forgotObj) {
    return Backend.post('forgot', forgotObj);
}

export function logout() {
    return Backend.get('passport/logout');
}

export function verifyEmail(token) {
    return Backend.get(`passport/verifyEmail?token=${token}`);
}

export function sendVerification(email) {
    return Backend.get(`passport/sendVerification?email=${email}`);    
}

export function uploadTradingBot(fileObj) {
    const fileSendObj = new FormData();
    fileSendObj.append('file', fileObj.file);
    return Backend.post('uploadTradingBot', fileSendObj);
}

export function saveTradingBot(tradingBotObj) {
    return Backend.post('saveTradingBot', tradingBotObj);
}
