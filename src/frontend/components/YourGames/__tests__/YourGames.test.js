import React from 'react';
import YourGames from '../YourGames';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<YourGames />).toJSON();
  	expect(tree).toMatchSnapshot();
});