import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button, Message, Form, Icon, Input } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { ChangeEmailModalStyle as styles } from 'styles';

export default class ChangeEmailModal extends Component {
    constructor(props) {
        super(props);
        const { gameId, username } = this.props;

		this.state = {
            emailChangeObj: {
                email: ''
            },
            emailConfirm: '',
            open: false,
            loading: false,
            submitted: false,
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
            emailChangeObj: {
                email: ''
            },
            emailConfirm: '',
            open: false,
            loading: false,
            submitted: false,
			errMsg: '',
            errField: ''
        });
    }

    handleChange(event) {
        const target = event.target;
        
        this.setState({
            emailChangeObj: {
                [target.name]: target.value
            }
        });
    }
    
    handleChange(event) {
		const { emailChangeObj } = this.state;
		const target = event.target;
		const value = target.value;

		if (_.has(emailChangeObj, target.name)) {
			this.setState({
				emailChangeObj: {
					...emailChangeObj,
					[target.name]: value
				}
			});
		} else {
			this.setState({
				[target.name]: value
			});
		}
    }

	handleSubmit(event) {
        const { emailChangeObj, emailConfirm } = this.state;
        const { email } = emailChangeObj;

        event.preventDefault();
        this.setState({
            loading: true,
            submitted: false,
            errMsg: '',
            errField: ''
        });

        const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegExp.test(email)) {
			return this.setState({
				loading: false,
				errMsg: 'Incorrectly formatted email.',
				errField: 'email'
			});
		}

        if (email !== emailConfirm) {
            return this.setState({
                loading: false,
                errMsg: 'Emails don\'t match.',
                errField: 'email'
            });
		}

		UserBackend.saveEmail(emailChangeObj)
		.then(res => {
            console.log('success! ', res);
            this.props.successHandler(email);
            this.setState({ loading: false, submitted: true });
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({ loading: false, submitted: true, errMsg: err, errField: field });
        });
    }
    
    render() {
        const { emailChangeObj, emailConfirm, open, loading, submitted, errMsg, errField } = this.state;
        const { email } = emailChangeObj;
        const success = submitted && !errMsg;

        return (
            <div>
                <Modal trigger={<Button icon='mail outline' primary content='Change Email' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                    <Modal.Header id={styles.header}>Change Email</Modal.Header>
                        <Modal.Content>
                            <Form error={!!errMsg}>
                                <Form.Group widths='equal'>
                                    <Form.Field error={errField == 'email'} disabled={loading}>
                                        <label>New Email</label>
                                        <Input icon='mail outline' iconPosition='left' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
                                    </Form.Field>
                                    <Form.Field error={errField == 'email'} disabled={loading}>
                                        <label>Confirm New Email</label>
                                        <Input icon='mail outline' iconPosition='left' placeholder='Confirm email' name='emailConfirm' value={emailConfirm} onChange={this.handleChange} />
                                    </Form.Field>
                                </Form.Group>
                                <Message error header='Error' content={errMsg} />
                            </Form>
                        </Modal.Content>
                    <Modal.Actions>
                        <Button primary icon='save' content='Save Email' onClick={this.handleSubmit} loading={loading} />
                    </Modal.Actions>
                </Modal>
                <Modal open={open && success}>
                    <Modal.Header id={styles.success}>Success!</Modal.Header>
                        <Modal.Content>
                            <p>Your email has successfully been changed.</p>
                        </Modal.Content>
                    <Modal.Actions>
                        <Button icon='check' content='All Done' onClick={this.close} positive />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
