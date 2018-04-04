import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar } from 'components';
import { YourGames, FindGames } from './panes';

export default class UserPage extends Component {
    constructor(props) {
		super(props);
		this.state = {
            sortValue: 'Recently Created',
            onlyPublic: false
		};
	
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    // TODO: Logic
    handleSortChange(event, { value }) {
        this.setState({ sortValue: value });
        
    }

    // TODO: Logic
    handleCheckboxChange(event, { checked }) {
        this.setState({ onlyPublic: checked });
    }
    
  	render() {
        const yourGamesProps = { foo: 'foo' };
        const findGamesProps = { 
            handleSortChange: this.handleSortChange,
            handleCheckboxChange: this.handleCheckboxChange
        };
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
