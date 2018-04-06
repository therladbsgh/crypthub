import * as PlayerMocks from './players';

export const game1 = {
    id: '1',
    name: 'game1',
    description: 'desc1',
    host: 'user1',
    created: '1 sec ago',
    start: '04/03/18',
    end: '20 hours',
    numPlayers: '2',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};

export const game2 = {
    id: '2',
    name: 'game2',
    description: 'desc2',
    host: 'user2',
    created: '10 sec ago',
    start: '04/02/18',
    end: '40 hours',
    numPlayers: '10',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};

export const game3 = {
    id: '3',
    name: 'game3',
    description: 'desc3',
    host: 'user3',
    created: '25 sec ago',
    start: '04/01/18',
    end: '400 hours',
    numPlayers: '80',
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ]
};
