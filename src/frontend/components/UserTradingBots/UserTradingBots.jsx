import * as _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Dropdown, Form, Button, Message, TextArea, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { TradingBotIDE } from 'components';
import { UserTradingBotsStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class UserTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tradingBots: this.props.tradingBots,
            loading: false,
            submitted: false,
            err: ''
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.updateTradingBots = this.updateTradingBots.bind(this);
    }

    handleUpload(event) {
        const { tradingBots } = this.state;
        const file = event.target.files[0]

        this.setState({
            loading: true,
            submitted: false,
            err: ''
        });

        if (!_.includes(file.type, 'javascript')) {
            return this.setState({
                loading: false,
                submitted: true,
                err: 'The file must be a javascript file.'
            });
        }

        if (_.some(tradingBots, { name: file.name })) {
            return this.setState({
                loading: false,
                submitted: true,
                err: `You already have a trading bot with the name ${file.name}.`
            });
        }

        UserBackend.uploadTradingBot({ file })
        .then(res => {
            console.log('success! ', res);
            this.setState({
                tradingBots: _.concat(tradingBots, res),
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

    updateTradingBots(newTradingBots) {
        this.setState({
            tradingBots: newTradingBots
        });
    }

    render() {
        const { tradingBots, loading, submitted, err } = this.state;

        return (
			<div>
                <Header as='h2' id={styles.bot}>Create/Edit Trading Bots</Header>
                <Link to='/docs'>Find the API Documentation here.</Link>
                {submitted &&
                <Message error={!!err} success={!err} header={err ? 'Error' : 'Success'} content={err || 'Trading bot uploaded!'} />}
                {loading ? 
                <Form>
                    <br />
                    <Form.Field>
                        <label>Upload a Trading Bot</label>
                        <Button primary disabled loading content='Upload File' />
                    </Form.Field>
                </Form>
                :
                <Form>
                    {!submitted && <br />}
                    <Form.Field>
                        <label>Upload a Trading Bot</label>
                        <div>
                            <label htmlFor='file-upload' className='ui icon button primary' >
                                <Icon name='upload' className={styles.icon} />
                                Upload File
                            </label>
                            <input type='file' id='file-upload' className={sharedStyles.hide} onChange={this.handleUpload} />
                        </div>
                    </Form.Field>
                </Form>}
                <TradingBotIDE tradingBots={tradingBots} uploaded={submitted && !err} updateTradingBots={this.updateTradingBots} />
			</div>
        );
    }
}
