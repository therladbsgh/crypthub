import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { DeleteBotModalStyle as styles } from 'styles';

export default class DeleteBotModal extends Component {
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
        const { handleDelete, botId } = this.props;

        this.setState({
            loading: true,
            err: ''
        });

		UserBackend.deleteBot({ botId })
		.then(res => {
            console.log('success! ', res);
            handleDelete(botId);
            this.close();
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
        });
    }

    render() {
        const { botId, disabled } = this.props;
        const { open, loading, err } = this.state;

        return (
            <Modal trigger={<Button icon='trash' type='button' disabled={disabled} negative content={'Delete'} />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                <Modal.Header id={styles.del}>Delete Trading Bot</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete this trading bot?</p>
                        {err && <Message error header='Error' content={err} />}
                    </Modal.Content>
                <Modal.Actions>
                    <Button negative icon='check' content='Delete Trading Bot' onClick={this.handleSubmit} loading={loading} />
                </Modal.Actions>
            </Modal>
        );
    }
}
