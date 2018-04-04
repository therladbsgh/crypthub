import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { CreateGameStyle as styles } from 'styles';

export default class CreateGame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			id: '',
			err: '',
			continue: false,
            submitted: false
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleContinue = this.handleContinue.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleChange(event) {		
		const target = event.target;
		this.setState({
			[target.name]: target.value
		});
	}
	
	handleContinue() {
		this.setState({
			err: ''
		})

		// TODO: Logic
		console.log('continue', this.state);

		this.setState({
			continue: true,
		});
	}

	handleCreate(event) {
		event.preventDefault();
		this.setState({
			err: ''
		})

		// TODO: Logic
		console.log('create', this.state);
	}

	goBack() {
		this.setState({
			err: '',
			continue: false,
		});

		console.log('back', this.state);
	}

    render() {
		// Using onClick instead of submit because of weird immediate submitting problem
        return (
			<div>
				{!this.state.continue ? 
				<div>
					<Header as='h2'>Create a Game</Header>
					<Form error={!!this.state.err}>
						<Form.Field>
							<label>Game Name</label>
							<input placeholder='Game name' name='name' value={this.state.name} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field>
							<label id={styles.urlLabel}>URL: crypthub.com/game/</label>{this.state.id}
							<input placeholder='unique-game-identifier' name='id' value={this.state.id} onChange={this.handleChange} />
						</Form.Field>
						<Message
							error
							header='Error'
							content={this.state.err}
						/>
						<Button onClick={this.handleContinue} positive>Continue</Button>
					</Form>
				</div>
				:
				<div id={styles.review}>
					<Header as='h2'>Review</Header>
					<Form error={!!this.state.err}>
						<Form.Field>
							<label>Game Name: </label>{this.state.name}
						</Form.Field>
						<Form.Field>
							<label>URL: crypthub.com/game/</label>{this.state.id}
						</Form.Field>
						<Message
							error
							header='Error'
							content={this.state.err}
						/>
						<Button onClick={this.goBack} negative>Back</Button>
						<Button onClick={this.handleCreate} positive>Create</Button>
					</Form>
				</div>}
			</div>
        );
    }
}
