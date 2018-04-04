import React from 'react';
import { Tab } from 'semantic-ui-react';

const YourGames = (props) => (
	<Tab.Pane key='tab1'>
		<p>your games{props.foo}</p>
	</Tab.Pane>
)
  
export default YourGames
