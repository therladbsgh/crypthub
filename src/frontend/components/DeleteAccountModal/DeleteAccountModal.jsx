import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { DeleteAccountModalStyle as styles } from 'styles';

class DeleteAccountModal extends Component {
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
        event.preventDefault();
        this.setState({
            loading: true,
            err: ''
        });

		UserBackend.deleteUser()
		.then(res => {
			console.log('success! ', res);
            this.close();
            this.props.history.push('/');
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }
    
    render() {
        const { open, loading, err } = this.state;

        return (
            <Modal trigger={<Button icon='trash' type='button' negative content='Delete Account' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.del}>Delete Account</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete your account?</p>
                        {err && <Message error header='Error' content={err} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='check' content='Delete Account' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default withRouter(DeleteAccountModal);
