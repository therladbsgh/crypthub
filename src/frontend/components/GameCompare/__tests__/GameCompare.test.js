import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GameCompare from '../GameCompare';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<GameCompare players={GameMocks.game1.players} />).toJSON();
  	expect(tree).toMatchSnapshot();
});