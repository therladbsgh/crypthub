import * as GameMocks from './games';

export const user1 = {
    id: 'id1',
    name: 'user1',
    ELO: 3000,
    games: [
        GameMocks.game1,
        GameMocks.game2
    ]
};

export const user2 = {
    id: 'id2',
    name: 'user2',
    ELO: 2000,
    games: [
        GameMocks.game2,
        GameMocks.game3
    ]
};

export const user3 = {
    id: 'id3',
    name: 'user3',
    ELO: 2000,
    games: [
        GameMocks.game2,
        GameMocks.game3
    ]
};
