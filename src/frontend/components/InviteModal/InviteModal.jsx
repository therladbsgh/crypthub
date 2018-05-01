import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message, Dropdown, Form } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { InviteModalStyle as styles, SharedStyle as sharedStyles } from 'styles';

export default class InviteModal extends Component {
    constructor(props) {
        super(props);

		this.state = {
            inviteObj: {
                gameId: this.props.gameId,
                usernames: [],
            },
            open: false,
            loading: false,
            submitted: false,
            err: ''
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
            inviteObj: {
                ...this.state.inviteObj,
                usernames: [],
            },
            open: false,
            loading: false,
            submitted: false,
			err: ''
        });
    }

    handleChange(event, { value }) {
		this.setState({
            inviteObj: {
                ...this.state.inviteObj,
                usernames: value
            }
        });
	}

	handleSubmit(event) {
        this.setState({
            loading: true,
            submitted: false,
            err: ''
        });

		GameBackend.inviteUsers(this.state.inviteObj)
		.then(res => {
			console.log('success! ', res);
            this.setState({ loading: false, submitted: true });
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, submitted: true, err });
        });
    }
    
    render() {
        const { inviteObj, open, submitted, loading, err } = this.state;
        const { usernames } = inviteObj;
        const success = submitted && !err;

        return (
            <div className={sharedStyles.inline}>
                <Modal trigger={<Button icon='mail outline' positive content='Invite Players' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                    <Modal.Header id={styles.invite}>Invite Players</Modal.Header>
                        <Modal.Content>
                            <Form error={!!err}>
                                <Form.Field>
                                    <label>Users to Invite</label>
                                    <Dropdown placeholder='Usernames' multiple search selection options={_.map(this.props.users, u => ({ text: u.username, value: u.username }))} value={usernames} onChange={this.handleChange} />
                                </Form.Field>
                                <Message error header='Error' content={err} />
                            </Form>
                        </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='mail outline' content='Send Invites' onClick={this.handleSubmit} loading={loading} />
                    </Modal.Actions>
                </Modal>
                <Modal open={open && success}>
                    <Modal.Header id={styles.invite}>Success!</Modal.Header>
                        <Modal.Content>
                            <p>The users you selected have been sent an email invitation to this game.</p>
                        </Modal.Content>
                    <Modal.Actions>
                        <Button icon='check' content='All Done' onClick={this.close} positive />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
