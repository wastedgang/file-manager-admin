import React, { Component } from 'react'
import { Button, Form, Input, Table, Space, message, InputNumber } from 'antd'
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ContentCard, MessageBox, ModalForm } from '@/components'

import axios from 'axios'
import filesize from 'filesize'

export default class StoreSpaceList extends Component {
    state = {
        isAddStoreSpaceModalVisible: false,
        isViewStoreSpaceFileModalVisible: false,

        selectedStoreSpace: {},
        selectedStoreSpaceIndex: null,
        isUpdateStoreSpaceModalVisible: false,

        storeSpaces: [],
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
    handleUpdateStoreSpace = async ({ nickname, remark }) => {
        // 更新存储空间信息
        try {
            const requestData = { nickname: nickname, remark: remark }
            const response = await axios.put('/api/v1/user/' + this.state.selectedUser.username + '/info', requestData)
            if (response.data.code === '000000') {
                this.refreshUserList()
                message.success('修改成功')
                this.setState({ isUpdateUserModalVisible: false })
                return
            }
        } catch (err) {
            message.error('修改失败')
        }
    }

    // TODO: 查看存储空间里的文件
    handleViewStoreSpaceFiles = (storeSpaceInfo, index) => {
        this.setState({ isViewStoreSpaceFileModalVisible: true, selectedStoreSpace: storeSpaceInfo, selectedStoreSpaceIndex: index })
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
            const response = await axios.get('/api/v1/store_spaces', { search_word: '123' })
            if (response.data.code === '000000') {
                this.setState({ storeSpaces: response.data.data.storeSpaces })
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
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
                extra={<Button icon={<FolderAddOutlined />} onClick={() => this.setState({ isAddStoreSpaceModalVisible: true })}>添加存储空间</Button>}
            >
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
                                    onClick={() => this.setState({ isUpdateStoreSpaceModalVisible: true, selectedStoreSpace: record, selectedStoreSpaceIndex: index })}
                                >
                                    <EditOutlined />编辑
                                </Button>
                                <Button size="small" danger onClick={() => this.handleDeleteStoreSpace(record, index)}><DeleteOutlined />删除</Button>
                            </Space>
                        )}
                    />
                </Table>

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
                            { required: true, message: '请输入目录路径' },
                            { pattern: /^\/.*$/, message: '请输入正确的目录路径(必须为绝对路径)' }
                        ]}
                    >
                        <Input placeholder="目录路径" autoFocus={true} />
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
                    initialValues={this.state.selectedStoreSpace}
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
            </ContentCard>
        )
    }
}
