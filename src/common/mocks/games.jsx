import * as PlayerMocks from './players';

export const game1 = {
    name: 'game1',
    description: 'desc1',
    host: 'user1',
    created: '1 sec ago',
    startOn: '04/03/18',
    endIn: '20 hours',
    numPlayers: '2',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};

export const game2 = {
    name: 'game2',
    description: 'desc2',
    host: 'user2',
    created: '10 sec ago',
    startOn: '04/02/18',
    endIn: '40 hours',
    numPlayers: '10',
    id: '2',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};

export const game3 = {
    name: 'game3',
    description: 'desc3',
    host: 'user3',
    created: '25 sec ago',
    startOn: '04/01/18',
    endIn: '400 hours',
    numPlayers: '80',
    id: '3',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};
