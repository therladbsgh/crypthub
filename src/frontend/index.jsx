import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Signup, PageNotFound } from 'components';

ReactDOM.render(
	<Router>
		<div>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/signup' component={Signup} />
				<Route component={PageNotFound} />
			</Switch>
		</div>
	</Router>,
	document.querySelector('#app')
);
