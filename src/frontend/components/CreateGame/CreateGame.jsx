import * as _ from 'lodash';
import React, { Component } from 'react';
import { Tab, Header, Dropdown } from 'semantic-ui-react';
import { Searchbar, Game } from 'components';

export default class CreateGame extends Component {
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
	}

	handleChange(event) {		
		const target = event.target;
		this.setState({
			[target.name]: target.value
		});å
    }

    render() {
        return (
            <Header as='h2'>Create a Game</Header>
        );
    }
}

// const CreateGame = (props) => (
// 	<Tab.Pane key='tab3'>
// 		<Header as='h2'>Create a Game</Header>
//         <Form onSubmit={this.handleSubmit} error={!!this.state.err}>
//             <Form.Field>
//                 <label>Email or Username</label>
//                 <input placeholder='Email or Username' name='login' value={this.state.login} onChange={this.handleChange} />
//             </Form.Field>
//             <Form.Field>
//                 <label>Password</label>
//                 <input type='password' placeholder='Password' name='password' value={this.state.password} onChange={this.handleChange} />
//             </Form.Field>
//             <Message
//                 error
//                 header='Error'
//                 content={this.state.err}
//             />
//             <Button type='submit'>Sign In</Button>
//         </Form>
// 	</Tab.Pane>
// )
  
// export default CreateGame
