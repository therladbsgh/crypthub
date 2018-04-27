import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import FindGames from '../FindGames';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<Router><FindGames /></Router>).toJSON();
  	expect(tree).toMatchSnapshot();
});