import * as _ from 'lodash';
import React, { Component } from 'react';
import { Header, Dropdown, Form, Button, Message, TextArea, Icon, Input } from 'semantic-ui-react';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import { UserBackend } from 'endpoints';
import { DeleteBotModal } from 'components';
import { TradingBotIDEStyle as styles } from 'styles';

export default class UserTradingBots extends Component {
    constructor(props) {
        super(props);
        const { tradingBots } = this.props;

        this.state = {
            tradingBots,
            tradingBotObj: {
                botId: '',
                botName: '',
                data: '',
                log: ''
            },
            loading: false,
            submitted: false,
            success: '',
            err: '',
            errAdd: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCreateNew = this.handleCreateNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.runBot = this.runBot.bind(this);
        this.stopBot = this.stopBot.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { tradingBots, uploaded } = newProps;

        if (uploaded) {
            const newBot = tradingBots[tradingBots.length - 1];
            return this.setState({
                tradingBots,
                tradingBotObj: {
                    botId: newBot._id,
                    botName: newBot.name,
                    data: newBot.data,
                    log: newBot.log
                }
            });
        }
    }

    handleChange(event) {
		const { name, value } = event.target;
		
        this.setState({
            tradingBotObj: {
                ...this.state.tradingBotObj,
                [name]: value
            }
        });
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
        const { tradingBots } = this.state;
        
        const bot = _.find(tradingBots, { _id: value });

		this.setState({
            tradingBotObj: {
                botId: value,
                botName: bot.name,
                data: bot.data,
                log: bot.log
            }
        });
    }

    handleSave(event) {
        const { updateTradingBots } = this.props;
        const { tradingBots, tradingBotObj } = this.state;
        const { botId, botName, data, log } = tradingBotObj;

        event.preventDefault();
        this.setState({
            loading: true,
            submitted: false,
            err: '',
            errAdd: ''
        });

        if (_.some(tradingBots, bot => bot._id != botId && bot.name == botName)) {
            return this.setState({
                loading: false,
                submitted: true,
                err: `You already have a trading bot with the name ${botName}.`
            });
        }

        UserBackend.saveTradingBot(tradingBotObj)
        .then(res => {
            console.log('success! ', res);
            const newTradingBots = _.concat(_.filter(tradingBots, bot => bot._id != botId), { _id: botId, name: botName, data, log });
            this.setState({
                tradingBots: newTradingBots,
                loading: false,
                submitted: true,
                success: `${botName} has been saved.`
            });
            updateTradingBots(newTradingBots);
        }, ({ err }) => {
            console.log('error! ', err);
            this.setState({
                loading: false,
                submitted: true,
                err
            });
        });
    }

    handleCreateNew(event) {
        const { updateTradingBots } = this.props;
        const { tradingBots } = this.state;

        event.preventDefault();
        this.setState({
            loading: true,
            submitted: false,
            err: '',
            errAdd: ''
        });

        UserBackend.newTradingBot()
        .then(res => {
            console.log('success! ', res);
            const newTradingBots = _.concat(tradingBots, res);
            this.setState({
                tradingBots: newTradingBots,
                tradingBotObj: { botId: res._id, botName: res.name, data: res.data, log: res.log },
                loading: false,
            });
            updateTradingBots(newTradingBots);
        }, ({ err }) => {
            console.log('error! ', err);
            this.setState({
                loading: false,
                errAdd: err
            });
        });
    }

    handleDelete(botId) {
        const { updateTradingBots } = this.props;
        const { tradingBots, tradingBotObj } = this.state;

        const newTradingBots = _.filter(tradingBots, bot => bot._id != botId);
        this.setState({
            tradingBots: newTradingBots,
            tradingBotObj: {
                botId: '',
                botName: '',
                data: ''
            }
        });
        updateTradingBots(newTradingBots);
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
        const { tradingBots, tradingBotObj, loading, submitted, running, success, err, errAdd } = this.state;
        const { botId, botName, data, log } = tradingBotObj;

        return (
			<div className={styles.top}>
                {errAdd && <Message error header='Error' content={errAdd} />}
                <Form onSubmit={this.handleSave} loading={loading} error={!!err} success={submitted && !err}>
                    <Form.Group>
                        <Form.Field width={8} disabled={running}>
                            <label>Trading Bot</label>
                            <Dropdown placeholder='Trading bot to edit' name='botId' search selection options={_.map(tradingBots, t => ({ text: t.name, value: t._id }))} value={botId} onChange={this.handleDropdownChange} />
                        </Form.Field>
                        <Form.Field width={2} disabled={running}>
                            <label>Add New Bot</label>
                            <Button icon='add' type='button' fluid positive disabled={running} onClick={this.handleCreateNew} content={'New Bot'} />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field width={10} disabled={!botId}>
                        <label>Name</label>
                        <Input placeholder='Trading bot name' name='botName' value={botName} onChange={this.handleChange} />
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
							<TextArea className={styles.debugLog} autoHeight name='log' value={log} />
                        </Form.Field>
                    </Form.Group>
                    <Message success header='Success!' content={success} />
					<Message error header='Error' content={err} />
                    <Button icon='save' type='submit' positive disabled={!botId || running} content={'Save'} />
                    <DeleteBotModal handleDelete={this.handleDelete} botId={botId} disabled={!botId || running} />
                    <Button icon='play' type='button' primary disabled={!botId || running} onClick={this.runBot} content={'Run'} />
                    <Button icon='stop' type='button' negative disabled={!botId || !running} onClick={this.stopBot} content={'Stop'} />
                </Form>
            </div>
        );
    }
}
