import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Table, Space, Tooltip, Dropdown, Menu, message, Form, Input } from 'antd'
import {
    DeleteOutlined,
    UploadOutlined,
    DownloadOutlined,
    FileFilled,
    FolderFilled,
    MoreOutlined,
    ShareAltOutlined,
    PlayCircleOutlined,
    FolderOpenOutlined,
    EyeOutlined,
    CopyOutlined,
    FormOutlined,
    ScissorOutlined,
    FolderAddOutlined
}
    from '@ant-design/icons'

import { ContentCard, MessageBox, ModalForm } from '@/components'
import ExplorerBreadcrumb from './ExplorerBreadcrumb'
import UploadModal from './UploadModal'
import queryString from 'query-string'
import filesize from 'filesize'

import './my-space.less'

const mockFileList = [{
    "id": 1,
    "userId": 2,
    "type": "DIRECTORY",
    "directoryPath": "/",
    "filename": "movies",
    "fileSize": 0,
    "mimeType": "",
    "updateTime": "2020-04-12 03:39:06",
    "createTime": "2020-04-12 03:39:06"
}, {
    "id": 3,
    "userId": 2,
    "type": "DIRECTORY",
    "directoryPath": "/",
    "filename": "test",
    "fileSize": 0,
    "mimeType": "",
    "updateTime": "2020-04-12 03:42:33",
    "createTime": "2020-04-12 03:42:33"
}, {
    "id": 4,
    "userId": 2,
    "type": "DIRECTORY",
    "directoryPath": "/",
    "filename": "测试文件夹",
    "fileSize": 0,
    "mimeType": "",
    "updateTime": "2020-04-12 03:42:44",
    "createTime": "2020-04-12 03:42:44"
}, {
    "id": 5,
    "userId": 2,
    "type": "FILE",
    "directoryPath": "/",
    "filename": "test.mp4",
    "fileSize": 1234,
    "mimeType": "video/mp4",
    "updateTime": "2020-04-12 03:42:44",
    "createTime": "2020-04-12 03:42:44"
}, {
    "id": 6,
    "userId": 2,
    "type": "FILE",
    "directoryPath": "/",
    "filename": "清明雨上.mp3",
    "fileSize": 1234,
    "mimeType": "audio/mp3",
    "updateTime": "2020-04-12 03:42:44",
    "createTime": "2020-04-12 03:42:44"
}, {
    "id": 7,
    "userId": 2,
    "type": "FILE",
    "directoryPath": "/",
    "filename": "明朝那些事儿.pdf",
    "fileSize": 1234,
    "mimeType": "application/pdf",
    "updateTime": "2020-04-12 03:42:44",
    "createTime": "2020-04-12 03:42:44"
}]

