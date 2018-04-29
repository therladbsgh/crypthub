import React, { Component } from 'react';
import date from 'date-and-time';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { GameCardStyle as styles, SharedStyle as sharedStyles } from 'styles';

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
		const { id, name, description, created, host, start, end, players, isPrivate, completed } = game;
		const now = new Date();
		const endDate = new Date(end);

        return (
			<Card id={sharedStyles.card}>
				<Card.Content>
					<Card.Header>
						<Link to={`/game/${id}`}>{name}</Link>

						<span className={`${completed ? styles.completed : isPrivate && styles.private} ${styles.tag}`}>{completed ? 'Completed' : isPrivate ? 'Private' : ''}</span>
					</Card.Header>
					<Card.Meta>
						{description}
					</Card.Meta>
					<Card.Description>
						Created <strong>{date.subtractStr(now, new Date(created))} ago</strong> by <strong>{host}</strong> to start on <strong>{date.format(new Date(start), 'MM/DD/YYYY')}</strong> and end {endDate > now ? 'in' : 'on'} <strong>{endDate > now ? date.subtractStr(endDate, now) : date.format(endDate, 'MM/DD/YYYY')}</strong>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					{players.length} player{players.length > 1 && 's'}
				</Card.Content>
			</Card>
		);
  	}
}
