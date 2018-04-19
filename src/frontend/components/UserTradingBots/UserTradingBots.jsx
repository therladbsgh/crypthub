import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message, TextArea, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { UserTradingBotsStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class UserTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            submitted: false,
            err: ''
        };

        // this.handleChange = this.handleChange.bind(this);
        // this.handleSave = this.handleSave.bind(this);
        // this.handleStop = this.handleStop.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(event) {
        const file = event.target.files[0]

        this.setState({
            loading: true,
            submitted: false,
            err: ''
        });

        if (file.type !== 'text/javascript') {
            this.setState({
                loading: false,
                submitted: true,
                err: 'The file must be a javascript file.'
            });
        } else {
            UserBackend.uploadTradingBot({ user: this.props.username, file })
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
    }

    render() {
        const { loading, submitted, err } = this.state;

        return (
			<div>
                <Header as='h2'>Upload a Trading Bot</Header>
                {submitted &&
                <Message error={!!err} success={!err} header={err ? 'Error' : 'Success'} content={err || 'Trading bot uploaded!'} />}
                {loading ? <Button positive disabled loading content='Upload File' />
                :
                <div>
                    <label htmlFor='file-upload' className='ui icon button positive' >
                        <Icon name='upload' className={styles.icon} />
                        Upload File
                    </label>
                    <input type='file' id='file-upload' className={sharedStyles.hide} onChange={this.handleUpload} />
                </div>}
				<Header as='h2'>Create/Edit Trading Bots</Header>
			</div>
        );
    }
}
