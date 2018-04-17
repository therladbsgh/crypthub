import * as Backend from './base';

export function validateGame(gameObj) {
    return Backend.post('game/validate', gameObj);
}

export function createGame(gameObj) {
    return Backend.post('game/create', gameObj);
}

export function placeOrder(tradeObj) {
    return Backend.post('game/placeOrder', tradeObj);
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