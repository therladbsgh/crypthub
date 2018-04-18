import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown } from 'semantic-ui-react';
import { Portfolio } from 'components';

export default class GameCompare extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playerIds: _.map(this.props.players, '_id'),
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event, { value }) {
		this.setState({ playerIds: value });
	}
	
	render() {
        const { players, completed } = this.props;
        const { playerIds } = this.state;

		return (
			<div>
                <Header as='h2'>Compare Player Portfolios</Header>
				<Dropdown placeholder='Players to compare' multiple search selection options={_.map(players, p => ({ text: p.name, value: p.id }))} value={playerIds} onChange={this.handleChange} />
                {_.map(playerIds, _id => {
                    const player = _.find(players, { _id });
                    return (
                        <Portfolio key={_id} portfolio={player.portfolio} header={player.name} completed={completed} />
                    );
                })}
			</div>
		);
	}
}
