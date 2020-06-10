import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Space, Tooltip, Dropdown, Menu, message, Form, Input, TreeSelect, Modal, List, Checkbox} from 'antd'
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
    ReloadOutlined,
    SwapOutlined,
    EditOutlined,
    RedoOutlined
} from '@ant-design/icons'

import { MessageBox, ModalForm, Table, TableCard } from '@/components'

import ExplorerBreadcrumb from './ExplorerBreadcrumb'
import queryString from 'query-string'
import filesize from 'filesize'
import axios from 'axios'
import iconRename from '@/assets/icon-rename.png'
import iconReplace from '@/assets/icon-replace.png'
import iconNext from '@/assets/icon-next.png'

import './my-space.less'

@withRouter
class MySpace extends Component {
    state = {
        currentPath: '',
        sort: null,

        shouldLoadFiles: false,
        files: [],
        isFilesLoading: false,
        shouldPromptLoaded: false,

        selectedRowKeys: [],

        isAddFolderModalVisible: false,

        isRenameFileModalVisible: false,

        directories: [],
        selectedDirectoryPath: '',

        selectedFilenames: [],

        isCopyFileModalVisible: false,

        isMoveFileModalVisible: false,

        actionModalTitle: '',
        isActionModalVisible: false,
        actionModalPromiseResolve: null,
        shouldPerformSameAction: false,
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
        if (!this.state.shouldLoadFiles || this.state.isFilesLoading) {
            return
        }
        this.setState({ shouldLoadFiles: false, isFilesLoading: true })
        let { path, sort } = queryString.parse(this.props.location.search)
        path = path ? path : '/'
        sort = sort ? sort : null

        const requestParams = { directory_path: path }
        if (sort) {
            requestParams.sort = sort
        }
        try {
            const response = await axios.get('/api/v1/my_space/files', { params: requestParams })
            if (response.data.code === '000000') {
                if (this.state.shouldPromptLoaded) {
                    message.success('刷新成功')
                }
                this.setState({ isFilesLoading: false, files: response.data.data.files, shouldPromptLoaded: false })
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
        }
    }

    // 批量删除文件
    handleDeleteFiles = async (selectedFileList) => {
        try {
            await MessageBox.dangerConfirm({ content: '是否确定删除文件？' })
        } catch (err) {
            return
        }
        // 删除文件
        try {
            const requestData = {
                directory_path: this.state.currentPath,
                filenames: JSON.stringify(selectedFileList)
            }
            const response = await axios.post('/api/v1/my_space/file/delete', requestData)
            if (response.data.code !== '000000') {
                return
            }

            const selectedKeyMap = {}
            for (let key of selectedFileList) {
                selectedKeyMap[key] = true
            }
            this.setState({
                shouldLoadFiles: true,
                selectedRowKeys: this.state.selectedRowKeys.filter(key => !selectedKeyMap[key])
            })
            message.success('删除成功')
        } catch (err) {
            message.error('删除失败')
        }
    }

    // TODO: 批量下载文件
    handleDownloadFiles = (selectedFileList) => {
        console.log('handleDownloadFiles', selectedFileList)
    }

    // TODO: 批量分享文件
    handleShareFiles = (selectedFileList) => {
        console.log('handleShareFiles', selectedFileList)
    }

    // 刷新文件夹列表
    refreshDirectoryList = async () => {
        try {
            const response = await axios.get('/api/v1/my_space/directories')
            if (response.data.code !== '000000') {
                return
            }
            this.setState({ directories: response.data.data.directories, selectedDirectoryPath: '' })
        } catch (err) {
            message.error('网络错误')
        }
    }

    // 使用操作询问对话框
    showActionModal = (title) => {
        return new Promise((resolve, reject) => {
            this.setState({ actionModalTitle: title, isActionModalVisible: true, actionModalPromiseResolve: resolve })
        })
    }
    // 返回操作询问结果
    hideActionModal = (action) => {
        const promiseResolve = this.state.actionModalPromiseResolve
        this.setState({ actionModalTitle: '', isActionModalVisible: false, actionModalPromiseResolve: null })
        if (promiseResolve) {
            promiseResolve(action)
        }
    }

    // 打开复制文件对话框
    showCopyFileModal = (selectedFileList) => {
        this.setState({
            selectedDirectoryPath: '', isCopyFileModalVisible: true, directories: [],
            selectedFilenames: selectedFileList, shouldPerformSameAction: false
        })
        this.refreshDirectoryList()
    }
    // TODO: 批量复制文件
    handleCopyFiles = async () => {
        const sourceDirectoryPath = this.state.currentPath
        const targetDirectoryPath = this.state.selectedDirectoryPath
        const selectedFilenames = this.state.selectedFilenames
        if (!targetDirectoryPath) {
            message.warning('请选择目标文件夹')
            return
        }
        if (!targetDirectoryPath && !(/^\/.*[^/]$/.test(targetDirectoryPath))) {
            message.warning('请选择正确的目标文件夹')
            return
        }

        const targetDirectoryFileMap = {}
        if (targetDirectoryPath !== sourceDirectoryPath) {
            try {
                const response = await axios.get('/api/v1/my_space/files', { params: { directory_path: targetDirectoryPath } })
                if (response.data.code !== '000000') {
                    return
                }
                for (let fileInfo of response.data.data.files) {
                    targetDirectoryFileMap[fileInfo.filename] = fileInfo
                }
            } catch (err) {
                message.error('网络错误')
                return
            }
        }
        console.log(targetDirectoryFileMap)

        let sameActionType = null
        for (let index = 0; index < selectedFilenames.length; index++) {
            const filename = selectedFilenames[index]
            // 计算需要询问的文件数量
            let remainPromptCount = 0
            for (let i = index; i < selectedFilenames.length; i++) {
                if (targetDirectoryFileMap[selectedFilenames[i]]) {
                    remainPromptCount++
                }
            }

            if (sameActionType === null && remainPromptCount > 0) {
                // 需要询问
                const action = await this.showActionModal('复制文件')
                console.log(action)
            }
        }
        return
        try {
            const requestData = {
                source_directory_path: sourceDirectoryPath,
                filenames: JSON.stringify(selectedFilenames),
                target_directory_path: targetDirectoryPath,
            }
            // const response = await axios.post('/api/v1/my_space/file/copy', requestData)
            // if (response.data.code !== '000000') {
            //     return
            // }
            // this.setState({ shouldLoadFiles: true, isCopyFileModalVisible: false })
            // message.success('复制成功')
        } catch (err) {
            message.error('复制文件')
        }
        console.log('handleCopyFiles', selectedFilenames)
    }

    // 打开移动文件对话框
    showMoveFileModal = async (selectedFileList) => {
        this.setState({
            selectedDirectoryPath: '', isMoveFileModalVisible: true, directories: [],
            selectedFilenames: selectedFileList, shouldPerformSameAction: false
        })
        this.refreshDirectoryList()
    }
    // TODO: 批量移动文件
    handleMoveFiles = async () => {
        if (!this.state.selectedDirectoryPath) {
            message.warning('请选择目标文件夹')
            return
        }
        if (!this.state.selectedDirectoryPath && !(/^\/.*[^/]$/.test(this.state.selectedDirectoryPath))) {
            message.warning('请选择正确的目标文件夹')
            return
        }
        try {
            const requestData = {
                source_directory_path: this.state.currentPath,
                filenames: JSON.stringify(this.state.selectedFilenames),
                target_directory_path: this.state.selectedDirectoryPath,
            }
            const response = await axios.post('/api/v1/my_space/file/move', requestData)
            if (response.data.code !== '000000') {
                return
            }
            this.setState({ shouldLoadFiles: true, isMoveFileModalVisible: false })
            message.success('移动成功')
        } catch (err) {
            message.error('移动文件')
        }
        console.log('handleMoveFiles', this.state.selectedFilenames)
    }

    // 重命名文件
    handleRenameFile = async ({ newFilename }) => {
        try {
            const selectedFile = this.state.selectedFileList[0]
            const requestData = {
                directory_path: selectedFile.directoryPath,
                old_filename: selectedFile.filename,
                new_filename: newFilename,
            }
            const response = await axios.post('/api/v1/my_space/file/rename', requestData)
            if (response.data.code !== '000000') {
                return
            }
            this.setState({
                shouldLoadFiles: true,
                isRenameFileModalVisible: false,
                selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== newFilename)
            })
            message.success('重命名成功')
        } catch (err) {
            message.error('重命名失败')
        }
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
            { icon: <CopyOutlined />, onClick: () => this.showCopyFileModal(this.state.selectedRowKeys), title: '复制' },
            { icon: <ScissorOutlined />, onClick: () => this.showMoveFileModal(this.state.selectedRowKeys), title: '移动' },
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

        const treeData = this.state.directories.map(item => {
            return { id: item.filepath, pId: item.parentDirectoryPath, value: item.filepath, title: item.filename }
        })
        return (
            <>
                <TableCard
                    title="我的空间"
                    description={breadcrumb}
                    extra={(
                        <Space>
                            <Dropdown overlay={batchActionMenu} disabled={this.state.selectedRowKeys.length === 0}>
                                <Button icon={<MoreOutlined />}>批量操作</Button>
                            </Dropdown>
                            <Button icon={<FolderAddOutlined />} onClick={() => this.setState({ isAddFolderModalVisible: true })}>新建文件夹</Button>
                            <Button icon={<ReloadOutlined />} onClick={() => this.setState({ shouldLoadFiles: true, shouldPromptLoaded: true })}>刷新</Button>
                        </Space>
                    )}

                    loading={this.state.isFilesLoading}

                    dataSource={this.state.files}
                    rowSelection={rowSelection}
                    rowKey="filename"
                >
                    <Table.Column
                        title="类型"
                        width={70}
                        dataIndex="mimeType"
                        render={(text, record, index) => {
                            if (record.type === 'DIRECTORY') {
                                return <FolderFilled style={iconStyle} />
                            }
                            return <FileFilled style={iconStyle} />
                        }}
                    />
                    <Table.Column title="文件名" dataIndex="filename" showOverflowTooltip={true} width={360} />
                    <Table.Column title="文件大小" dataIndex="fileSize" width={150} render={(text, record) =>
                        filesize(record.fileSize)
                    } />
                    <Table.Column title="最近修改时间" dataIndex="updateTime" />
                    <Table.Column
                        title="操作"
                        width={280}
                        className="table-operation"
                        render={(text, record, index) => {
                            const moreActionMenu = (
                                <Menu>
                                    <Menu.Item
                                        key="1"
                                        icon={<FormOutlined />}
                                        onClick={() => this.setState({ isRenameFileModalVisible: true, selectedFileList: [record] })}
                                    >
                                        重命名
                                    </Menu.Item>
                                    <Menu.Item key="2" icon={<CopyOutlined />} onClick={() => this.showCopyFileModal([record.filename])}>复制</Menu.Item>
                                    <Menu.Item key="3" icon={<ScissorOutlined />} onClick={() => this.showMoveFileModal([record.filename])}>移动</Menu.Item>
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
                </TableCard>

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

                {/* 重命名对话框 */}
                <ModalForm
                    title="文件重命名"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 17 }}
                    visible={this.state.isRenameFileModalVisible}
                    onCancel={() => this.setState({ isRenameFileModalVisible: false })}
                    onFinish={this.handleRenameFile}
                    initialValues={{ newFilename: '' }}
                >
                    <Form.Item
                        name="newFilename"
                        label="新文件名"
                        rules={[
                            { required: true, message: '请输入新文件名' },
                            { pattern: /^[^/:]+$/, message: '请输入正确的新文件名' }
                        ]}
                    >
                        <Input placeholder="新文件名" autoFocus={true} />
                    </Form.Item>
                </ModalForm>

                {/* 复制对话框 */}
                <Modal
                    title="复制文件"
                    visible={this.state.isCopyFileModalVisible || true}
                    onCancel={() => this.setState({ isCopyFileModalVisible: false })}
                    onOk={this.handleCopyFiles}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <div style={{ width: '24%' }}>请选择目标文件夹:</div>
                        <TreeSelect
                            name="newDirectoryPath"
                            showSearch
                            disabled={this.state.directories.length === 0 }
                            style={{ width: '76%'}}
                            value={this.state.selectedDirectoryPath}
                            treeDefaultExpandAll={true}
                            dropdownStyle={{ maxHeight: 700, overflow: 'auto' }}
                            placeholder="请选择目标文件夹"
                            treeDataSimpleMode
                            onChange={(value) => this.setState({ selectedDirectoryPath: value })}
                            treeData={treeData}
                        />
                    </div>
                </Modal>

                {/* 移动对话框 */}
                <Modal
                    title="移动文件"
                    visible={this.state.isMoveFileModalVisible}
                    onCancel={() => this.setState({ isMoveFileModalVisible: false })}
                    onOk={this.handleMoveFiles}
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <div style={{ width: '24%' }}>请选择目标文件夹:</div>
                        <TreeSelect
                            name="newDirectoryPath"
                            showSearch
                            disabled={this.state.directories.length === 0}
                            style={{ width: '76%' }}
                            value={this.state.selectedDirectoryPath}
                            treeDefaultExpandAll={true}
                            dropdownStyle={{ maxHeight: 700, overflow: 'auto' }}
                            placeholder="请选择目标文件夹"
                            treeDataSimpleMode
                            onChange={(value) => this.setState({ selectedDirectoryPath: value })}
                            treeData={treeData}
                        />
                    </div>
                </Modal>

                {/* 询问操作对话框  */}
                <Modal
                    title={this.state.actionModalTitle}
                    visible={this.state.isActionModalVisible}
                    footer={null}
                    onCancel={() => this.hideActionModal({ type: 'cancel' })}
                    width= "400px"
                >
                    <div>
                        <h4>此位置已经包含同名文件。</h4>
                        <p>请选择要执行的操作</p>
                    </div>
                    <div className="list-wrapper">
                        <div className="list-item" onClick={() => this.hideActionModal({ type: 'override' })}>
                            <div className="image-wrapper"><img src={iconReplace}></img></div>
                            <div className="content-wrapper">
                                <div style={{fontWeight: 'border',color: "#000",letterSpacing:'2px'}}>覆盖</div>
                                <div style={{color:"#999"}}>此操作将删除目标文件夹同名文件，并复制该文件到目标文件夹</div>
                            </div>
                        </div>
                        <div className="list-item" onClick={() => this.hideActionModal({ type: 'rename' })}>
                            <div className="image-wrapper"><img src={iconRename}></img></div>
                            <div className="content-wrapper">
                                <div style={{fontWeight: 'border',color: "#000",letterSpacing:'2px'}}>重命名</div>
                                <div style={{color:"#999"}}>此操作将自动重命名该文件，并复制文件到目标文件夹</div>
                            </div>
                        </div>
                        <div className="list-item" onClick={() => this.hideActionModal({ type: 'skip' })}>
                            <div className="image-wrapper"><img src={iconNext}></img></div>
                            <div className="content-wrapper">
                                <div style={{fontWeight: 'border',color: "#000",letterSpacing:'2px'}}>跳过</div>
                                <div style={{color:"#999"}}>此操作将取消对该文件的复制，并开始执行下一个文件</div>
                            </div>
                        </div>
                    </div>
                    <div class="footer-btn">
                        <div><Checkbox>对以后的文件进行此操作</Checkbox></div>
                        <div>
                            <Button size="small" style={{marginRight:"10px"}}>跳过</Button>
                            <Button size="small">取消</Button>
                        </div>
                    </div>
                    {/* <List
                        itemLayout="horizontal"
                        dataSource={["override", "rename", "skip"]}
                        renderItem={item => {
                            let actions = null
                            let title = null
                            let description = null
                            if (item === 'override') {
                                actions = [(
                                    <Button
                                        size="small"
                                        icon={<SwapOutlined />}
                                        danger
                                        onClick={() => this.hideActionModal({ type: item })}
                                    >
                                        执行
                                    </Button>
                                )]
                                title = "覆盖"
                            } else if (item === 'rename') {
                                actions = [(
                                    <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => this.hideActionModal({ type: item })}
                                    >
                                        执行
                                    </Button>
                                )]
                                title = "重命名"
                            } else {
                                actions = [(
                                    <Button
                                        size="small"
                                        icon={<RedoOutlined />}
                                        onClick={() => this.hideActionModal({ type: item })}
                                    >
                                        执行
                                    </Button>
                                )]
                                title = "跳过"
                            }
                            return (
                                <List.Item
                                    actions={actions}
                                >
                                    <List.Item.Meta
                                        title={title}
                                    />
                                </List.Item>
                            )
                        }}
                    /> */}
                </Modal>
            </>
        )
    }
}

export default MySpace