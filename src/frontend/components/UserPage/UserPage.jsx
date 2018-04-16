import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Tab } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { YourGames, FindGames, CreateGame } from 'components';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasMounted: false
        };
    }

    componentWillMount() {
		const { history } = this.props;
		UserBackend.getUser()
		.then(res => {
			console.log('success! ', res);
            if (_.isEmpty(res)) {
                history.push('/login');
			} else {
                //TODO: also put the user on the state
				this.setState({ hasMounted: true });
			}
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
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
            this.state.hasMounted &&
			<div>
				<Navbar/>
				<Header as='h1'>Username</Header>
				<Tab panes={panes} renderActiveOnly={false} defaultActiveIndex={propsState ? propsState.openTab : 0} />
			</div>
		);
  	}
}

export default withRouter(UserPage);
