import React, { Component } from 'react'
import './login2.less'

export default class Login extends Component {
    state = {
        username:'',
        password:''
    }
    changeUsername = (e) => {
        let tip = document.getElementById('userNameTip')
        this.setState({
            username: e.currentTarget.value
        }, ()=> {
            if(!this.state.username) {
                tip.style.visibility = 'visible' 
            } else {
                tip.style.visibility = 'hidden' 
            }
        })
    }
    changePassword = (e) => {
        let tip = document.getElementById('passwordTip')
        this.setState({
            password: e.currentTarget.value
        },()=> {
            if(!this.state.password) {
                tip.style.visibility = 'visible' 
            } else {
                tip.style.visibility = 'hidden' 
            }
        })
    }


    render() {
        return (
            <>
                <div className="login-page">
                    <div className="login-box">
                        <div className="login-title"></div>
                        <div className="input-item">
                            <input id="username" required onChange={this.changeUsername} value={this.state.username} type="text"></input>
                            <label htmlFor="username">用户名</label>
                            <div className="bottom-line"></div>
                            <span id="userNameTip">请输入用户名</span>
                        </div>
                        <div className="input-item">
                            <input id="password" required onChange={this.changePassword} value={this.state.password} type="password"></input>
                            <label htmlFor="password">密码</label>
                            <div className="bottom-line"></div>
                            <span id="passwordTip">请输入密码</span>
                        </div>
                        <div className="btn-submit">
                            <button>
                                登 录
                            </button>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
