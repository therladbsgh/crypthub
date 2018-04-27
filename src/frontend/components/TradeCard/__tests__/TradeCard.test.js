import React from 'react';
import TradeCard from '../TradeCard';
import { GameMocks } from 'mocks';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  	const tree = renderer.create(<TradeCard game={GameMocks.game1} />).toJSON();
  	expect(tree).toMatchSnapshot();
});