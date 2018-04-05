import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';

export default class GameCard extends Component {
    render() {
        const { game } = this.props;
        return (
			<Card>
				<Card.Content>
				    <Card.Header>
						<Link to={`/game/${game.id}`}>{game.name}</Link>
					</Card.Header>
					<Card.Meta>
						{game.description}
					</Card.Meta>
					<Card.Description>
						Created by {game.host} {game.created} to start on {game.startOn} and end in {game.endIn}
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					{game.numPlayers} players
				</Card.Content>
		  	</Card>
		);
  	}
}
