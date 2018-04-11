import _ from 'lodash';
import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';

export default class Searchbar extends Component {
	constructor(props) {
		super(props);
		/*
			The source needs to have a key field, and all fields must be lowercase (otherwise rendering errors).
			Note that you will need to use lowercase field names when referencing the results elsewhere (e.g. render function).
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
		const { handleResults } = this.props;
		handleResults && handleResults(['RESET']);
		this.setState({ isLoading: false, results: [], value: '' });
	}

  	handleResultSelect(e, { result }) {
		this.setState({ value: result[this.props.field] });
	}

  	handleSearchChange(e, { value }) {
		const { searchFields, handleResults } = this.props;
		this.setState({ isLoading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => _.some(searchFields, field => re.test(result[field]));
			const results = _.filter(this.state.source, isMatch);

			this.setState({
				isLoading: false,
				results
			});

			handleResults && handleResults(results);
		}, 300)
  	}

	render() {
		const { isLoading, value, results } = this.state;

		// Need to omit any prop that was meant for Searchbar instead of of Search
		return (
			<Search
				loading={isLoading}
				onResultSelect={this.handleResultSelect}
				onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
				results={results}
				value={value}
				fluid
				{..._.omit(this.props, ['handleResults', 'searchFields'])}
			/>
		)
  	}
}
