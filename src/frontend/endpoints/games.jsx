import * as Backend from './base';

export function validateGame(gameObj) {
    return Backend.post('validateGame', gameObj);
}

export function createGame(gameObj) {
    return Backend.post('createGame', gameObj);
}

export function placeOrder(tradeObj) {
    return Backend.post('placeOrder', tradeObj);
}
