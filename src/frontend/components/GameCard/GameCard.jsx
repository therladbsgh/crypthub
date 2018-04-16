import React, { Component } from 'react';
import date from 'date-and-time';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { SharedStyle as styles } from 'styles';

date.subtractStr = (date1, date2) => {
	const subtract = date.subtract(date1, date2);
	let val = 0;
	let str = 'milliseconds';
	if (subtract.toDays() > 0) {
		val = subtract.toDays();
		str = 'days';
	} else if (subtract.toHours() > 0) {
		val = subtract.toHours();
		str = 'hours';
	} else if (subtract.toMinutes() > 0) {
		val = subtract.toMinutes();
		str = 'minutes';
	} else if (subtract.toSeconds() > 0) {
		val = subtract.toSeconds();
		str = 'seconds';
	} else {
		val = subtract.toMilliseconds();
	}
	
	str = `${val} ${str}`;
	return val === 1 ? _.slice(str, 0, -1) : str;
};

export default class GameCard extends Component {
    render() {
		const { game } = this.props;
		const now = new Date();

        return (
			<Card id={styles.card}>
				<Card.Content>
					<Card.Header>
						<Link to={`/game/${game.id}`}>{game.name}</Link>
					</Card.Header>
					<Card.Meta>
						{game.description}
					</Card.Meta>
					<Card.Description>
						Created <strong>{date.subtractStr(now, game.created)} ago</strong> by <strong>{game.host}</strong> to start on <strong>{date.format(game.start, 'MM/DD/YYYY')}</strong> and end in <strong>{date.subtractStr(game.end, now)}</strong>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					{game.numPlayers} players
				</Card.Content>
			</Card>
		);
  	}
}
