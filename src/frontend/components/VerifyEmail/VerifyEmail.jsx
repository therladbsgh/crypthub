import * as _ from 'lodash';
import React, { Component } from 'react';
import queryString from 'query-string';
import { Modal, Button, Message, Icon } from 'semantic-ui-react';
import { UserBackend } from 'endpoints';
import { Navbar } from 'components';

export default class VerifyEmail extends Component {
    constructor(props) {
        super(props);

		this.state = {
			loading: false,
            err: '',
            hasMounted: false
		};

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const token = queryString.parse(this.props.location.search).token;
        UserBackend.verifyEmail(token)
		.then(res => {
			console.log('success! ', res);
            this.setState({ hasMounted: true });
		}, ({ err }) => {
			console.log('error! ', err);
			this.setState({ hasMounted: true, err });
        });
    }

	handleSubmit(event) {
        this.setState({
            loading: true,
            err: ''
        });

		// GameBackend.cancelOrder(this.props.tradeId)
		// .then(res => {
		// 	console.log('success! ', res);
        //     this.close();
		// }, ({ err }) => {
		// 	console.log('error! ', err);
		// 	this.setState({ loading: false, err });
        // });
    }
    
    render() {
        const { loading, err, hasMounted } = this.state;

        return (
            hasMounted &&
            <div>
                <Navbar />
                <Message error={!!err} success={!err} header='Error' content={err || 'Your email has been verified!'} />
            </div>
        );
    }
}
