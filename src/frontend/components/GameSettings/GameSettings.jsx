import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { GameCard } from 'components';

export default class GameSettings extends Component {
    constructor(props) {
        super(props);

        this.handleLeave = this.handleLeave.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
    }

    handleLeave() {
        //TODO: logic
    }

    handleInvite() {
        //TODO: logic
    }

    render() {
        return (
			<div>
                <Button onClick={this.handleInvite} positive>Invite Players</Button>
                <Button onClick={this.handleLeave} negative>Leave Game</Button>
				<Header as='h2'>About This Game</Header>
                <GameCard game={this.props.game} />
                <Header as='h2'>Game Options</Header>
                game options (the settings, changing private/public etc if host)
			</div>
        );
    }
}
