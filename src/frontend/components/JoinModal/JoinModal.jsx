import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message, Form, Icon, Input } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { JoinModalStyle as styles } from 'styles';

export default class JoinModal extends Component {
    constructor(props) {
        super(props);
        const { gameId } = this.props;

		this.state = {
            joinObj: {
                gameId,
                password: ''
            },
            open: false,
			loading: false,
            errMsg: '',
            errField: ''
		};
    
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    open() {
        this.setState({ open: true });
    }

    close() {
        this.setState({
            joinObj: {
                ...this.state.joinObj,
                password: ''
            },
            open: false,
			loading: false,
			errMsg: '',
            errField: ''
        });
    }

    handleChange(event) {
        const target = event.target;
        
        this.setState({
            joinObj: {
                ...this.state.joinObj,
                [target.name]: target.value
            }
        });
	}

	handleSubmit(event) {
        const { gameId, history } = this.props;

        this.setState({
            loading: true,
            errMsg: '',
            errField: ''
        });

		GameBackend.joinGame(this.state.joinObj)
		.then(res => {
			console.log('success! ', res);
            this.close();
            window.location.reload();
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({ loading: false, errMsg: err, errField: field });
        });
    }
    
    render() {
        const { size, isPrivate } = this.props;
        const { joinObj, open, loading, errMsg, errField } = this.state;
        const { password } = joinObj;

        return (
            <Modal trigger={<Button icon='user add' compact={size === 'tiny'} primary size={size} content='Join Game' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.join}>Join Game</Modal.Header>
                    <Modal.Content>
                        {isPrivate ?
                        <Form>
                            <Form.Field error={errField == 'password'} disabled={loading}>
                                <label>Password</label>
                                <Input icon='key' iconPosition='left' type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
                            </Form.Field>
                        </Form>
                        :
                        <p>Are you sure you want to join this game?</p>}
                        {errMsg && <Message error header='Error' content={errMsg} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button primary icon='check' content='Join Game' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}
