import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Modal, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';
import { VerifyEmailStyle as styles, SharedStyle as sharedStyles } from 'styles';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);

		this.state = {
            username: '',
            loading: false,
            submitted: false,
            alreadyVerified: false,
            err: '',
            success: '',
            email: '',
            hasMounted: false
		};

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const { history, location } = this.props;

        const params = queryString.parse(location.search);
        const { token, email } = params;
        if (!token || !email) return history.push('/pagenotfound');


        UserBackend.getUsername()
		.then(resUser => {
			console.log('success! ', resUser);
            UserBackend.verifyEmail(token)
            .then(resVerify => {
                console.log('success! ', resVerify);
                this.setState({
                    username: resUser.username,
                    hasMounted: true,
                    success: 'Your email has been verified!'
                });
            }, ({ err }) => {
                console.log('errorverify! ', err);
                this.setState({ username: resUser.user ? resUser.user.username : '',
                    hasMounted: true,
                    err,
                    email
                });
            });
		}, ({ err }) => {
			console.log('error! ', err);
			history.push({ pathname: '/error', error: true });
        });
    }

	handleSubmit(event) {
        this.setState({
            loading: true,
            submitted: false,
            err: '',
            success: ''
        });

		UserBackend.sendVerification(this.state.email)
		.then(res => {
			console.log('success! ', res);
            this.setState({ loading: false, submitted: true, success: 'Verification email sent!' });
		}, ({ err, field }) => {
			console.log('error! ', err);
            this.setState({ loading: false, submitted: true, err, alreadyVerified: field === 'already-verified' });
        });
    }
    
    render() {
        const { username, loading, submitted, alreadyVerified, err, success, hasMounted } = this.state;

        return (
            hasMounted &&
            <div className={sharedStyles.container}>
                <Navbar username={username} />
                <Container id={styles.container}>
                    {(err || success) &&
                    <Message error={!!err} success={!!success} header={err ? 'Error' : 'Success'} content={err || success} />}
                    {!success && !alreadyVerified &&
                    <Button icon='mail outline' loading={loading} primary onClick={this.handleSubmit} fluid content='Resend Verification Email' />}
                </Container>
            </div>
        );
    }
}

export default withRouter(VerifyEmail);