@withRouter
class MySpace extends Component {
    state = {
        currentPath: '',
        sort: null,

        selectedRowKeys: [],

        isUploadModalVisible: false,

        isAddFolderModalVisible: false,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let { path, sort } = queryString.parse(nextProps.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        if (path === prevState.currentPath && sort === prevState.sort) {
            return null
        }
        return { currentPath: path, sort: sort }
    }

    componentDidMount() {
        let { path, sort } = queryString.parse(this.props.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        this.setState({ currentPath: path, sort: sort })
        this.fetchFileList()
    }

    fetchFileList = () => {
        // const path = this.props.location
    }

    // TODO: 批量删除文件
    handleDeleteFiles = async (selectedFileList) => {
        console.log('handleDeleteFiles', selectedFileList)
        try {
            await MessageBox.dangerConfirm({ content: '是否确定删除文件？' })
        } catch (err) {
            return
        }
        // TODO: 删除文件
    }

    // TODO: 批量下载文件
    handleDownloadFiles = (selectedFileList) => {
        console.log('handleDownloadFiles', selectedFileList)
    }

    // TODO: 批量分享文件
    handleShareFiles = (selectedFileList) => {
        console.log('handleShareFiles', selectedFileList)
    }

    // TODO: 批量复制文件
    handleCopyFiles = (selectedFileList) => {
        console.log('handleCopyFiles', selectedFileList)
    }

    // TODO: 批量移动文件
    handleMoveFiles = (selectedFileList) => {
        console.log('handleMoveFiles', selectedFileList)
    }

    // TODO: 重命名文件
    handleRenameFile = (fileInfo, index) => {
        console.log('handleRenameFile', fileInfo)
    }

    // TODO: 新建文件夹
    handleAddFolder = ({ filename }) => {
        console.log('handleAddFolder', filename)
        this.setState({ isAddFolderModalVisible: false })
    }

    // 打开文件项
    handleOpenFile = (fileInfo) => {
        const path = (!this.state.currentPath || this.state.currentPath === '/' ? '' : this.state.currentPath) + '/' + fileInfo.filename
        // 打开文件夹
        if (fileInfo.type === 'DIRECTORY') {
            const queryParams = { path: path }
            if (this.state.sort) {
                queryParams.sort = this.state.sort
            }
            const routerPath = this.props.location.pathname + '?' + queryString.stringify(queryParams)
            this.props.history.push(routerPath)
        }
        // TODO: 播放视频
        else if (fileInfo.mimeType === 'video/mp4') {
        }
        // TODO: 播放音频
        else if (fileInfo.mimeType === 'audio/mp3') {
        }
        // TODO: 查看图片
        else if (fileInfo.mimeType.startsWith('image')) {
        } else {
            message.warning(fileInfo.filename + '：暂不支持打开该类型文件')
        }
    }

    // Table组件的rowSelection属性
    getTableRowSelection = () => {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: selectedRowKeys => { this.setState({ selectedRowKeys: selectedRowKeys }) },
            hideDefaultSelections: true,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT
            ],
        }
        return rowSelection
    }

