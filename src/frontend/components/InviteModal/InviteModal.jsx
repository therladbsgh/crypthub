import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message, Dropdown } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { InviteModalStyle as styles } from 'styles';
import { UserMocks } from 'mocks';

//TODO: get users
const users = [
    UserMocks.user1,
    UserMocks.user2
];

export default class InviteModal extends Component {
    constructor(props) {
        super(props);

		this.state = {
            inviteObj: {
                gameId: this.props.gameId,
                userIds: [],
            },
            open: false,
			loading: false,
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
                userIds: [],
            },
            open: false,
			loading: false,
			err: ''
        });
    }

    handleChange(event, { value }) {
		this.setState({
            inviteObj: {
                ...this.state.inviteObj,
                userIds: value
            }
        });
	}

	handleSubmit(event) {
        this.setState({
            loading: true,
            err: ''
        });

        console.log(this.state.inviteObj);

		GameBackend.inviteUsers(this.state.inviteObj)
		.then(res => {
			console.log('success! ', res);
            this.close();
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }
    
    render() {
        const { inviteObj, open, loading, err } = this.state;
        const { userIds } = inviteObj;

        return (
            <Modal trigger={<Button icon='mail outline' positive content='Invite Players' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.invite}>Invite Players</Modal.Header>
                    <Modal.Content>
                        <Dropdown placeholder='Users to invite' multiple search selection options={_.map(users, u => ({ text: u.name, value: u.id }))} value={userIds} onChange={this.handleChange} />
                        {err && <Message error header='Error' content={err} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button positive icon='mail outline' content='Send Invites' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}
