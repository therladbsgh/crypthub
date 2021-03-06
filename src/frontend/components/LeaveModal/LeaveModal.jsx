import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Message } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { LeaveModalStyle as styles } from 'styles';

class LeaveModal extends Component {
    constructor(props) {
        super(props);

		this.state = {
            open: false,
			loading: false,
			err: ''
		};
    
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    open() {
        this.setState({ open: true });
    }

    close() {
        this.setState({
            open: false,
			loading: false,
			err: ''
        });
    }

	handleSubmit(event) {
        const { gameId, username, history } = this.props;

        this.setState({
            loading: true,
            err: ''
        });

		GameBackend.leaveGame({ gameId, username })
		.then(res => {
			console.log('success! ', res);
            this.close();
            history.push('/games');
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }
    
    render() {
        const { open, loading, err } = this.state;

        return (
            <Modal trigger={<Button icon='user cancel' negative content='Leave Game' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.leave}>Leave Game</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to leave this game?</p>
                        {err && <Message error header='Error' content={err} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='check' content='Leave Game' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default withRouter(LeaveModal);
