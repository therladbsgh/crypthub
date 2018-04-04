import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class SearchExampleStandard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			results: [],
			value: ''
		};
	
		this.resetComponent = this.resetComponent.bind(this);
		this.handleResultSelect = this.handleResultSelect.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
	}

  	componentWillMount() {
		this.resetComponent();
  	}

	resetComponent() {
		this.setState({ isLoading: false, results: [], value: '' });
	}

  	handleResultSelect(e, { result }) {
		this.setState({ value: result[this.props.field] });
	}

  	handleSearchChange(e, { value }) {
		const { field, source } = this.props;
		this.setState({ isLoading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => re.test(result[field]);

			this.setState({
				isLoading: false,
				results: _.filter(source, isMatch)
			});
		}, 300)
  	}

	render() {
		const { isLoading, value, results } = this.state;

		return (
			<Search
				loading={isLoading}
				onResultSelect={this.handleResultSelect}
				onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
				results={results}
				value={value}
				fluid
				{...this.props}
			/>
		)
  	}
}
