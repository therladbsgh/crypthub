import React from 'react';
import GameRankings from '../GameRankings';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<GameRankings player={GameMocks.game1.players} />).toJSON();
  	expect(tree).toMatchSnapshot();
});