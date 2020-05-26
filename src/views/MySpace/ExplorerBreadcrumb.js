import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { HomeFilled, FolderFilled, FolderOpenFilled } from '@ant-design/icons'
import PropTypes from 'prop-types'
import queryString from 'query-string'

@withRouter
class ExplorerBreadcrumb extends Component {
    render() {
        const filenames = this.props.path.split('/').filter((filename) => {
            return filename.trim()
        })

        const iconStyle = { color: '#faad14' }
        const folderInfoList = [{
            filename: '根目录',
            path: '/',
            icon: <HomeFilled style={iconStyle} />,
            queryString: '?' + queryString.stringify({ path: '/' })
        }, ...filenames.map((filename, index) => {
            const path = '/' + filenames.slice(0, index + 1).join('/')
            return {
                filename: filename,
                path: path,
                icon: <FolderFilled style={iconStyle} />,
                queryString: '?' + queryString.stringify({ path: path })
            }
        })]
        return (
            <Breadcrumb separator="&nbsp;&nbsp;/&nbsp;&nbsp;">
                {
                    folderInfoList.map((folderInfo, index) => {
                        if (index !== folderInfoList.length - 1) {
                            return (
                                <Breadcrumb.Item key={folderInfo.path}>
                                    <Link to={{
                                        pathname: this.props.location.pathname,
                                        search: folderInfo.queryString
                                    }}>
                                        {folderInfo.icon}&nbsp;{folderInfo.filename}
                                    </Link>
                                </Breadcrumb.Item>
                            )
                        } else {
                            const icon = index === 0 ? <HomeFilled style={iconStyle} /> : <FolderOpenFilled style={iconStyle} />
                            return (
                                <Breadcrumb.Item key={folderInfo.path}>
                                    {icon}&nbsp;{folderInfo.filename}
                                </Breadcrumb.Item>
                            )
                        }
                    })
                }
            </Breadcrumb>
        )
    }

    static propTypes = {
        path: PropTypes.string.isRequired
    }
}

export default ExplorerBreadcrumb
