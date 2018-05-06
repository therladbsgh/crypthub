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

    render() {
        const { tradingBots, loading, submitted, err } = this.state;

        return (
			<div>
                <Header as='h2'>Upload a Trading Bot</Header>
                {submitted &&
                <Message error={!!err} success={!err} header={err ? 'Error' : 'Success'} content={err || 'Trading bot uploaded!'} />}
                {loading ? <Button primary disabled loading content='Upload File' />
                :
                <div>
                    <label htmlFor='file-upload' className='ui icon button primary' >
                        <Icon name='upload' className={styles.icon} />
                        Upload File
                    </label>
                    <input type='file' id='file-upload' className={sharedStyles.hide} onChange={this.handleUpload} />
                </div>}
				<Header as='h2' id={styles.bot}>Create/Edit Trading Bots</Header>
                <Link to='/docs'>Find the API Documentation here.</Link>
                <TradingBotIDE tradingBots={tradingBots} uploaded={submitted && !err} />
			</div>
        );
    }
}
