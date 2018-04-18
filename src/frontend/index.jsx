import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Signup, Login, UserPage, GamePage, GlobalRankings, VerifyEmail, PageNotFound } from 'components';

// Necessary for date picker to work
import 'react-dates/initialize';
// This ensures datapicker css isn't hashed like local css
import '../../node_modules/react-dates/lib/css/_datepicker.css?raw';


ReactDOM.render(
	<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/signup' component={Signup} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/games' component={UserPage} />
				<Route exact path='/rankings' component={GlobalRankings} />
				<Route path='/game/:id' component={GamePage} />
				<Route path='/verifyEmail' component={VerifyEmail} />
				<Route component={PageNotFound} />
			</Switch>
	</Router>,
	document.querySelector('#app')
);
