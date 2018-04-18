import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';

export default class GameTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setBotObj: {
                gameId: this.props.gameId,
                botId: ''
            },
            loading: false,
            errStop: '',
            errSave: ''
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
            errStop: '',
            errSave: ''
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
			this.setState({ loading: false, errSave: err });
        });
    }

    handleStop() {
        const { setBotObj } = this.state;

        this.setState({
            loading: true,
            errStop: '',
            errSave: ''
        });

        GameBackend.setTradingBot(_.set(_.clone(setBotObj), 'botId', ''))
		.then(res => {
            console.log('success! ', res);
            this.setState({ loading: false });
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, errStop: err });
        });
    }

    render() {
        const { player } = this.props;
        const { setBotObj, loading, errStop, errSave } = this.state;
        const { tradingBots, activeBotId } = player;
        const { botId } = setBotObj;

        return (
			<div>
				<Header as='h2'>Trading Bot Settings</Header>
                <Header as='h3'>Active Trading Bot</Header>
                {activeBotId ?
                <Form onSubmit={this.handleStop} loading={loading} error={!!errStop}>
                    <Form.Field>
                        <label>Trading Bot Currently in Play:</label>
				        {_.find(tradingBots, { id: activeBotId }).name}
                    </Form.Field>
                    <Message
						error
						header='Error'
						content={errStop}
					/>
                    <Button icon='stop' negative type='submit' content='Stop Active Bot' />
                </Form>
                :
                <strong>You currently don't have an active trading bot.</strong>}
                <Header as='h3'>Change Active Trading Bot</Header>
                <Form onSubmit={this.handleSave} loading={loading} error={!!errSave}>
                    <Form.Field>
                        <label>Trading Bot to Make Active</label>
				        <Dropdown placeholder='Trading bot to make active' search selection options={_.map(tradingBots, t => ({ text: t.name, value: t.id }))} value={botId} onChange={this.handleChange} />  
                    </Form.Field>
                    <Message
						error
						header='Error'
						content={errSave}
					/>
                    <Button icon='save' positive type='submit' content='Save Changes' />
                </Form>            
			</div>
        );
    }
}
