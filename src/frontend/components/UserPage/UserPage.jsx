import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar } from 'components';
import { YourGames, FindGames } from './panes';

export default class UserPage extends Component {
    constructor(props) {
		super(props);
		this.state = {
			sortValue: 'Recently Created'
		};
	
		this.handleChange = this.handleChange.bind(this);
    }

    // TODO: Logic
    handleChange(event, { value }) {
        this.setState({ sortValue: value });
    }
    
  	render() {
        const yourGamesProps = { foo: 'foo' };
        const findGamesProps = { handleChange: this.handleChange };
        const panes = [
            { menuItem: 'Your Games', pane: YourGames(yourGamesProps) },
            { menuItem: 'Find Games', pane: FindGames(findGamesProps) }
        ];
		return (
			<div>
				<Navbar loggedIn={true} />
				<Header as='h1'>Username</Header>
				<Tab panes={panes} renderActiveOnly={false} />
			</div>
		);
  	}
}
