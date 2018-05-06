export const methods = [
	{
		name: 'placeOrder',
		description: 'There are three different types of orders that are available to you: market, limit, and stop. Orders can only be placed if your account has sufficient funds. Once an order is placed, your account funds will be put on hold for the duration of the order. How much and which funds are put on hold depends on the order type and parameters specified.',
		params: [
			{
				name: 'type',
				type: 'string',
				description: "Indicates the type of this order. Must be one of ['market', 'limit', 'stop']."
			},
			{
				name: 'side',
				type: 'string',
				description: "Indicates whether this order is a buy or a sell order. Must be one of ['buy', 'sell']."
			},
			{
				name: 'size',
				type: 'number',
				description: "The amount of coin you wish to trade. Must be greater than 0 and have no more than 8 decimal places."
			},
			{
				name: 'price',
				type: 'number',
				description: "The price per coin value you wish to trade at. Must be greater than 0 and have no more than 2 decimal places."
			},
			{
				name: 'coin',
				type: 'string',
				description: "The coin to trade. Must be one of ['BTC', 'ETH']"
			},
			{
				name: 'GTC',
				type: 'boolean',
				description: "Indicates whether or not this order is Good 'Till Cancelled. If false, then the order will expire in 24 hours."
			}
		],
		return: {
			type: 'string',
			description: 'The id of the successfully placed order.'
		}
	},
	{
		name: 'cancelOrder',
		description: 'Cancel a previously placed order that has not yet expired or been filled.',
		params: [
			{
				name: 'orderId',
				type: 'string',
				description: 'The id of the order to cancel.'
			}
		],
		return: {
			type: 'null',
			description: 'Nothing.'
		}
	},
	{
		name: 'cancelAll',
		description: 'Cancel all current orders.',
		params: [],
		return: {
			type: 'null',
			description: 'Nothing.'
		}
	},
	{
		name: 'getOrder',
		description: 'Get a single order.',
		params: [
			{
				name: 'orderId',
				type: 'string',
				description: 'The id of the order to get.'
			}
		],
		return: {
			type: 'order',
			description: 'The order requested.'
		}
	},
	{
		name: 'getOrders',
		description: 'Get all current orders.',
		params: [],
		return: {
			type: '[order]',
			description: 'An array of all current orders (i.e. those that aren\'t yet filled or expired).'
		}
	},
	{
		name: 'getCompletedOrders',
		description: 'Get all completed orders.',
		params: [],
		return: {
			type: '[order]',
			description: 'An array of all completed orders (i.e. those that are filled or expired).'
		}
	},
	{
		name: 'getPortfolio',
		description: 'Get your portfolio.',
		params: [],
		return: {
			type: '[asset]',
			description: 'An array of all your assets.'
		}
	}
];