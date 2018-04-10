import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { CreateGameStyle as styles } from 'styles';

class CreateGame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameObj: {
				id: '',
				name: '',
				description: '',
				host: 'MyUsername',
				created: new Date(),
				start: new Date(),
				end: new Date(),
				numPlayers: 1,
				playerPortfolioPublic: true,
				startingBalance: 0,
				commissionValue: 0,
				shortSelling: true,
				limitOrders: true,
				stopOrders: true,
				lastUpdated: new Date(),
				completed: false,
				players: [],
				private: false,
				password: ''
			},
			err: '',
			loading: false,
			review: false,
            submitted: false
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleReview = this.handleReview.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleChange(event) {		
		const target = event.target;
		this.setState({
			[target.name]: target.value
		});
	}
	
	handleReview() {
		this.setState({
			err: '',
			loading: true
		})

		GameBackend.validateGame(this.state.gameObj)
		.then(res => {
			console.log('success! ', res);
			this.setState({
				loading: false,
				review: true,
			});
		}, err => {
			console.log('error! ', err);
			this.setState({
				loading: false, 
				err
			});
		});
	}

	handleCreate(event) {
		event.preventDefault();
		this.setState({
			err: '',
			loading: true
		})

		GameBackend.createGame(this.state.gameObj)
		.then(res => {
			console.log('success! ', res);
			this.setState({ loading: false });
			this.props.history.push(`/game/${this.state.id}`);
		}, err => {
			console.log('error! ', err);
			this.setState({
				loading: false, 
				err
			});
		});
	}

	goBack() {
		this.setState({
			err: '',
			review: false,
		});
	}

    render() {
		const { gameObj, err, loading, review, submitted } = this.state;
		const { id, name } = gameObj;

		// Using onClick instead of submit because of weird immediate submitting problem
        return (
			<div>
				{!review ? 
				<div>
					<Header as='h2'>Create a Game</Header>
					<Form loading={loading} error={!!err}>
						<Form.Field>
							<label>Game Name</label>
							<input placeholder='Game name' name='name' value={name} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field>
							<label id={styles.urlLabel}>URL: crypthub.com/game/</label>{id}
							<input placeholder='unique-game-identifier' name='id' value={id} onChange={this.handleChange} />
						</Form.Field>
						<Message
							error
							header='Error'
							content={err}
						/>
						<Button onClick={this.handleReview} positive>Continue</Button>
					</Form>
				</div>
				:
				<div loading={loading} id={styles.review}>
					<Header as='h2'>Review</Header>
					<Form error={!!err}>
						<Form.Field>
							<label>Game Name: </label>{name}
						</Form.Field>
						<Form.Field>
							<label>URL: crypthub.com/game/</label>{id}
						</Form.Field>
						<Message
							error
							header='Error'
							content={err}
						/>
						<Button onClick={this.goBack} negative>Back</Button>
						<Button onClick={this.handleCreate} positive>Create</Button>
					</Form>
				</div>}
			</div>
        );
    }
}

export default withRouter(CreateGame);