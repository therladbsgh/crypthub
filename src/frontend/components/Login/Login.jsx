import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { Navbar } from 'components';
import { SharedStyles as sharedStyles } from 'styles';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: '',
			password: '',
            err: '',
            forgot: false,
            email: '',
            submitted: false
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
		this.handleSubmitForgot = this.handleSubmitForgot.bind(this);
		this.toggleForgot = this.toggleForgot.bind(this);
	}

	handleChange(event) {		
		const target = event.target;
		this.setState({
			[target.name]: target.value
		});
	}

	handleSubmitLogin(event) {
		event.preventDefault();
		this.setState({
			err: ''
		})

		// TODO: Logic
		console.log(this.state);
    }

    handleSubmitForgot(event) {
		event.preventDefault();
		this.setState({
            err: '',
            submitted: true
		})

		// TODO: Logic
		console.log(this.state);
    }
    
    toggleForgot() {
        this.setState({
            login: '',
			password: '',
            err: '',
            forgot: !this.state.forgot,
            email: '',
            submitted: false
        });
    }

  	render() {
		return (
			<div style={sharedStyles}>
				<Navbar loggedIn={false} />
                {!this.state.forgot ?  
                <div>
                    <Header as='h1'>Login</Header>
                    <Form onSubmit={this.handleSubmitLogin} error={!!this.state.err}>
                        <Form.Field>
                            <label>Email or Username</label>
                            <input placeholder='Email or Username' name='login' value={this.state.login} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            error
                            header='Error'
                            content={this.state.err}
                        />
                        <Button type='submit'>Sign In</Button>
                    </Form>
                    <Link to='/signup'>Don't have an account?</Link><br />
                    <a onClick={this.toggleForgot}>Forgot your password?</a>
                </div>
                :
                <div>
                    <Header as='h1'>Request Password Reset</Header>
                    <Form onSubmit={this.handleSubmitForgot} success={this.state.submitted && !this.state.err} error={!!this.state.err}>
                        <Form.Field>
                            <label>Email</label>
                            <input placeholder='Email' name='email' value={this.state.email} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            success
                            header='Email Sent'
                            content='An email with instructions on resetting your password should appear in your inbox shortly.'
                        />
                        <Message
                            error
                            header='Error'
                            content={this.state.err}
                        />
                        <Button type='submit'>Submit</Button>
                    </Form>
                    <a onClick={this.toggleForgot}>Back to Login</a>
                </div>}
			</div>
		);
  	}
}
