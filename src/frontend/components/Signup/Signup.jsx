import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Button, Checkbox, Message } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { SignupStyle as styles } from 'styles';

export default class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password: '',
			passwordConfirm: '',
			agree: false,
			submitted: false,
			err: ''
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {		
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({
			[target.name]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({
			submitted: true,
			err: ''
		})

		UserBackend.signup({ username: 'testUsername', email: 'testEmail', password: 'testPassword' })
		.then(res => {
			console.log('success! ', res);
		}, err => {
			console.log('error! ', err);
		});
	}	

  	render() {
		return (
			<div>
				<Navbar loggedIn={false} />
				<Header as='h1'>Signup</Header>
				<Form onSubmit={this.handleSubmit} success={this.state.submitted && !this.state.err} error={!!this.state.err}>
					<Form.Field>
						<label>Username</label>
						<input placeholder='Username' name='username' value={this.state.username} onChange={this.handleChange} />
					</Form.Field>
					<Form.Field>
						<label>Email</label>
						<input placeholder='Email' name='email' value={this.state.email} onChange={this.handleChange} />
					</Form.Field>
					<Form.Field>
						<label>Password</label>
						<input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleChange} />
					</Form.Field>
					<Form.Field>
						<label>Confirm Password</label>
						<input type='password' placeholder='Confirm Password' name='passwordConfirm' value={this.state.passwordConfirm} onChange={this.handleChange} />
					</Form.Field>
					<Form.Field>
						<Checkbox label='I agree to the Terms and Conditions' name='agree' checked={this.state.agree} onChange={(e, data) => this.handleChange({ target: data })} />
					</Form.Field>
					<Message
						success
						header='Signup Successful!'
						content="Check your email for a verification link."
					/>
					<Message
						error
						header='Error'
						content={this.state.err}
					/>
					<Button type='submit'>Submit</Button>
				</Form>
				<Link to='/login'>Already have an account?</Link>
			</div>
		);
  	}
}
