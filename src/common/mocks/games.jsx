import date from 'date-and-time';
import * as PlayerMocks from './players';

export const game1 = {
    id: '1',
    name: 'game1',
    description: 'desc1',
    host: 'user1',
    created: date.parse('Apr 1 2018', 'MMM D YYYY'),
    start: date.parse('Apr 2 2018', 'MMM D YYYY'),
    end: date.parse('May 7 2018', 'MMM D YYYY'),
    playerPortfolioPublic: true,
    startingBalance: 10000,
    commissionValue: 10,
    shortSelling: true,
    limitOrders: true,
    stopOrders: true,
    lastUpdated: new Date(),
    completed: false,
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ],
    isPrivate: false,
    password: ''
};

export const game2 = {
    id: '2',
    name: 'game2',
    description: 'desc2',
    host: 'user2',
    created: date.parse('Apr 2 2018', 'MMM D YYYY'),
    start: date.parse('Apr 3 2018', 'MMM D YYYY'),
    end: date.parse('May 1 2018', 'MMM D YYYY'),
    playerPortfolioPublic: true,
    startingBalance: 10000,
    commissionValue: 10,
    shortSelling: true,
    limitOrders: true,
    stopOrders: true,
    lastUpdated: new Date(),
    completed: false,
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ],
    isPrivate: false,
    password: ''
};

export const game3 = {
    id: '3',
    name: 'game3',
    description: 'desc3',
    host: 'user3',
    created: date.parse('Apr 4 2018', 'MMM D YYYY'),
    start: date.parse('Apr 8 2018', 'MMM D YYYY'),
    end: date.parse('Apr 28 2018', 'MMM D YYYY'),
    playerPortfolioPublic: true,
    startingBalance: 10000,
    commissionValue: 10,
    shortSelling: true,
    limitOrders: true,
    stopOrders: true,
    lastUpdated: new Date(),
    completed: false,
    players: [
        PlayerMocks.player1,
        PlayerMocks.player2
    ],
    isPrivate: false,
    password: ''
};
