import * as Backend from './base';

export function signup(signupObj) {
    return Backend.post('signup', signupObj);
}
