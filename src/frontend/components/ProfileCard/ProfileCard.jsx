import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

export default class ProfileCard extends Component {
    render() {
        const { player } = this.props;
        
        return (
			<Card>
				<Card.Content>
				    player's profile
				</Card.Content>
		  	</Card>
		);
  	}
}
