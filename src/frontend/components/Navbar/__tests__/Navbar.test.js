import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<Router><Navbar /></Router>).toJSON();
  	expect(tree).toMatchSnapshot();
});