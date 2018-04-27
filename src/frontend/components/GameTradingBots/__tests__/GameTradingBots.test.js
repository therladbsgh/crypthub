import React from 'react';
import GameTradingBots from '../GameTradingBots';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<GameTradingBots player={GameMocks.game1.players[0]} />).toJSON();
  	expect(tree).toMatchSnapshot();
});