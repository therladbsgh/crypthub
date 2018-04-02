import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/views/Home';
import Contact from './components/views/Contact';
import PageNotFound from './components/views/PageNotFound';

ReactDOM.render(
	<Router>
		<div>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/contact' component={Contact} />
				<Route component={PageNotFound} />
			</Switch>
		</div>
	</Router>,
	document.querySelector('#app')
);
