import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import formatCurrency from 'format-currency';
import { Header, Button, Form, Message, Grid, Icon, Input } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { GameCard, JoinModal, LeaveModal, InviteModal } from 'components';
import { GameSettingsStyle as styles } from 'styles';

class GameSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameObj: {
                ...this.props.game,
                password: '',
                passwordConfirm: ''
            },
            submitted: false,
            loading: false,            
            errMsg: '',
            errField: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.setAccess = this.setAccess.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit() {
        const { gameObj } = this.state;
        const { isPrivate, password, passwordConfirm } = gameObj;

        event.preventDefault();
        this.setState({
            errMsg: '',
            errField: '',
            submitted: false,
            loading: true
        });

        if (isPrivate && password !== passwordConfirm) {
            return this.setState({
                loading: false,
                errMsg: 'Passwords don\'t match.',
                errField: 'password'
            });
		}

		const gameObjSend = _.omit(gameObj, ['passwordConfirm']);

        GameBackend.saveGame(gameObjSend)
		.then(res => {
			console.log('success! ', res);
			this.setState({
				submitted: true,
				loading: false
			});
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({
                submitted: true,                
                loading: false, 
				errMsg: err,
				errField: field
			});
		});
    }

    render() {
        const { inGame, isHost, username, game, users } = this.props;
        const { gameObj, submitted, loading, errMsg, errField } = this.state;
        const { id, host, playerPortfolioPublic, startingBalance, commissionValue, shortSelling, limitOrders, stopOrders, isPrivate, password, passwordConfirm, completed } = gameObj;

        return (
			<div>
                {!completed &&
                [<Header key='1' as='h2'>Game Actions</Header>,
                isHost && <InviteModal key='2' gameId={id} users={users} />,
                inGame ?
                <LeaveModal key='3' gameId={id} username={username} />
                :
                username ?
                <JoinModal key='3' size='medium' isPrivate={isPrivate} gameId={id} />
                :
                <Button key='3' icon='user add' size='medium' primary onClick={() => this.props.history.push({ pathname:'/login', redirected: true })} content='Join Game' />]}
				<Header as='h2'>About This Game</Header>
                <GameCard game={game} />
                {isHost && !completed &&
                [<Header key='header' as='h2'>Game Options</Header>,
                <Form key='form' loading={loading} success={submitted && !errMsg} error={!!errMsg}>
                    <Form.Field>
                        <label>Game Access</label>
                        <Button.Group>
                            <Button icon='unlock' color={isPrivate ? null : 'blue'} onClick={() => this.setAccess(false)} content='Public' />
                            <Button icon='lock' color={isPrivate ? 'blue' : null} onClick={() => this.setAccess(true)} content='Private' />
                        </Button.Group>
                    </Form.Field>
                    {isPrivate && 
                    <Form.Group widths='equal'>
                        <Form.Field error={errField === 'password'}>
                            <label>Password</label>
                            <Input icon='key' iconPosition='left' type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field error={errField === 'password'}>
                            <label>Confirm Password</label>
                            <Input icon='key' iconPosition='left' type='password' placeholder='Confirm password' name='passwordConfirm' value={passwordConfirm} onChange={this.handleChange} />
                        </Form.Field>
                    </Form.Group>}
                    <Message
						success
						header='Settings Change Successful!'
						content="The game settings have been saved."
					/>
                    <Message
                        error
                        header='Error'
                        content={errMsg}
                    />
                    <Button icon='save' onClick={this.handleSubmit} positive content='Save Changes' />
                </Form>]}
                <Header as='h2'>Game Settings</Header>
                <Grid className={styles.settings} columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <div className={`${styles.column} ${styles.firstColumn}`}>
                                <label>Player Portfolios:</label>
                                <p>{playerPortfolioPublic ? 'Public' : 'Private'}</p>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className={`${styles.column} ${styles.firstColumn}`}>
                                <label>Starting Balance:</label>
                                <p>{formatCurrency(startingBalance, { format: '%s%v', symbol: '$' })}</p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.row}>
                        <Grid.Column>
                            <div className={styles.column}>
                                <label>Trade Commission:</label>
                                <p>{formatCurrency(commissionValue, { format: '%s%v', symbol: '$' })}</p>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className={styles.column}>
                                <label>Short Selling:</label>
                                <p>{shortSelling ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={styles.row}>
                        <Grid.Column>
                            <div className={styles.column}>
                                <label>Limit Orders:</label>
                                <p>{limitOrders ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </Grid.Column>
                        <Grid.Column>
                            <div className={styles.column}>
                                <label>Stop Orders:</label>
                                <p>{stopOrders ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    {(!isHost || completed) &&
                    <Grid.Row className={styles.row}>
                        <Grid.Column>
                            <div className={styles.column}>
                                <label>Game Access:</label>
                                <p>{isPrivate ? 'Private' : 'Public'}</p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>}
                </Grid>
			</div>
        );
    }
}

export default withRouter(GameSettings);
