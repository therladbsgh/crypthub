import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Form, Button, Message } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { SharedStyles as sharedStyles } from 'styles';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: '',
			password: '',
            err: '',
            forgot: false,
            email: '',
            loading: false,
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
            loading: true,
			err: ''
        })
        
        UserBackend.login(_.pick(this.state, ['login', 'password']))
		.then(res => {
			console.log('success! ', res);
            this.setState({ loading: false });
            this.props.history.push('/games');
		}, err => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
		});
    }

    handleSubmitForgot(event) {
		event.preventDefault();
		this.setState({
            err: '',
            loading: true,
            submitted: true
		})

		UserBackend.forgot(_.get(this.state, 'email'))
		.then(res => {
			console.log('success! ', res);
            this.setState({ loading: false });
		}, err => {
			console.log('error! ', err);
			this.setState({ loading: false, err });
		});
    }
    
    toggleForgot() {
        this.setState({
            login: '',
			password: '',
            err: '',
            forgot: !this.state.forgot,
            email: '',
            loading: false,
            submitted: false
        });
    }

  	render() {
        const { login, password, err, forgot, email, loading, submitted } = this.state;
        const success = submitted && !err;
        
		return (
			<div style={sharedStyles}>
				<Navbar loggedIn={false} />
                {!forgot ?  
                <div>
                    <Header as='h1'>Login</Header>
                    <Form onSubmit={this.handleSubmitLogin} loading={loading} error={!!err}>
                        <Form.Field>
                            <label>Email or Username</label>
                            <input placeholder='Email or Username' name='login' value={login} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            error
                            header='Error'
                            content={err}
                        />
                        <Button type='submit'>Sign In</Button>
                    </Form>
                    <Link to='/signup'>Don't have an account?</Link><br />
                    <a onClick={this.toggleForgot}>Forgot your password?</a>
                </div>
                :
                <div>
                    <Header as='h1'>Request Password Reset</Header>
                    <Form onSubmit={this.handleSubmitForgot} loading={loading} success={success} error={!!err}>
                        <Form.Field disabled={success}>
                            <label>Email</label>
                            <input placeholder='Email' name='email' value={email} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            success
                            header='Email Sent'
                            content='An email with instructions on resetting your password should appear in your inbox shortly.'
                        />
                        <Message
                            error
                            header='Error'
                            content={err}
                        />
                        <Button type='submit' disabled={success}>Submit</Button>
                    </Form>
                    <a onClick={this.toggleForgot}>Back to Login</a>
                </div>}
			</div>
		);
  	}
}

// This puts the history prop on props which allows for redirection
export default withRouter(Login);
