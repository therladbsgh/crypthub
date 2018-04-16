import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import formatCurrency from 'format-currency';
import { Header, Form, Button, Message, TextArea, Input, Grid } from 'semantic-ui-react';
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
				startingBalance: '',
				commissionValue: '',
				shortSelling: true,
				limitOrders: true,
				stopOrders: true,
				lastUpdated: null,
				completed: false,
				players: [],
				isPrivate: false,
				password: '',
				passwordConfirm: ''
			},
			errMsg: '',
			errField: '',
			loading: false,
			review: false,
			focusedDate: null
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.setAccess = this.setAccess.bind(this);
		this.handleReview = this.handleReview.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleChange(event) {
		const { gameObj } = this.state;
		const target = event.target;
		const value = target.value;

		// Allows for patterned input (i.e. numbers)
        if (!target.validity.valid) return;

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

	setAccess(bool) {
		const { gameObj } = this.state;
		const { password, passwordConfirm } = gameObj;

		this.setState({
			gameObj: {
				...this.state.gameObj,
				isPrivate: bool,
				password: bool ? password : '',
				passwordConfirm: bool ? passwordConfirm : '',
			}
		});
	}
	
	handleReview() {
		const { gameObj } = this.state;
		const { id, name, created, start, end, startingBalance, commissionValue, isPrivate, password, passwordConfirm } = gameObj;

		this.setState({
			errMsg: '',
			errField: '',
			loading: true
		})

		if (name === '') {
            return this.setState({
                loading: false,
                errMsg: 'Name must have a value.',
                errField: 'name'
            });
        }

        if (id === '') {
            return this.setState({
                loading: false,
                errMsg: 'Unique game id must have a value.',
                errField: 'id'
            });
		}
		
		if (!start || !end) {
            return this.setState({
                loading: false,
                errMsg: 'Start and end dates must have values.',
                errField: 'date'
            });
		}
		
		if (startingBalance === '') {
            return this.setState({
                loading: false,
                errMsg: 'Starting balance must have a value.',
                errField: 'startingBalance'
            });
		}

		if (commissionValue === '') {
            return this.setState({
                loading: false,
                errMsg: 'Trade commission must have a value.',
                errField: 'commissionValue'
            });
		}

		if (isPrivate && password !== passwordConfirm) {
            return this.setState({
                loading: false,
                errMsg: 'Passwords don\'t match.',
                errField: 'password'
            });
		}

		const gameObjSend = _.omit(gameObj, ['passwordConfirm']);
        _.set(gameObjSend, 'startingBalance', Number(startingBalance));
        _.set(gameObjSend, 'commissionValue', Number(commissionValue));
		_.set(gameObjSend, 'created', new Date());
		_.set(gameObjSend, 'start', start.toDate());
		_.set(gameObjSend, 'end', end.toDate());

		GameBackend.validateGame(gameObjSend)
		.then(res => {
			console.log('success! ', res);
			this.setState({
				loading: false,
				review: true,
			});
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({
				loading: false, 
				errMsg: err,
				errField: field
			});
		});
	}

	handleCreate(event) {
		const { gameObj } = this.state;

		this.setState({
			errMsg: '',
			errField: '',
			loading: true
		})

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
		const { gameObj, errMsg, errField, loading, review, focusedDate } = this.state;
		const { id, name, description, start, end, playerPortfolioPublic, startingBalance, commissionValue, shortSelling, limitOrders, stopOrders, isPrivate, password, passwordConfirm } = gameObj;

		const numPattern2Dec = '^\\d*(?:\\.\\d{0,2})?$';

		// Using onClick instead of submit because of weird immediate submitting problem
        return (
			<div>
				{!review ? 
				<div>
					<Header as='h2'>Create a Game</Header>
					<Form loading={loading} error={!!errMsg}>
						<Form.Group widths='equal'>
							<Form.Field error={errField === 'name'}>
								<label>Game Name</label>
								<input placeholder='Game name' name='name' value={name} onChange={this.handleChange} />
							</Form.Field>
							<Form.Field error={errField === 'id'}>
								<label id={styles.urlLabel}>URL: crypthub.com/game/</label>{id}
								<input placeholder='unique-game-identifier' name='id' value={id} onChange={this.handleChange} />
							</Form.Field>
						</Form.Group>
						<Form.Field error={errField === 'date'}>
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
						<Form.Group widths='equal'>
							<Form.Field error={errField === 'startingBalance'}>
								<label>Starting Balance</label>
								<Input pattern={numPattern2Dec} icon='dollar' iconPosition='left' placeholder='Starting balance' name='startingBalance' value={startingBalance} onChange={this.handleChange} />
							</Form.Field>
							<Form.Field error={errField === 'commissionValue'}>
								<label>Trade Commission</label>
								<Input pattern={numPattern2Dec} icon='dollar' iconPosition='left' placeholder='Trade commission' name='commissionValue' value={commissionValue} onChange={this.handleChange} />
							</Form.Field>
						</Form.Group>
						<Form.Field error={errField === 'description'}>
							<label>Description</label>
							<TextArea className={styles.description} autoHeight placeholder='Description' name='description' value={description} onChange={this.handleChange} />							
						</Form.Field>
						<Form.Field style={styles}>
							<label>Game Access</label>
							<Button.Group>
								<Button color={isPrivate ? null : 'blue'} onClick={() => this.setAccess(false)}>Public</Button>
								<Button color={isPrivate ? 'blue' : null} onClick={() => this.setAccess(true)}>Private</Button>
							</Button.Group>
						</Form.Field>
						{isPrivate && 
						<Form.Group widths='equal'>
							<Form.Field error={errField === 'password'}>
								<label>Password</label>
								<input type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
							</Form.Field>
							<Form.Field error={errField === 'password'}>
								<label>Confirm Password</label>
								<input type='password' placeholder='Confirm password' name='passwordConfirm' value={passwordConfirm} onChange={this.handleChange} />
							</Form.Field>
						</Form.Group>}
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
						<Grid className={styles.review} columns={2}>
							<Grid.Row>
								<Grid.Column>
									<div className={`${styles.column} ${styles.firstColumn}`}>
										<label>Game Name:</label>
										<p>{name}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={`${styles.column} ${styles.firstColumn}`}>
										<label>Unique ID:</label>
										<p>{id}</p>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className={styles.row}>
								<Grid.Column>
									<div className={styles.column}>
										<label>Start:</label>
										<p>{start.format('MM/DD/YYYY')}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={styles.column}>
										<label>End</label>
										<p>{end.format('MM/DD/YYYY')}</p>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className={styles.row}>
								<Grid.Column>
									<div className={styles.column}>
										<label>Starting Balance:</label>
										<p>{formatCurrency(startingBalance, { format: '%s%v', symbol: '$' })}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={styles.column}>
										<label>Trade Commission:</label>
										<p>{formatCurrency(commissionValue, { format: '%s%v', symbol: '$' })}</p>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className={styles.row}>
								<Grid.Column>
									<div className={styles.column}>
										<label>Short Selling:</label>
										<p>{shortSelling ? 'Enabled' : 'Disabled'}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={styles.column}>
										<label>Limit Orders:</label>
										<p>{limitOrders ? 'Enabled' : 'Disabled'}</p>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className={styles.row}>
								<Grid.Column>
									<div className={styles.column}>
										<label>Stop Orders:</label>
										<p>{stopOrders ? 'Enabled' : 'Disabled'}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={styles.column}>
										<label>Game access:</label>
										<p>{isPrivate ? 'Private' : 'Public'}</p>
									</div>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className={styles.row}>
								<Grid.Column>
									<div className={styles.column}>
										<label>Player Portfolios:</label>
										<p>{playerPortfolioPublic ? 'Public' : 'Private'}</p>
									</div>
								</Grid.Column>
								<Grid.Column>
									<div className={styles.column}>
										<label>Description: </label>{description}
									</div>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<Message
							error
							header='Error'
							content={errMsg}
						/>
						{!errMsg && <br />}
						<Button onClick={this.goBack} negative>Back</Button>
						<Button onClick={this.handleCreate} positive>Create</Button>
					</Form>
				</div>}
			</div>
        );
    }
}

export default withRouter(CreateGame);