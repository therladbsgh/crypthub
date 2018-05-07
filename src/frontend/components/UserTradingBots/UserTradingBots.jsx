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
            uploaded: false,
            loading: false,
            submitted: false,
            file: '',
            err: ''
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.updateTradingBots = this.updateTradingBots.bind(this);
    }

    handleUpload(event) {
        const { tradingBots } = this.state;
        const file = event.target.files[0];   

        this.setState({
            uploaded: false,
            loading: true,
            submitted: false,
            file: '',
            err: ''
        });

        if (!_.includes(file.type, 'javascript')) {
            return this.setState({
                uploaded: false,
                loading: false,
                submitted: true,
                err: 'The file must be a javascript file.'
            });
        }

        if (_.some(tradingBots, { name: file.name })) {
            return this.setState({
                uploaded: false,
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
                uploaded: true,
                loading: false,
                submitted: true
            });
        }, ({ err }) => {
            console.log('error! ', err);
            this.setState({
                uploaded: false,
                loading: false,
                submitted: true,
                err
            });
        });
    }

    updateTradingBots(newTradingBots) {
        this.setState({
            tradingBots: newTradingBots,
            uploaded: false
        });
    }

    render() {
        const { tradingBots, uploaded, file, loading, submitted, err } = this.state;

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
                            <input type='file' id='file-upload' className={sharedStyles.hide} value={file} onChange={this.handleUpload} />
                        </div>
                    </Form.Field>
                </Form>}
                <TradingBotIDE tradingBots={tradingBots} uploaded={uploaded} updateTradingBots={this.updateTradingBots} />
			</div>
        );
    }
}
