import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, Divider, Space } from 'antd'
import { UploadControl, UserControl } from '@/components'

import './header.less'
import headerLogo from './header-logo.png'

const mapState = state => ({
    ...state.user
})
@connect(mapState)
@withRouter
class Header extends Component {
    render() {
        return (
            <Layout.Header className="admin-header">
                <div className="admin-header-logo">
                    <img src={headerLogo} alt="warehouse" />
                </div>
                <div className="admin-header-right">
                    {
                        !this.props.isLogin ? null : (
                            <Fragment>
                                <UploadControl />
                                <div>
                                    <Divider type="vertical" />
                                </div>
                            </Fragment>
                        )
                    }
                    <UserControl />
                </div>
            </Layout.Header>
        )
    }
}

export default Header