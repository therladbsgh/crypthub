import * as _ from 'lodash';
import React, { Component } from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default class TradeModal extends Component {
    render() {
        return (
			<Modal trigger={<Button primary>Trade</Button>} closeIcon>
                <Modal.Header>Trade {this.props.coin.symbol}</Modal.Header>
                <Modal.Content image>
                    trade stuff here
                </Modal.Content>
            </Modal>
        );
    }
}
