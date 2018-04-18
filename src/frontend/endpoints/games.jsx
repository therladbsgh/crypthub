import * as Backend from './base';

export function validateGame(gameObj) {
    return Backend.post('game/validate', gameObj);
}

export function createGame(gameObj) {
    return Backend.post('game/create', gameObj);
}

export function placeOrder(tradeObj) {
    return Backend.post('game/placeorder', tradeObj);
}

export function cancelOrder(tradeId) {
    return Backend.get(`game/cancelOrder?id=${tradeId}`);
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
