import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message, TextArea } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { GameTradingBotsStyle as styles } from 'styles';

export default class GameTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setBotObj: {
                gameId: this.props.gameId,
                playerId: this.props.player._id,
                botId: ''
            },
            loading: false,
            err: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleStop = this.handleStop.bind(this);
    }

    handleChange(event, { value }) {
		this.setState({
            setBotObj: {
                ...this.state.setBotObj,
                botId: value
            }
        });
    }

    handleSave() {
        const { setBotObj } = this.state;
        this.setState({
            loading: true,
            err: ''
        });

        GameBackend.setTradingBot(setBotObj)
		.then(res => {
            console.log('success! ', res);
            this.setState({
                setBotObj: {
                    ...setBotObj,
                    botId: ''
                },
                loading: false
            });
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }

    handleStop() {
        const { setBotObj } = this.state;

        this.setState({
            loading: true,
            err: ''
        });

        GameBackend.setTradingBot(_.set(_.clone(setBotObj), 'botId', ''))
		.then(res => {
            console.log('success! ', res);
            this.setState({ loading: false });
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }

    render() {
        const { player } = this.props;
        const { setBotObj, loading, err } = this.state;
        const { tradingBots, activeBotId } = player;
        const { botId } = setBotObj;

        return (
			<div>
				<Header as='h2'>Trading Bot Settings</Header>
                <Form loading={loading} error={!!err}>
                    <Form.Group>
                        <Form.Field width={5}>
                            <label>Trading Bot Currently in Play</label>
                            { activeBotId ? _.find(tradingBots, { _id: activeBotId }).name : 'You currently don\'t have an active trading bot.'}
                            <br /><br /><br />
                            <Button icon='stop' negative disabled={!activeBotId} onClick={this.handleStop} content='Stop Active Bot' />
                        </Form.Field>
                        <Form.Field width={5}>
                            <label>Trading Bot to Make Active</label>
                            <Dropdown placeholder='Trading bot to make active' search selection options={_.map(tradingBots, t => ({ text: t.name, value: t._id }))} value={botId} onChange={this.handleChange} />
                            <br /><br />
                            <Button icon='save' positive onClick={this.handleSave} content='Save Changes' />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field width={10}>
                        <Message
                            error
                            header='Error'
                            content={err}
                        />
                    </Form.Field>
                </Form>
                <Header as='h2'>Debug Log</Header>
                <Form>
                    <Form.Field>
                        <TextArea className={styles.debugLog} name='debugLog' value={'debug log here'} />
                    </Form.Field>
                </Form>
			</div>
        );
    }
}
