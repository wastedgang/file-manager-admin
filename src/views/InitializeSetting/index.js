import React, { Component } from 'react'
import './initialize.less'

export default class InitializeSetting extends Component {
    state = {
        sqlType: 'MySQL',
        sqlPath: '',
        sqlName: '',
        sqlUserName: '',
        sqlPassword: '',
        loginName: '',

        isSqlPathInputPromptVisible: false,
        isSqlNameInputPromptVisible: false,
        isSqlUserNameInputPromptVisible: false,
        isSqlPasswordInputPromptVisible: false,
        isLoginNameInputPromptVisible: false,
    }

    changeSqlType = (type) => {
        this.setState({
            sqlType: type,
            sqlPath: '',
            sqlName: '',
            sqlUserName: '',
            sqlPassword: '',
            loginName: '',
            isSqlPathInputPromptVisible: false,
            isSqlNameInputPromptVisible: false,
            isSqlUserNameInputPromptVisible: false,
            isSqlPasswordInputPromptVisible: false,
            isLoginNameInputPromptVisible: false,
        })
    }

    changeSqlPath = (e) => {
        this.setState({
            sqlPath: e.currentTarget.value,
            isSqlPathInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    changeSqlName = (e) => {
        this.setState({
            sqlName: e.currentTarget.value,
            isSqlNameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    changeSqlUserName = (e) => {
        this.setState({
            sqlUserName: e.currentTarget.value,
            isSqlUserNameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }
    

    changeSqlPassword = (e) => {
        this.setState({
            sqlPassword: e.currentTarget.value,
            isSqlPasswordInputPromptVisible: e.currentTarget.value ? false : true
        })
    }
    
    changeLoginName = (e) => {
        this.setState({
            loginName: e.currentTarget.value,
            isLoginNameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    onSave = () => {
        const { sqlType, sqlName, sqlPassword, sqlPath, sqlUserName, loginName } = this.state
        if(sqlType === 'MySQL') {
            if (!sqlPath && !sqlUserName && !sqlName && !sqlPassword && !loginName) {
                this.setState({
                    isSqlPathInputPromptVisible: true,
                    isSqlNameInputPromptVisible: true,
                    isSqlUserNameInputPromptVisible: true,
                    isSqlPasswordInputPromptVisible: true,
                    isLoginNameInputPromptVisible: true,
                })
                return;
            }
            if (!sqlPath) {
                this.setState({
                    isSqlPathInputPromptVisible: true
                })
                return;
            }
            if (!sqlName) {
                this.setState({
                    isSqlNameInputPromptVisible: true
                })
                return;
            }
            if (!sqlUserName) {
                this.setState({
                    isSqlUserNameInputPromptVisible: true
                })
                return;
            }
            if (!sqlPassword) {
                this.setState({
                    isSqlPasswordInputPromptVisible: true,
                })
                return;
            }
            if (!loginName) {
                this.setState({
                    isLoginNameInputPromptVisible: true
                })
                return;
            }
            console.log( sqlType, sqlName, sqlPassword, sqlPath, sqlUserName, loginName );
            return;
        }
        if (sqlType === 'SQLite') {
            if (!sqlName && !sqlPassword && !loginName) {
                this.setState({
                    isSqlNameInputPromptVisible: true,
                    isSqlPasswordInputPromptVisible: true,
                    isLoginNameInputPromptVisible: true,
                })
                return;
            }
            if (!sqlName) {
                this.setState({
                    isSqlNameInputPromptVisible: true
                })
                return;
            }
            if (!sqlPassword) {
                this.setState({
                    isSqlPasswordInputPromptVisible: true
                })
                return;
            }
            if (!loginName) {
                this.setState({
                    isLoginNameInputPromptVisible: true
                })
                return;
            }
            console.log( sqlType, sqlName, sqlPath, loginName );
            return;
        }
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
                        <span onClick={() => this.changeSqlType('SQLite')} style={{color: this.state.sqlType === 'SQLite'?'rgb(65, 182, 255)':'rgb(247, 247, 247)'}}>SQLite</span>
                    </div>
                    <div className="input-item" style={{display: this.state.sqlType === 'MySQL'? 'block' : 'none' }}>
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="sqlPath"
                            required
                            onChange={this.changeSqlPath}
                            value={this.state.sqlPath} 
                            type="text"
                            autoFocus={true} />
                        <label htmlFor="sqlPath">地址</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isSqlPathInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库地址</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="sqlName"
                            required
                            onChange={this.changeSqlName}
                            value={this.state.sqlName} 
                            type="text"
                            />
                        <label htmlFor="sqlName">数据库名</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isSqlNameInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库名</span>
                    </div>
                    <div className="input-item"  style={{display: this.state.sqlType === 'MySQL'? 'block' : 'none' }}>
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="sqlUserName"
                            required
                            onChange={this.changeSqlUserName}
                            value={this.state.sqlUserName} 
                            type="text"
                            />
                        <label htmlFor="sqlUserName">用户名</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isSqlUserNameInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库用户名</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="password"
                            required
                            onChange={this.changeSqlPassword}
                            value={this.state.sqlPassword} 
                            type="text"
                            />
                        <label htmlFor="password">密码</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isSqlPasswordInputPromptVisible ? 'visible' : 'hidden' }}>请输入数据库密码</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="loginName"
                            required
                            onChange={this.changeLoginName}
                            value={this.state.loginName} 
                            type="text"
                        />
                        <label htmlFor="loginName">登录名称</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isLoginNameInputPromptVisible ? 'visible' : 'hidden' }}>请输入登录名称</span>
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
