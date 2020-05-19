import React, { Component } from 'react'
import { Button } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { ContentCard, MessageBox } from '@/components'
import ExplorerBreadcrumb from './ExplorerBreadcrumb'
import queryString from 'query-string'

export default class MySpace extends Component {
    state = {
        path: '',
        sort: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let { path, sort } = queryString.parse(nextProps.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        if (path === prevState.path && sort === prevState.sort) {
            return null
        }
        return { path: path, sort: sort }
    }

    componentDidMount() {
        let { path, sort } = queryString.parse(this.props.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        this.setState({ path: path, sort: sort })
        this.fetchFileList()
    }

    fetchFileList = () => {
        // const path = this.props.location
    }

    render() {
        const breadcrumb = (
            <ExplorerBreadcrumb path={this.state.path} />
        )
        return (
            <ContentCard
                title="我的空间"
                description={breadcrumb}
            // extra={<Button icon={<UserAddOutlined />} onClick={() => this.setState({ isAddUserModalVisible: true })}>添加用户</Button>}
            >
            </ContentCard>
        )
    }
}
