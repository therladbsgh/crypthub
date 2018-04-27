import React from 'react';
import GamePortfolio from '../GamePortfolio';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<GamePortfolio player={GameMocks.game1.players[0]} />).toJSON();
  	expect(tree).toMatchSnapshot();
});