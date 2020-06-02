import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '@/actions/user'
import './login.less'

const mapState = state => ({
    ...state.user
})
@connect(mapState, { login })
@withRouter
class Login extends Component {
    state = {
        username: '',
        password: '',

        isUsernameInputPromptVisible: false,
        isPasswordInputPromptVisible: false,
    }

    changeUsername = (e) => {
        this.setState({
            username: e.currentTarget.value,
            isUsernameInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    changePassword = (e) => {
        this.setState({
            password: e.currentTarget.value,
            isPasswordInputPromptVisible: e.currentTarget.value ? false : true
        })
    }

    onLogin = () => {
        const { username, password } = this.state
        if (!username || !password) {
            return
        }
        this.props.login({ username, password })
    }

    render() {
        return (
            this.props.isLogin ? <Redirect to="/" /> : (
                <div className="login-page">
                    <div className="login-box">
                        <div className="login-title"></div>
                        <div className="input-item">
                            <input id="username" required onChange={this.changeUsername} value={this.state.username} type="text"></input>
                            <label htmlFor="username">用户名</label>
                            <div className="bottom-line"></div>
                            <span style={{ visibility: this.state.isUsernameInputPromptVisible ? 'visible' : 'hidden' }}>请输入用户名</span>
                        </div>
                        <div className="input-item">
                            <input id="password" required onChange={this.changePassword} value={this.state.password} type="password"></input>
                            <label htmlFor="password">密码</label>
                            <div className="bottom-line"></div>
                            <span style={{ visibility: this.state.isPasswordInputPromptVisible ? 'visible' : 'hidden' }}>请输入密码</span>
                        </div>
                        <div className="btn-submit">
                            <button onClick={this.onLogin}>登 录</button>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default Login