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
