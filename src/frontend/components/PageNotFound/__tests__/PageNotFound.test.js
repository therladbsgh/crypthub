import React from 'react';
import PageNotFound from '../PageNotFound';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<PageNotFound />).toJSON();
  	expect(tree).toMatchSnapshot();
});