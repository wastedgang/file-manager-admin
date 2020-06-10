import React, { Component } from 'react'
import './initialize.less'

export default class InitializeSetting extends Component {
    state = {
        sqlName: '',
        password: '',
        loginName: '',
        sqlType: 'MySQL',

        isSqlNameInputPromptVisible: false,
        isPasswordInputPromptVisible: false,
        isLoginNameInputPromptVisible: false,
    }

    changeSqlType = (type) => {
        this.setState({
            sqlType: type
        })
    }

    changeSqlNamee = (e) => {
        this.setState({
            sqlName: e.currentTarget.value,
            isSqlNameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }
    

    changePassword = (e) => {
        this.setState({
            password: e.currentTarget.value,
            isPasswordInputPromptVisible: e.currentTarget.value ? false : true
        })
    }
    
    changeLoginName = (e) => {
        this.setState({
            loginName: e.currentTarget.value,
            isLoginNameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    onSave = () => {
        const { sqlName, password, loginName } = this.state
        if (!sqlName && !password && !loginName) {
            this.setState({
                isSqlNameInputPromptVisible: true,
                isPasswordInputPromptVisible: true,
                isLoginNameInputPromptVisible: true
            })
            return;
        }
        if (!sqlName) {
            this.setState({
                isSqlNameInputPromptVisible: true
            })
            return;
        }
        if (!password) {
            this.setState({
                isPasswordInputPromptVisible: true
            })
            return;
        }
        if (!loginName) {
            this.setState({
                isLoginNameInputPromptVisible: true
            })
            return;
        }
        console.log( sqlName, password, loginName ,this.state.sqlType );
    }

    onKeyDownchange = (e) => {
        if (e.keyCode === 13) {
            this.onSave();
        }
    }

    render() {
        return (
            <div className="initialze-page">
                <div className="form-wrapper">
                    <div className="sql-selection">
                        数据库类型：
                        <span onClick={() => this.changeSqlType('MySQL')} style={{color: this.state.sqlType === 'MySQL'?'rgb(65, 182, 255)':'rgb(247, 247, 247)'}}>MySQL</span>
                        <span onClick={() => this.changeSqlType('SQLLine')} style={{color: this.state.sqlType === 'SQLLine'?'rgb(65, 182, 255)':'rgb(247, 247, 247)'}}>SQLLine</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="sqlName"
                            required
                            onChange={this.changeSqlNamee}
                            value={this.state.sqlName} 
                            type="text"
                            autoFocus={true} />
                        <label htmlFor="sqlName">数据库文件名</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isSqlNameInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库文件名</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="password"
                            required
                            onChange={this.changePassword}
                            value={this.state.password} 
                            type="text"
                            autoFocus={true} />
                        <label htmlFor="password">数据库密码</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isPasswordInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库密码</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="loginName"
                            required
                            onChange={this.changeLoginName}
                            value={this.state.loginName} 
                            type="text"
                            autoFocus={true} />
                        <label htmlFor="loginName">登录名称</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isLoginNameInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库文件名</span>
                    </div>

                    <div className="btn-submit">
                        <button onClick={this.onSave}>保  存</button>
                    </div>
                    <div className="submit-tip">初始登录密码为：<span>123456</span></div>
                </div>
            </div>
        )
    }
}
