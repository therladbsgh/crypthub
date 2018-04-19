import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message, TextArea, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';

const tradingBots = [
    {
        _id: 'id1',
        name: 'tradingBot1',
        data: 'trading bot 1 code goes here'
    },
    {
        _id: 'id2',
        name: 'tradingBot2',
        data: 'trading bot 2 code goes here'
    },
    {
        _id: 'id3',
        name: 'tradingBot3',
        data: 'trading bot 3 code goes here'
    }
];

export default class UserTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tradingBotObj: {
                botId: '',
                data: ''
            },
            loading: false,
            submitted: false,
            err: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            tradingBotObj: {
                ...this.state.tradingBotObj,
                [name]: value
            }
        });
    }

    handleDropdownChange(event, { value }) {
		this.setState({
            tradingBotObj: {
                ...this.state.tradingBotObj,
                botId: value,
                data: _.find(tradingBots, { _id: value}).data
            }
        });
    }

    handleSave(event) {
        event.preventDefault();
        this.setState({
            loading: true,
            submitted: false,
            err: ''
        });

        UserBackend.saveTradingBot(this.state.tradingBotObj)
        .then(res => {
            console.log('success! ', res);
            this.setState({
                loading: false,
                submitted: true    
            });
        }, ({ err }) => {
            console.log('error! ', err);
            this.setState({
                loading: false,
                submitted: true,
                err
            });
        });
    }

    render() {
        // const { tradingBots } = this.props;
        const { tradingBotObj, loading, submitted, err } = this.state;
        const { botId, data } = tradingBotObj;

        const name = _.get(_.find(tradingBots, { _id: botId }), 'name', '');

        return (
			<div>
                <Form onSubmit={this.handleSave} loading={loading} error={!!err} success={submitted && !err}>
                    <Form.Field>
                        <label>Trading Bot</label>
                        <Dropdown placeholder='Trading bot to edit' name='botId' search selection options={_.map(tradingBots, t => ({ text: t.name, value: t._id }))} value={botId} onChange={this.handleDropdownChange} />
                    </Form.Field>
                    <Form.Field>
                        <TextArea name='data' value={data} onChange={this.handleChange} />
                    </Form.Field>
                    <Message success header='Success!' content={`${name} has been saved.`} />
					<Message error header='Error' content={err} />
                    <Button icon='save' type='submit' positive disabled={!name} content={`Save ${name}`} />
                </Form>
            </div>
        );
    }
}
