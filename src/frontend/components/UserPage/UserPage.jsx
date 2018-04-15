import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Tab } from 'semantic-ui-react';
import { Navbar } from 'components';
import { YourGames, FindGames, CreateGame } from 'components';

class UserPage extends Component {
    componentWillMount() {
		const { history, cookies } = this.props;
		if (_.isEmpty(cookies.getAll())) {
			history.push('/login');
		}
    }
    
  	render() {
        const YourGamesPane = (
            <Tab.Pane key='tab1'>
                <YourGames />
            </Tab.Pane>
        );
        const FindGamesPane = (
            <Tab.Pane key='tab2'>
                <FindGames />
            </Tab.Pane>
        );
        const CreateGamePane = (
            <Tab.Pane key='tab3'>
                <CreateGame />
            </Tab.Pane>
        );

        const panes = [
            { menuItem: 'Your Games', pane: YourGamesPane },
            { menuItem: 'Find Games', pane: FindGamesPane },
            { menuItem: 'Create Game', pane: CreateGamePane }
        ];

        const propsState = this.props.location.state;

		return (
			<div>
				<Navbar/>
				<Header as='h1'>Username</Header>
				<Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={propsState ? propsState.openTab : 0} />
			</div>
		);
  	}
}

export default withCookies(withRouter(UserPage));
