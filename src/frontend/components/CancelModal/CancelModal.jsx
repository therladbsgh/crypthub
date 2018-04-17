import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { CancelModalStyle as styles } from 'styles';

export default class CancelModal extends Component {
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
        this.setState({
            loading: true,
            err: ''
        });

		GameBackend.cancelOrder(this.props.tradeId)
		.then(res => {
			console.log('success! ', res);
            this.close();
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }
    
    render() {
        const { open, loading, err } = this.state;

        return (
            <Modal trigger={<Button compact negative size='small' content='Cancel' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.cancel}>Confirm Cancellation</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to cancel this trade order?</p>
                        {err && <Message error header='Error' content={err} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='check' content='Cancel Order' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}
