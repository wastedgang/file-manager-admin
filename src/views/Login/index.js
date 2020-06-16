import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { login, logout } from '@/actions/user'
import { message } from 'antd'
import axios from 'axios'
import './login.less'

const mapState = state => ({
    ...state.user
})
@connect(mapState, { login, logout })
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

    onLogin = async () => {
        const { username, password } = this.state
        if (!username && !password) {
            this.setState({
                isUsernameInputPromptVisible: true,
                isPasswordInputPromptVisible: true
            })
            return
        }
        if (!username) {
            this.setState({
                isUsernameInputPromptVisible: true
            })
            return
        }
        if (!password) {
            this.setState({
                isPasswordInputPromptVisible: true
            })
            return
        }
        try {
            const response = await axios.post('/api/v1/auth/login', { username, password })
            if (response.data.code === '000000') {

                window.localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))
                window.localStorage.setItem('accessToken', response.data.data.token)
                this.props.login(response.data.data.token, response.data.data.user)
                message.success('登录成功')
                this.props.history.push('/')
                return
            }
            this.props.logout()
        } catch (err) {
            this.props.logout()
        }
    }

    onKeyDownchange = (e) => {
        if (e.keyCode === 13) {
            this.onLogin()
        }
    }

    render() {
        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="login-title"></div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="username"
                            required
                            onChange={this.changeUsername}
                            value={this.state.username}
                            type="text"
                            autoFocus={true} />
                        <label htmlFor="username">用户名</label>
                        <div className="bottom-line"></div>
                        <span style={{ visibility: this.state.isUsernameInputPromptVisible ? 'visible' : 'hidden' }}>请输入用户名</span>
                    </div>
                    <div className="input-item">
                        <input
                            onKeyDown={e => this.onKeyDownchange(e)}
                            id="password" required
                            onChange={this.changePassword}
                            value={this.state.password}
                            type="password" />
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
    }
}

export default Login