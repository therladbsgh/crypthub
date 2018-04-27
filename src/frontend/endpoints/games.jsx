import * as Backend from './base';

export function validateGame(gameObj) {
    return Backend.post('game/validate', gameObj);
}

export function createGame(gameObj) {
    return Backend.post('game/create', gameObj);
}

export function getGame(gameId) {
    return Backend.get(`game/get/${gameId}`);
}

export function getAllGames() {
    return Backend.get('game/getall');
}

export function getCoins() {
    return Backend.get('coin/getall');
}

export function placeOrder(tradeObj) {
    return Backend.post('game/placeorder', tradeObj);
}

export function cancelOrder(tradeObj) {
    return Backend.post('game/cancelorder', tradeObj);
}

export function saveGame(gameObj) {
    return Backend.post('game/saveGame', gameObj);
}

export function joinGame(joinObj) {
    return Backend.post('game/joinGame', joinObj);
}

export function leaveGame(leaveObj) {
    return Backend.post('game/leaveGame', leaveObj);
}

export function inviteUsers(inviteObj) {
    return Backend.post('game/inviteUsers', inviteObj);
}

export function setTradingBot(setBotObj) {
    return Backend.post('game/setTradingBot', setBotObj);
}
