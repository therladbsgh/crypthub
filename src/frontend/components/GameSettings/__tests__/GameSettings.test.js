import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GameSettings from '../GameSettings';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<Router><GameSettings game={GameMocks.game1} /></Router>).toJSON();
  	expect(tree).toMatchSnapshot();
});