import React from 'react';
import CancelModal from '../CancelModal';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<CancelModal />).toJSON();
  	expect(tree).toMatchSnapshot();
});