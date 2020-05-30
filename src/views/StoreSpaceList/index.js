import React, { Component } from 'react'
import { Button, Form, Input, Table, Space, message, InputNumber, TreeSelect, Spin, Modal, List, Tooltip } from 'antd'
import { FolderAddOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { ContentCard, MessageBox, ModalForm } from '@/components'

import axios from 'axios'
import filesize from 'filesize'

import './store-space.less'

export default class StoreSpaceList extends Component {
    state = {
        isAddStoreSpaceModalVisible: false,

        isViewStoreSpaceFileModalVisible: false,
        isStoreSpaceFilesLoading: false,
        storeSpaceFiles: [],

        selectedStoreSpace: {},
        selectedStoreSpaceIndex: null,
        isUpdateStoreSpaceModalVisible: false,

        storeSpaces: [],

        fileEntries: [],

        isLoading: false,
    }

    // 添加存储空间
    handleAddStoreSpace = async ({ directoryPath, allocateSize, remark }) => {
        try {
            const requestData = {
                directory_path: directoryPath,
                allocate_size: allocateSize * 1024 * 1024 * 1024,
                remark: remark
            }
            const response = await axios.post('/api/v1/store_space', requestData)
            if (response.data.code === '000000') {
                this.refreshStoreSpaceList()
                message.success('添加成功')
                this.setState({ isAddStoreSpaceModalVisible: false })
                return
            }
        } catch (err) {
            message.error('添加失败')
        }
    }

    // 编辑存储空间信息
    handleUpdateStoreSpace = async ({ allocateSize, remark }) => {
        // 更新存储空间信息
        try {
            const requestData = {
                directory_path: this.state.selectedStoreSpace.directoryPath,
                allocate_size: allocateSize * 1024 * 1024 * 1024,
                remark: remark
            }
            const response = await axios.put('/api/v1/store_space', requestData)
            if (response.data.code === '000000') {
                this.refreshStoreSpaceList()
                message.success('修改成功')
                this.setState({ isUpdateStoreSpaceModalVisible: false })
                return
            }
        } catch (err) {
            message.error('修改失败')
        }
    }

    // 查看存储空间里的文件
    handleViewStoreSpaceFiles = async (storeSpaceInfo, index) => {
        this.setState({ isViewStoreSpaceFileModalVisible: true, isStoreSpaceFilesLoading: true })
        try {
            const requestParams = { directory_path: storeSpaceInfo.directoryPath }
            const response = await axios.get('/api/v1/store_space/files', { params: requestParams })
            if (response.data.code === '000000') {
                const storeSpaceFiles = [
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                    ...response.data.data.storeFiles,
                ]
                this.setState({ storeSpaceFiles: storeSpaceFiles, isStoreSpaceFilesLoading: false })
                return
            }
            message.error(response.data.message)
            this.setState({ isStoreSpaceFilesLoading: false })
        } catch (err) {
            message.error('获取存储空间文件列表失败')
            this.setState({ isStoreSpaceFilesLoading: false })
        }
    }

    // 删除存储空间信息
    handleDeleteStoreSpace = async (storeSpaceInfo, index) => {
        try {
            await MessageBox.dangerConfirm({
                content: ['删除后该存储空间的数据将会迁移到其他存储空间，请保证其他存储空间的总剩余空间充足。', '是否确认删除该存储空间？']
            })
        } catch (err) {
            return
        }

        // 删除存储空间
        try {
            const response = await axios.delete('/api/v1/store_space', { params: { directory_path: storeSpaceInfo.directoryPath } })
            if (response.data.code === '000000') {
                message.success('删除成功')
                this.refreshStoreSpaceList()
                return
            }
        } catch (err) {
            message.error('删除失败')
        }
    }

    // 刷新存储空间列表
    refreshStoreSpaceList = async () => {
        try {
            this.setState({ isLoading: true })
            const response = await axios.get('/api/v1/store_spaces')
            this.setState({ isLoading: false })
            if (response.data.code === '000000') {
                this.setState({ storeSpaces: response.data.data.storeSpaces })
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
            this.setState({ isLoading: false })
        }
    }

    // 加载子目录
    handleLoadSubDirectories = async (node) => {
        const filepath = node.id
        try {
            const response = await axios.get('/api/v1/directories', { params: { directory_path: filepath } })
            if (response.data.code === '000000') {
                const directories = response.data.data.directories
                const fileEntries = [
                    ...this.state.fileEntries,
                    ...directories.map(item => ({
                        id: item.filepath,
                        pId: item.parentDirectoryPath,
                        value: item.filepath,
                        title: item.filename,
                        isLeaf: !item.hasSubDirectories
                    }))
                ]
                this.setState({ isAddStoreSpaceModalVisible: true, fileEntries: fileEntries })
                return
            }
            message.error(response.data.message)
        } catch (err) {
            message.error('获取目录列表失败')
        }
        return
    }

    // 打开添加存储空间对话框
    showAddStoreSpaceModal = async () => {
        try {
            const response = await axios.get('/api/v1/directories', { params: { directory_path: '/' } })
            if (response.data.code === '000000') {
                const directories = response.data.data.directories.filter(item => {
                    const filepath = item.filepath
                    // 下面的文件夹为保护目录，不应该用于作存储空间目录
                    if (filepath === '/Applications' || filepath === '/Library' || filepath === '/System' || filepath === '/Volumes') {
                        return false
                    }
                    if (filepath === '/bin' || filepath === '/cores' || filepath === '/dev' || filepath === '/etc') {
                        return false
                    }
                    if (filepath === '/sbin' || filepath === '/tmp' || filepath === '/usr' || filepath === '/boot') {
                        return false
                    }
                    if (filepath === '/lib64' || filepath === '/media' || filepath === '/cdrom' || filepath === '/lib') {
                        return false
                    }
                    if (filepath === '/proc' || filepath === '/run' || filepath === '/snap' || filepath === '/sys') {
                        return false
                    }
                    return true
                })
                const fileEntries = [
                    { id: '/', pId: '', value: '/', title: '/' },
                    ...directories.map(item => ({
                        id: item.filepath,
                        pId: item.parentDirectoryPath,
                        value: item.filepath,
                        title: item.filename,
                        isLeaf: !item.hasSubDirectories
                    }))
                ]
                this.setState({ isAddStoreSpaceModalVisible: true, fileEntries: fileEntries })
                return
            }
            message.error(response.data.message)
        } catch (err) {
            message.error('获取目录列表失败')
            return
        }
    }

    componentDidMount = () => {
        this.refreshStoreSpaceList()
    }

    render() {
        return (

            <ContentCard
                title="存储空间列表"
                description="可查看添加、编辑、删除存储空间"
                extra={<Button icon={<FolderAddOutlined />} onClick={this.showAddStoreSpaceModal}>添加存储空间</Button>}
            >
                <Spin spinning={this.state.isLoading}>
                    <Table dataSource={this.state.storeSpaces} pagination={false} rowKey='directoryPath' size="small">
                        <Table.Column title="目录路径" dataIndex="directoryPath" key="directoryPath" align="center" />
                        <Table.Column title="分配空间大小" dataIndex="allocateSize" key="allocateSize" align="center" render={(text, record) => filesize(record.allocateSize)} />
                        <Table.Column title="文件数量" dataIndex="totalFileCount" key="totalFileCount" align="center" />
                        <Table.Column title="剩余空间大小" dataIndex="totalFreeSpace" key="totalFreeSpace" align="center" render={(text, record) => filesize(record.totalFreeSpace)} />
                        <Table.Column title="备注" dataIndex="remark" key="remark" align="center" />
                        <Table.Column title="创建时间" dataIndex="createTime" key="createTime" align="center" />
                        <Table.Column
                            title="操作"
                            key="action"
                            align="center"
                            render={(text, record, index) => (
                                <Space size="middle">
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => this.handleViewStoreSpaceFiles(record)}
                                    >
                                        <UnorderedListOutlined />查看
                                    </Button>
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => this.setState({ isUpdateStoreSpaceModalVisible: true, selectedStoreSpace: record, selectedStoreSpaceIndex: index })}
                                    >
                                        <EditOutlined />编辑
                                    </Button>
                                    <Button size="small" danger onClick={() => this.handleDeleteStoreSpace(record, index)}><DeleteOutlined />删除</Button>
                                </Space>
                            )}
                        />
                    </Table>
                </Spin>

                {/* {添加存储空间对话框} */}
                <ModalForm
                    title="添加存储空间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    visible={this.state.isAddStoreSpaceModalVisible}
                    onCancel={() => this.setState({ isAddStoreSpaceModalVisible: false })}
                    onFinish={this.handleAddStoreSpace}
                    initialValues={{ directoryPath: '', allocateSize: 1, remark: '' }}
                >
                    <Form.Item
                        name="directoryPath"
                        label="目录路径"
                        rules={[
                            { required: true, message: '请选择目录路径' },
                            { pattern: /^\/.*$/, message: '请选择正确的目录路径(必须为绝对路径)' }
                        ]}
                    >
                        <TreeSelect
                            treeDataSimpleMode
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 700, overflow: 'auto' }}
                            placeholder="目录路径"
                            treeDefaultExpandedKeys={["/"]}
                            loadData={this.handleLoadSubDirectories}
                            treeData={this.state.fileEntries}
                        />
                    </Form.Item>
                    <Form.Item
                        name="allocateSize"
                        label="分配空间大小(GB)"
                        rules={[
                            { required: true, message: '请输入分配空间大小' },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            placeholder="分配空间大小"
                            style={{ width: 150 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="备注" />
                    </Form.Item>
                </ModalForm>

                {/* {编辑存储空间对话框} */}
                <ModalForm
                    title="编辑存储空间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    visible={this.state.isUpdateStoreSpaceModalVisible}
                    onCancel={() => this.setState({ isUpdateStoreSpaceModalVisible: false })}
                    onFinish={this.handleUpdateStoreSpace}
                    initialValues={{...this.state.selectedStoreSpace, allocateSize: parseInt(this.state.selectedStoreSpace.allocateSize / 1073741824)}}
                >
                    <Form.Item
                        name="directoryPath"
                        label="目录路径"
                        rules={[
                            { required: true, message: '请输入目录路径' },
                            { pattern: /^\/.*$/, message: '请输入正确的目录路径(必须为绝对路径)' }
                        ]}
                    >
                        <Input placeholder="目录路径" disabled={true} />
                    </Form.Item>
                    <Form.Item
                        name="allocateSize"
                        label="分配空间大小(GB)"
                        rules={[
                            { required: true, message: '请输入分配空间大小' },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={20480}
                            placeholder="分配空间大小"
                            style={{ width: 150 }}
                            autoFocus={true}
                        />
                    </Form.Item>
                    <Form.Item
                        name="remark"
                        label="备注"
                    >
                        <Input.TextArea placeholder="备注" />
                    </Form.Item>
                </ModalForm>

                {/* {查看存储空间文件列表对话框} */}
                <Modal
                    title="存储空间文件列表"
                    footer={null}
                    visible={this.state.isViewStoreSpaceFileModalVisible}
                    onCancel={() => this.setState({ isViewStoreSpaceFileModalVisible: false })}
                    bodyStyle={{ paddingTop: 0 }}
                    width={700}
                    style={{ top: 56 }}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.storeSpaceFiles}
                        className="store-file-list"
                        pagination={{
                            position: 'bottom', hideOnSinglePage: false, pageSize: 10,
                            showSizeChanger: false, total: this.state.storeSpaceFiles.length,
                            showTotal: (total) => `总${total}个文件`
                        }}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={(
                                        <Tooltip title={item.storeFilename}>
                                            <div className="store-file-title">{item.storeFilename}</div>
                                        </Tooltip>
                                    )}
                                    description={(
                                        <div className="store-file-description">
                                            <Tooltip title="文件大小" placement="left">
                                                <div>{filesize(item.fileSize)}</div>
                                            </Tooltip>
                                            <Tooltip title="内容哈希值" placement="right">
                                                <div>{item.contentHash}</div>
                                            </Tooltip>
                                            <Tooltip title="上传时间" placement="right">
                                                <div>{item.createTime}</div>
                                            </Tooltip>
                                        </div>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                </Modal>
            </ContentCard>
        )
    }
}
