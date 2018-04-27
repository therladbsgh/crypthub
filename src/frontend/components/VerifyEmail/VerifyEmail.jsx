import * as _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Modal, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);

		this.state = {
            username: '',
            loading: false,
            submitted: false,
            err: '',
            success: '',
            email: '',
            hasMounted: false
		};

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const params = queryString.parse(this.props.location.search);
        const { token, email } = params;
        if (!token || !email) return this.props.history.push('/pagenotfound');


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
                console.log('error! ', err);
                this.setState({ username: resUser.user ? resUser.user.username : '',
                    hasMounted: true,
                    err,
                    email
                });
            });
		}, ({ err }) => {
			console.log('error! ', err);
			alert(`Error: ${err}`);
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
		}, ({ err }) => {
			console.log('error! ', err);
            this.setState({ loading: false, submitted: true, err });
        });
    }
    
    render() {
        const { username, loading, submitted, err, success, hasMounted } = this.state;

        return (
            hasMounted &&
            <div>
                <Navbar username={username} />
                {submitted &&
                <Message error={!!err} success={!!success} header={err ? 'Error' : 'Success'} content={err || success} />}
                {(err || submitted) &&
                <Button icon='mail outline' loading={loading} primary onClick={this.handleSubmit} content='Resend Verification Email' />}
            </div>
        );
    }
}

export default withRouter(VerifyEmail);
