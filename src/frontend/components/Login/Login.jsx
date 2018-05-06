import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Header, Form, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { LoginStyle as styles, SharedStyle as sharedStyles } from 'styles';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loginObj: {
                login: '',
			    password: ''
            },
            forgotObj: {
                email: ''
            },
            errMsg: '',
            errField: '',
            forgot: false,
            loading: false,
            submitted: false,
            hasMounted: false
		};
	
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
		this.handleSubmitForgot = this.handleSubmitForgot.bind(this);
		this.toggleForgot = this.toggleForgot.bind(this);
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
        const { loginObj, forgotObj } = this.state;
        const target = event.target;
        const value = target.value;
        
        if (_.has(loginObj, target.name)) {
			this.setState({
				loginObj: {
					...loginObj,
					[target.name]: value
				}
			});
		} else if (_.has(forgotObj, target.name)) {
            this.setState({
				forgotObj: {
					...forgotObj,
					[target.name]: value
				}
			});
        } else {
			this.setState({
				[target.name]: value
			});
		}
	}

	handleSubmitLogin(event) {
        const { history, location } = this.props;

		event.preventDefault();
		this.setState({
            loading: true,
            errMsg: '',
            errField: ''
        })
        
        UserBackend.login(this.state.loginObj)
		.then(res => {
			console.log('success! ', res);
            this.setState({ loading: false });
            if (location.redirected) {
                history.goBack();
            } else {
                history.push({ pathname: '/games', state: { openTab: location.openTab }});
            }
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({ loading: false, errMsg: err, errField: field });
        });
    }

    handleSubmitForgot(event) {
		event.preventDefault();
		this.setState({
            errMsg: '',
            errField: '',
            submitted: false,
            loading: true,
		})

		UserBackend.forgot(this.state.forgotObj)
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
    
    toggleForgot() {
        this.setState({
            loginObj: {
                login: '',
			    password: ''
            },
            forgotObj: {
                email: ''
            },
            errMsg: '',
            errField: '',
            forgot: !this.state.forgot,
            loading: false,
            submitted: false
        });
    }

  	render() {
        const { loginObj, forgotObj, errMsg, errField, forgot, loading, submitted, hasMounted } = this.state;
        const { login, password } = loginObj;
        const { email } = forgotObj;
        const success = submitted && !errMsg;
        
		return (
            hasMounted &&
			<div className={sharedStyles.container}>
				<Navbar username={''} />
                {!forgot ?  
                <Container id={styles.container}>
                    <Header as='h1' textAlign='center'>Login</Header>
                    <Form onSubmit={this.handleSubmitLogin} loading={loading} error={!!errMsg}>
                        <Form.Field error={errField == 'username' || errField == 'email'}>
                            <label>Email or Username</label>
                            <input placeholder='Email or Username' name='login' value={login} onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field error={errField == 'password'}>
                            <label>Password</label>
                            <input type='password' placeholder='Password' name='password' value={password} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            error
                            header='Error'
                            content={errMsg}
                        />
                        <Button icon='sign in' primary fluid type='submit' content='Log In' />
                    </Form>
                    <br />
                    <div className={sharedStyles.center}>
                        <Link to='/signup'>Don't have an account?</Link><br />
                        <a onClick={this.toggleForgot}>Forgot your password?</a>
                    </div>
                </Container>
                :
                <Container id={styles.container}>
                    <Header as='h1' textAlign='center'>Request Password Reset</Header>
                    <Form onSubmit={this.handleSubmitForgot} loading={loading} success={success} error={!!errMsg}>
                        <Form.Field disabled={success} error={errField == 'email'}>
                            <label>Email</label>
                            <input placeholder='Email' name='email' value={email} onChange={this.handleChange} />
                        </Form.Field>
                        <Message
                            success
                            header='Email Sent'
                            content='An email with details on your password should appear in your inbox shortly.'
                        />
                        <Message
                            error
                            header='Error'
                            content={errMsg}
                        />
                        <Button icon='mail outline' primary fluid type='submit' disabled={success} content='Request Reset' />
                    </Form>
                    <br />
                    <div className={sharedStyles.center}>
                        <a onClick={this.toggleForgot}>Back to Login</a>
                    </div>
                </Container>}
			</div>
		);
  	}
}

// This puts the history prop on props which allows for redirection
export default withRouter(Login);
