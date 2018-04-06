import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Label } from 'semantic-ui-react';

export default class SearchExampleStandard extends Component {
	constructor(props) {
		super(props);
		/*
			The source needs to have a key field, and all fields must be lowercase (otherwise rendering errors).
			Note that you will need to use lowercase field names in the render function as a result.
		*/
		this.state = {
			isLoading: false,
			results: [],
			value: '',
			source: _.map(this.props.source, (e, key) => ({ ..._.mapKeys(e, (v, k) => k.toLowerCase()), key }))
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
		const { field } = this.props;
		this.setState({ isLoading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => re.test(result[field]);

			this.setState({
				isLoading: false,
				results: _.filter(this.state.source, isMatch)
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
