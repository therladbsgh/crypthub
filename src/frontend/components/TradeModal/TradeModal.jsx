import * as _ from 'lodash';
import React, { Component } from 'react';
import formatCurrency from 'format-currency';
import { Modal, Button, Statistic, Form, Dropdown, Message, Input, Label, Header, Icon } from 'semantic-ui-react';
import { GameBackend } from 'endpoints';
import { TradeModalStyle as styles } from 'styles';
import { SharedStyle as sharedStyles } from 'styles';

const priceOrders = ['limit', 'stop'];

export default class TradeModal extends Component {
    constructor(props) {
        super(props);
        const { symbol, currPrice } = this.props.coin;

		this.state = {
			tradeObj: {
                type: 'market',
                side: 'buy',
                size: '',
                price: String(currPrice),
                symbol: symbol,
                date: new Date(),
                GTC: true,
                filled: false
            },
            open: false,
			loading: false,
            success: false,
            done: false,
			errMsg: '',
			errField: ''
		};
    
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleDropdownChange = this.handleDropdownChange.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    open() {
        this.setState({ open: true });
    }

    close() {
        const { symbol, currPrice } = this.props.coin;

        this.setState({
            tradeObj: {
                type: 'market',
                side: 'buy',
                size: '',
                price: String(currPrice),
                symbol: symbol,
                date: new Date(),
                GTC: true,
                filled: false
            },
            open: false,
			loading: false,
            success: false,
            done: false,
			errMsg: '',
			errField: ''
        });
    }

    handleChange(event) {
		const { tradeObj } = this.state;
		const target = event.target;
        const name = target.name;
        const value = target.value;

        // Allows for patterned input (i.e. numbers)
        if (!target.validity.valid) return;
		
		if (_.has(tradeObj, name)) {
			this.setState({
				tradeObj: {
					...tradeObj,
					[name]: value
				}
			});
		} else {
			this.setState({
				[name]: value
			});
		}
    }

    handleDropdownChange({ name, value }) {
        const { tradeObj } = this.state;
        const { side, price } = tradeObj;

        if (name === 'type') {
            this.setState({
                tradeObj: {
                    ...tradeObj,
                    side: value === 'short' ? 'sell' : side,
                    price: !_.includes(priceOrders, value) ? String(this.props.coin.currPrice) : price,
                    [name]: value
                }
            });
        } else {
            this.setState({
                tradeObj: {
                    ...tradeObj,
                    [name]: value
                }
            });
        }
    }
    
    handleRadioChange({ name, checked }) {
        const { tradeObj } = this.state;

        const split = _.split(name, '-');
        const fieldName = split[0];
        const value = split[1] === 'yes' ? checked : split[1] === 'no' ? !checked : split[1];

        this.setState({
            tradeObj: {
                ...tradeObj,
                [fieldName]: value
            }
        });
	}

	handleSubmit(event) {
		const { tradeObj } = this.state;
		const { size, price } = tradeObj;

		event.preventDefault();
		this.setState({
			loading: true,
			errMsg: '',
			errField: ''
        })
        
        if (size === '') {
            return this.setState({
                loading: false,
                errMsg: 'Amount must have a value.',
                errField: 'size'
            });
        }

        if (price === '') {
            return this.setState({
                loading: false,
                errMsg: 'Price must have a value.',
                errField: 'price'
            });
        }

        const tradeObjSend = _.clone(tradeObj);
        _.set(tradeObjSend, 'size', Number(size));
        _.set(tradeObjSend, 'price', Number(price));
        _.set(tradeObjSend, 'date', new Date());

        console.log(tradeObjSend);

		GameBackend.placeOrder(tradeObjSend)
		.then(res => {
			console.log('success! ', res);
			this.setState({ loading: false, success: true });
		}, ({ err, field }) => {
			console.log('error! ', err);
			this.setState({ loading: false, errMsg: err, errField: field });
		});
    }
    
    render() {
        const { coin, orderTypes } = this.props;
        const { name, symbol, currPrice } = coin;
        const { tradeObj, open, loading, success, errMsg, errField } = this.state;
        const { type, side, size, price, GTC } = tradeObj;

        const numPattern2Dec = '^\\d*(?:\\.\\d{0,2})?$';
        const numPattern8Dec = '^\\d*(?:\\.\\d{0,8})?$';

        const showPrice = _.includes(priceOrders, type);
        const showSide = type !== 'short';

        return (
            <div>
                <Modal trigger={<Button icon='exchange' primary compact size='tiny' content='Trade' />} open={open} onOpen={this.open} onClose={this.close} closeIcon>
                    <Modal.Header>Trade {name} ({symbol})</Modal.Header>
                    <Modal.Content>
                        <div className={sharedStyles.center}>
                            <Statistic>
                                <Statistic.Label>Current Price</Statistic.Label>
                                <Statistic.Value>{formatCurrency(currPrice, { format: '%s%v', symbol: '$' })}</Statistic.Value>
                            </Statistic>
                        </div>

                        <Form onSubmit={this.handleSubmit} loading={loading} error={!!errMsg}>
                            <Form.Field>
                                <label>Order Type</label>
                                <Dropdown placeholder='Order Type' name='type' selection options={orderTypes} value={type} onChange={(e, data) => this.handleDropdownChange(data)} />
                            </Form.Field>
                            <Form.Group inline>
                                <label><span className={!showSide ? sharedStyles.disabled : ''}>Side</span></label>
                                <Form.Radio label='Buy' name='side-buy' checked={side === 'buy'} onChange={(e, data) => this.handleRadioChange(data)} disabled={!showSide} />
                                <Form.Radio label='Sell' name='side-sell' checked={side === 'sell'} onChange={(e, data) => this.handleRadioChange(data)} disabled={!showSide} />
                            </Form.Group>
                            <Form.Field error={errField == 'size'}>
                                <label>Amount</label>
                                <input pattern={numPattern8Dec} placeholder={`Amount to ${side.toLowerCase()}`} name='size' value={size} onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field error={errField == 'price'} disabled={!showPrice}>
                                <label>{showPrice ? `${_.capitalize(type)} ` : ''}Price</label>
                                <Input pattern={numPattern2Dec} icon='dollar' iconPosition='left' placeholder={`Price per 1.0 ${symbol}`} name='price' value={price} onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Group inline>
                                <label>Expiration</label>
                                <Form.Radio label='Day Order (24 hours)' name='GTC-no' checked={!GTC} onChange={(e, data) => this.handleRadioChange(data)} />
                                <Form.Radio label='Good Till Cancelled' name='GTC-yes' checked={GTC} onChange={(e, data) => this.handleRadioChange(data)} />
                            </Form.Group>
                            <Message
                                error
                                header='Error'
                                content={errMsg}
                            />
                            <Button icon='check' type='submit' primary content='Place Order' />
                        </Form>
                    </Modal.Content>
                </Modal>
                <Modal open={open && success}>
                    <Modal.Header id={styles.success}>Success!</Modal.Header>
                        <Modal.Content>
                            <p>Your {GTC ? 'GTC' : 'day'} {type} order to {side} {size} {symbol} at {formatCurrency(price, { format: '%s%v', symbol: '$' })}/{symbol} has been submitted.</p>
                        </Modal.Content>
                    <Modal.Actions>
                        <Button icon='check' content='All Done' onClick={this.close} positive />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
