import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

export default class LeaderboardCard extends Component {
    render() {
        const { players } = this.props;
        
        return (
			<Card>
				<Card.Content>
				    player1<br />player2
				</Card.Content>
		  	</Card>
		);
  	}
}