    render() {
        const breadcrumb = (
            <ExplorerBreadcrumb path={this.state.currentPath} />
        )
        const iconStyle = { color: '#faad14' }

        const rowSelection = this.getTableRowSelection()

        const batchActionMenuInfo = [
            { icon: <CopyOutlined />, onClick: () => this.handleCopyFiles(this.state.selectedRowKeys), title: '复制' },
            { icon: <ScissorOutlined />, onClick: () => this.handleMoveFiles(this.state.selectedRowKeys), title: '移动' },
            { icon: <ShareAltOutlined />, onClick: () => this.handleShareFiles(this.state.selectedRowKeys), title: '共享' },
            { icon: <DeleteOutlined />, onClick: () => this.handleDeleteFiles(this.state.selectedRowKeys), title: '删除' }
        ]
        const batchActionMenu = (
            <Menu>
                {
                    batchActionMenuInfo.map((item, index) => {
                        return <Menu.Item key={index} {...item}>{item.title}</Menu.Item>
                    })
                }
            </Menu>
        )
        return (
            <ContentCard
                title="我的空间"
                description={breadcrumb}
                extra={(
                    <Space>
                        <Dropdown overlay={batchActionMenu} disabled={this.state.selectedRowKeys.length === 0}>
                            <Button icon={<MoreOutlined />}>批量操作</Button>
                        </Dropdown>
                        <Button icon={<FolderAddOutlined />} onClick={() => this.setState({ isAddFolderModalVisible: true })}>新建文件夹</Button>
                        <Button icon={<UploadOutlined />} onClick={() => this.setState({ isUploadModalVisible: true })}>上传</Button>
                    </Space>
                )}
            >
                <Table
                    dataSource={mockFileList}
                    rowSelection={rowSelection}
                    pagination={false}
                    rowKey='filename'
                    size="small"
                >
                    <Table.Column
                        title=""
                        key="mimeType"
                        align="center"
                        render={(text, record, index) => {
                            if (record.type === 'DIRECTORY') {
                                return <FolderFilled style={iconStyle} />
                            }
                            return <FileFilled style={iconStyle} />
                        }}
                    />
                    <Table.Column title="文件名" dataIndex="filename" key="filename" align="center" />
                    <Table.Column title="文件大小" dataIndex="record.fileSize" align="center" render={(text, record) => filesize(record.fileSize)} />
                    <Table.Column title="最近修改时间" dataIndex="updateTime" key="updateTime" align="center" />
                    <Table.Column
                        title="操作"
                        align="center"
                        className="table-operation"
                        render={(text, record, index) => {
                            const moreActionMenu = (
                                <Menu>
                                    <Menu.Item key="1" icon={<FormOutlined />} onClick={() => this.handleRenameFile([record.filename])}>重命名</Menu.Item>
                                    <Menu.Item key="2" icon={<CopyOutlined />} onClick={() => this.handleCopyFiles([record.filename])}>复制</Menu.Item>
                                    <Menu.Item key="3" icon={<ScissorOutlined />} onClick={() => this.handleMoveFiles([record.filename])}>移动</Menu.Item>
                                    <Menu.Item key="4" icon={<DeleteOutlined />} onClick={() => this.handleDeleteFiles([record.filename])}>删除</Menu.Item>
                                </Menu>
                            )
                            return (
                                <Space size="middle">
                                    {
                                        ((record, index) => {
                                            const buttonProps = {
                                                size: "small",
                                                type: "primary",
                                                ghost: true,
                                                onClick: () => {
                                                    this.handleOpenFile(record, index)
                                                }
                                            }
                                            if (record.mimeType === 'video/mp4' || record.mimeType === 'audio/mp3') {
                                                return (
                                                    <Tooltip placement="left" title="播放">
                                                        <Button {...buttonProps}><PlayCircleOutlined /></Button>
                                                    </Tooltip>
                                                )
                                            } else if (record.type === 'DIRECTORY') {
                                                return (
                                                    <Tooltip placement="left" title="打开">
                                                        <Button {...buttonProps}><FolderOpenOutlined /></Button>
                                                    </Tooltip>
                                                )
                                            } else {
                                                return (
                                                    <Tooltip placement="left" title="查看">
                                                        <Button {...buttonProps}><EyeOutlined /></Button>
                                                    </Tooltip>
                                                )
                                            }
                                        })(record)
                                    }
                                    <Tooltip placement="top" title="下载">
                                        <Button size="small" type="dashed" onClick={() => this.handleDownloadFiles([record.filename])}><DownloadOutlined /></Button>
                                    </Tooltip>

                                    <Tooltip placement="top" title="共享">
                                        <Button className="btn-share" size="small" onClick={() => this.handleShareFiles([record.filename])}><ShareAltOutlined /></Button>
                                    </Tooltip>
                                    <Dropdown overlay={moreActionMenu}>
                                        <Button size="small"><MoreOutlined /></Button>
                                    </Dropdown>
                                </Space>
                            )
                        }}
                    />
                </Table>

                {/* 新建文件夹对话框 */}
                <ModalForm
                    title="新建文件夹"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 17 }}
                    visible={this.state.isAddFolderModalVisible}
                    onCancel={() => this.setState({ isAddFolderModalVisible: false })}
                    onFinish={this.handleAddFolder}
                    initialValues={{ filename: '' }}
                >
                    <Form.Item
                        name="filename"
                        label="文件名"
                        rules={[
                            { required: true, message: '请输入文件名' },
                            { pattern: /^[^/:]+$/, message: '请输入正确的文件名' }
                        ]}
                    >
                        <Input placeholder="文件名" ref={input => { input && input.focus() }} />
                    </Form.Item>
                </ModalForm>

                {/* 上传对话框 */}
                <UploadModal visible={this.state.isUploadModalVisible} onCancel={() => { this.setState({ isUploadModalVisible: false }) }} />
            </ContentCard>
        )
    }
}

export default MySpace