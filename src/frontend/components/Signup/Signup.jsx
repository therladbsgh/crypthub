import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Header, Form, Button, Checkbox, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { SignupStyle as styles, SharedStyle as sharedStyles } from 'styles';

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signupObj: {
				username: '',
				email: '',
				password: ''
			},
			passwordConfirm: '',
			agree: false,
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
				this.setState({ hasMounted: true });
			} else {
				history.push('/games');
			}
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
	}

	handleChange(event) {
		const { signupObj } = this.state;
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		
		if (_.has(signupObj, target.name)) {
			this.setState({
				signupObj: {
					...signupObj,
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
		const { signupObj, passwordConfirm, agree } = this.state;
		const { email, password } = signupObj;

		event.preventDefault();
		this.setState({
			submitted: false,			
			loading: true,
			errMsg: '',
			errField: ''
		})

		const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegExp.test(email)) {
			return this.setState({
				loading: false,
				errMsg: 'Incorrectly formatted email.',
				errField: 'email'
			});
		}

		if (password !== passwordConfirm) {
			return this.setState({
				loading: false,
				errMsg: 'Passwords don\'t match.', 
				errField: 'password' 
			});
		}

		if (!agree) {
			return this.setState({
				loading: false,
				errMsg: 'You must agree to the Terms and Conditions.', 
				errField: 'agree' 
			});
		}

		UserBackend.signup(signupObj)
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
		const { signupObj, passwordConfirm, agree, loading, submitted, errMsg, errField, hasMounted } = this.state;
		const { username, email, password } = signupObj;
		const success = submitted && !errMsg;

		return (
			hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={''} />
				<Container id={styles.container}>
					<Header as='h1' textAlign='center'>Signup</Header>
					<Form onSubmit={this.handleSubmit} loading={loading} success={success} error={!!errMsg}>
						<Form.Field error={errField == 'username'} disabled={success}>
							<label>Username</label>
							<input placeholder='Username' name='username' value={username} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field error={errField == 'email'} disabled={success}>
							<label>Email</label>
							<input placeholder='Email' name='email' value={email} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field error={errField == 'password'} disabled={success}>
							<label>Password</label>
							<input type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field error={errField == 'password'} disabled={success}>
							<label>Confirm Password</label>
							<input type='password' placeholder='Confirm Password' name='passwordConfirm' value={passwordConfirm} onChange={this.handleChange} />
						</Form.Field>
						<Form.Field error={errField == 'agree'} disabled={success}>
							<Checkbox label='I agree to the Terms and Conditions' name='agree' checked={agree} onChange={(e, data) => this.handleChange({ target: data })} />
						</Form.Field>
						<Message
							success
							header='Signup Successful!'
							content="Check your email for a verification link."
						/>
						<Message
							error
							header='Error'
							content={errMsg}
						/>
						<Button icon='signup' primary type='submit' fluid disabled={success} content='Submit' />
					</Form>
					<br />
					<div className={sharedStyles.center}>
						<Link to='/login'>Already have an account?</Link>
					</div>
				</Container>
			</div>
		);
  	}
}

export default withRouter(Signup);
