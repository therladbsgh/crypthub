import * as Backend from './base';

export function getUser() {
    return Backend.get('passport/user');
}

export function getAllUsers() {
    return Backend.get('passport/getAllUsers');
}

export function getUsername() {
    return Backend.get('passport/username');
}

export function getEmail() {
    return Backend.get('passport/email');
}

export function signup(signupObj) {
    return Backend.post('passport/signup', signupObj);
}

export function login(loginObj) {
    return Backend.post('passport/login', loginObj);
}

export function forgot(forgotObj) {
    return Backend.post('passport/forgot', forgotObj);
}

export function logout() {
    return Backend.get('passport/logout');
}

export function deleteUser() {
    return Backend.get('passport/delete');
}

export function savePassword(changePasswordObj) {
    return Backend.post('passport/savePassword', changePasswordObj);
}

export function saveEmail(changeEmailObj) {
    return Backend.post('passport/saveEmail', changeEmailObj);
}

export function verifyEmail(token) {
    return Backend.get(`passport/verifyEmail?token=${token}`);
}

export function sendVerification(email) {
    return Backend.get(`passport/sendVerification?email=${email}`);
}

export function uploadTradingBot(fileObj) {
    const fileSendObj = new FormData();
    fileSendObj.append('code', fileObj.file);
    return Backend.postFormData('bot/upload', fileSendObj);
}

export function saveTradingBot(tradingBotObj) {
    return Backend.post('bot/save', tradingBotObj);
}

export function deleteBot(delBotObj) {
    return Backend.post('bot/delete', delBotObj);
}

export function newTradingBot() {
    return Backend.get('bot/new');
}
