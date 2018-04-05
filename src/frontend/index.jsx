import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Signup, Login, UserPage, GamePage, GlobalRankings, PageNotFound } from 'components';

ReactDOM.render(
	<Router>
		<div>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/signup' component={Signup} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/games' component={UserPage} />
				<Route exact path='/rankings' component={GlobalRankings} />
				<Route path='/game/:id' component={GamePage} />
				<Route component={PageNotFound} />
			</Switch>
		</div>
	</Router>,
	document.querySelector('#app')
);
