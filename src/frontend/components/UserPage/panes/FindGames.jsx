import React from 'react';
import { Tab } from 'semantic-ui-react';

const FindGames = (props) => (
	<Tab.Pane key='tab2'>
		<p>find games{props.foo}</p>
	</Tab.Pane>
)
  
export default FindGames
