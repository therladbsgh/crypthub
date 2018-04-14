import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Button, Message, TextArea } from 'semantic-ui-react';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';
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
				start: moment(),
				end: moment(moment()).add(1, 'M'),
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
			errMsg: '',
			errField: '',
			loading: false,
			review: false,
			submitted: false,
			focusedDate: null
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleReview = this.handleReview.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleChange(event) {
		const { gameObj } = this.state;
		const target = event.target;
		const value = target.value;

		if (_.has(gameObj, target.name)) {
			this.setState({
				gameObj: {
					...gameObj,
					[target.name]: value
				}
			});
		} else {
			this.setState({
				[target.name]: value
			});
		}
	}

	handleDateChange({ startDate, endDate }) {
		this.setState({
			gameObj: {
				...this.state.gameObj,
				start: startDate,
				end: endDate
			}
		});
	}
	
	handleReview() {
		this.setState({
			errMsg: '',
			errField: '',
			loading: true
		})

		// GameBackend.validateGame(this.state.gameObj)
		// .then(res => {
		// 	console.log('success! ', res);
		// 	this.setState({
		// 		loading: false,
		// 		review: true,
		// 	});
		// }, ({ err, field }) => {
		// 	console.log('error! ', err);
		// 	this.setState({
		// 		loading: false, 
		// 		errMsg: err,
		//		errField: field
		// 	});
		// });
		this.setState({
			loading: false,
			review: true,
		});
	}

	handleCreate(event) {
		event.preventDefault();
		this.setState({
			errMsg: '',
			errField: '',
			loading: true
		})

		const { gameObj } = this.state;

		GameBackend.createGame(gameObj)
		.then(res => {
			console.log('success! ', res);
			this.setState({ loading: false });
			this.props.history.push(`/game/${gameObj.id}`);
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({
				loading: false, 
				errMsg: err,
				errField: field
			});
		});
	}

	goBack() {
		this.setState({
			errMsg: '',
			errField: '',
			review: false,
		});
	}

    render() {
		const { gameObj, errMsg, errField, loading, review, submitted, focusedDate } = this.state;
		const { id, name, description, start, end } = gameObj;

		// Using onClick instead of submit because of weird immediate submitting problem
        return (
			<div>
				{!review ? 
				<div>
					<Header as='h2'>Create a Game</Header>
					<Form loading={loading} error={!!errMsg}>
						<Form.Field>
							<label>Game Name</label>
							<input placeholder='Game name' name='name' value={name} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field>
							<label id={styles.urlLabel}>URL: crypthub.com/game/</label>{id}
							<input placeholder='unique-game-identifier' name='id' value={id} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field>
							<label>Description</label>
							<TextArea className={styles.description} autoHeight placeholder='Description' name='description' value={description} onChange={this.handleChange} />							
						</Form.Field>
						<Form.Field>
							<label>Start and End Dates</label>
							<DateRangePicker
								startDate={start}
								startDateId='start'
								endDate={end}
								endDateId='end'
								onDatesChange={this.handleDateChange}
								focusedInput={focusedDate}
								onFocusChange={focusedInput => this.setState({ focusedDate: focusedInput })}
								hideKeyboardShortcutsPanel
								noBorder
							/>
						</Form.Field>
						<Message
							error
							header='Error'
							content={errMsg}
						/>
						<Button onClick={this.handleReview} positive>Continue</Button>
					</Form>
				</div>
				:
				<div id={styles.review}>
					<Header as='h2'>Review</Header>
					<Form loading={loading} error={!!errMsg}>
						<Form.Field>
							<label>Game Name: </label>{name}
						</Form.Field>
						<Form.Field>
							<label>URL: crypthub.com/game/</label>{id}
						</Form.Field>
						<Form.Field>
							<label>Description: </label>{description}
						</Form.Field>
						<Form.Field>
							<label>Start: </label>{start.format('MM/DD/YYYY')}
						</Form.Field>
						<Form.Field>
							<label>End: </label>{end.format('MM/DD/YYYY')}
						</Form.Field>
						<Message
							error
							header='Error'
							content={errMsg}
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