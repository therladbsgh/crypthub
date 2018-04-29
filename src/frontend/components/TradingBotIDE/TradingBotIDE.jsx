import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message, TextArea, Icon } from 'semantic-ui-react';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import { UserBackend } from 'endpoints';
import { DeleteBotModal } from 'components';
import { TradingBotIDEStyle as styles } from 'styles';

const tradingBots = [
    {
        _id: 'id1',
        name: 'tradingBot1',
        data: 'trading bot 1 code goes here'
    },
    {
        _id: 'id2',
        name: 'tradingBot2',
        data: 'trading bot 2 code goes here'
    },
    {
        _id: 'id3',
        name: 'tradingBot3',
        data: 'trading bot 3 code goes here'
    }
];

export default class UserTradingBots extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tradingBotObj: {
                botId: '',
                data: ''
            },
            debugLog: '',
            loading: false,
            submitted: false,
            err: ''
        };

        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.runBot = this.runBot.bind(this);
        this.stopBot = this.stopBot.bind(this);
    }

    handleEditorChange(value) {
        this.setState({
            tradingBotObj: {
                ...this.state.tradingBotObj,
                data: value
            }
        });
    }

    handleDropdownChange(event, { value }) {
		this.setState({
            tradingBotObj: {
                ...this.state.tradingBotObj,
                botId: value,
                data: _.find(tradingBots, { _id: value}).data
            }
        });
    }

    handleSave(event) {
        event.preventDefault();
        this.setState({
            loading: true,
            submitted: false,
            err: ''
        });

        UserBackend.saveTradingBot(this.state.tradingBotObj)
        .then(res => {
            console.log('success! ', res);
            this.setState({
                loading: false,
                submitted: true    
            });
        }, ({ err }) => {
            console.log('error! ', err);
            this.setState({
                loading: false,
                submitted: true,
                err
            });
        });
    }

    runBot() {
        this.setState({
            running: true
        });
    }

    stopBot() {
        this.setState({
            running: false
        });
    }

    render() {
        // const { tradingBots } = this.props;
        const { tradingBotObj, debugLog, loading, submitted, running, err } = this.state;
        const { botId, data } = tradingBotObj;

        const name = _.get(_.find(tradingBots, { _id: botId }), 'name', '');

        return (
			<div>
                <Form onSubmit={this.handleSave} loading={loading} error={!!err} success={submitted && !err}>
                    <Form.Field width={10}>
                        <label>Trading Bot</label>
                        <Dropdown placeholder='Trading bot to edit' name='botId' search selection options={_.map(tradingBots, t => ({ text: t.name, value: t._id }))} value={botId} onChange={this.handleDropdownChange} />
                    </Form.Field>
                    <Form.Group>
                        <Form.Field width={10}>
                            <AceEditor
                                mode='javascript'
                                theme='textmate'
                                name='data'
                                width='100%'
                                height='500px'
                                onChange={this.handleEditorChange}
                                fontSize={14}
                                showPrintMargin={false}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={data}
                                enableBasicAutocompletion={true}
                                enableLiveAutocompletion={true}
                                enableSnippets={false}
                                showLineNumbers={true}
                                tabSize={2}
                                editorProps={{$blockScrolling: Infinity}}
                            />
                        </Form.Field>
                        <Form.Field width={6}>
                            <label>Debug Log</label>
							<TextArea className={styles.debugLog} autoHeight name='debugLog' value={debugLog} />
                        </Form.Field>
                    </Form.Group>
                    <Message success header='Success!' content={`${name} has been saved.`} />
					<Message error header='Error' content={err} />
                    <Button icon='save' type='submit' positive disabled={!name || running} content={`Save ${name}`} />
                    <DeleteBotModal botId={botId} botName={name} disabled={!name || running} />
                    <Button icon='play' type='button' primary disabled={!name || running} onClick={this.runBot} content={`Run ${name}`} />
                    <Button icon='stop' type='button' negative disabled={!name || !running} onClick={this.stopBot} content={`Stop ${name}`} />
                </Form>
            </div>
        );
    }
}
