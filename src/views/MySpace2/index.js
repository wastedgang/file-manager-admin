import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Space, Tooltip, Dropdown, Menu, message, Form, Input, Spin } from 'antd'
import {
    DeleteOutlined,
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
    FolderAddOutlined,
    ReloadOutlined
} from '@ant-design/icons'

import { ContentCard, MessageBox, ModalForm, Table } from '@/components'
import { refreshFileList } from '@/actions/files'

import ExplorerBreadcrumb from './ExplorerBreadcrumb'
import queryString from 'query-string'
import filesize from 'filesize'
import axios from 'axios'

import './my-space.less'

const mapState = state => ({
    // isFilesLoading: state.files.isLoading,
    // files: state.files.files,
})
@connect(mapState, { refreshFileList })
@withRouter
class MySpace extends Component {
    state = {
        currentPath: '',
        sort: null,

        shouldLoadFiles: false,
        files: [],
        isFilesLoading: false,

        selectedRowKeys: [],

        isAddFolderModalVisible: false,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let { path, sort } = queryString.parse(nextProps.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        if (path === prevState.currentPath && sort === prevState.sort) {
            return null
        }

        const newState = {}
        if (sort !== prevState.sort) {
            newState.shouldLoadFiles = true
            newState.sort = sort
        }
        if (path !== prevState.currentPath) {
            newState.shouldLoadFiles = true
            newState.currentPath = path
            newState.selectedRowKeys = []
        }
        return newState
    }

    componentDidMount() {
        let { path, sort } = queryString.parse(this.props.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        this.setState({ currentPath: path, sort: sort, shouldLoadFiles: true })
    }

    componentDidUpdate() {
        this.refreshFileList()
    }

    // 刷新文件列表
    refreshFileList = async () => {
        // console.log('refreshFileList1')
        // if (!this.state.shouldLoadFiles || this.props.isFilesLoading) {
        //     return
        // }
        // console.log('refreshFileList2')
        if (!this.state.shouldLoadFiles || this.state.isFilesLoading) {
            return
        }
        this.setState({ shouldLoadFiles: false, isFilesLoading: true })
        let { path, sort } = queryString.parse(this.props.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null
        // this.props.refreshFileList({ path, sort })

        const now = new Date()
        const requestParams = { directory_path: path }
        if (sort) {
            requestParams.sort = sort
        }
        try {
            const response = await axios.get('/api/v1/my_space/files', { params: requestParams })
            if (response.data.code === '000000') {
                this.setState({ isFilesLoading: false, files: response.data.data.files })
                // console.log('test', response.data.data.files)
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
        }
        console.log('refreshFileList', new Date() - now)
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

    // 新建文件夹
    handleAddFolder = async ({ filename }) => {
        try {
            const requestData = { directory_path: this.state.currentPath, filename: filename }
            const response = await axios.post('/api/v1/my_space/directory', requestData)
            if (response.data.code === '000000') {
                message.success('添加成功')
                this.setState({ isAddFolderModalVisible: false, shouldLoadFiles: true })
            }
        } catch (err) {
            message.error('添加文件夹失败')
        }
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
            onChange: selectedRowKeys => {
                this.setState({ selectedRowKeys: selectedRowKeys })
            },
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
                        <Button icon={<ReloadOutlined />} onClick={() => this.setState({ shouldLoadFiles: true })}>刷新</Button>
                    </Space>
                )}
            >
                <Table
                    dataSource={this.state.files}
                    rowSelection={rowSelection}
                    selectedRowKeys={this.state.selectedRowKeys}
                    rowKey="filename"
                >
                    <Table.Column
                        title="类型"
                        width={42}
                        dataIndex="mimeType"
                        render={(text, record, index) => {
                            if (record.type === 'DIRECTORY') {
                                return <FolderFilled style={iconStyle} />
                            }
                            return <FileFilled style={iconStyle} />
                        }}
                    />
                    <Table.Column title="文件名" dataIndex="filename" />
                    <Table.Column title="文件大小" dataIndex="fileSize" render={(text, record) =>
                        filesize(record.fileSize)
                    } />
                    <Table.Column title="最近修改时间" dataIndex="updateTime" />
                    <Table.Column
                        title="操作"
                        width={200}
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
                        <Input placeholder="文件名" autoFocus={true} />
                    </Form.Item>
                </ModalForm>
            </ContentCard>
        )
    }
}

export default MySpace