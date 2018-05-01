import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Icon, Container, Form, Input, Message } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar, ChangeEmailModal } from 'components'; 
import { UserSettingsStyle as styles, SharedStyle as sharedStyles } from 'styles';

class UserSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
            username: '',
            passwordChangeObj: {
                password: ''
            },
            passwordConfirm: '',
            loading: false,
            submitted: false,
            errMsg: '',
            errField: '',
			hasMounted: false
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		const { history } = this.props;
		UserBackend.getUsername()
		.then(res => {
			console.log('success! ', res);
            if (_.isEmpty(res)) {
				history.push({ pathname: '/login', redirected: true });
			} else {
                this.setState({ username: res.username, hasMounted: true });
			}
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
        });
    }
    
    handleChange(event) {
		const { passwordChangeObj } = this.state;
		const target = event.target;
		const value = target.value;

		if (_.has(passwordChangeObj, target.name)) {
			this.setState({
				passwordChangeObj: {
					...passwordChangeObj,
					[target.name]: value
				}
			});
		} else {
			this.setState({
				[target.name]: value
			});
		}
    }
    
    handleSubmit() {
        const { passwordChangeObj, passwordConfirm } = this.state;
        const { password } = passwordChangeObj;

        event.preventDefault();
        this.setState({
            errMsg: '',
            errField: '',
            submitted: false,
            loading: true
        });

        if (password !== passwordConfirm) {
            return this.setState({
                loading: false,
                errMsg: 'Passwords don\'t match.',
                errField: 'password'
            });
		}

        UserBackend.savePassword(passwordChangeObj)
		.then(res => {
			console.log('success! ', res);
			this.setState({
				submitted: true,
				loading: false
			});
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({
                submitted: true,                
                loading: false, 
				errMsg: err,
				errField: field
			});
		});
    }

  	render() {
        const { username, passwordChangeObj, passwordConfirm, loading, submitted, errMsg, errField, hasMounted } = this.state;
        const { password } = passwordChangeObj;

		return (
			hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={username} />
				<Container id={styles.container}>
					<Header as='h1'>Welcome, {username}</Header>
                    <Header as='h3'>Your email is: EMAIL HERE</Header>
                    <ChangeEmailModal />
                    <Header as='h3'>Change Password</Header>
                    <Form onSubmit={this.handleSubmit} loading={loading} success={submitted && !errMsg} error={!!errMsg}>
                        <Form.Group widths='equal'>
                            <Form.Field error={errField === 'password'}>
                                <label>New Password</label>
                                <Input icon='key' iconPosition='left' type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field error={errField === 'password'}>
                                <label>Confirm New Password</label>
                                <Input icon='key' iconPosition='left' type='password' placeholder='Confirm password' name='passwordConfirm' value={passwordConfirm} onChange={this.handleChange} />
                            </Form.Field>
                        </Form.Group>
                        <Message
                            success
                            header='Password Change Successful!'
                            content="Your password has been updated."
                        />
                        <Message
                            error
                            header='Error'
                            content={errMsg}
                        />
                        <Button icon='save' type='submit' positive content='Save Password' />
                    </Form>
				</Container>
			</div>
		);
  	}
}

export default withRouter(UserSettings);