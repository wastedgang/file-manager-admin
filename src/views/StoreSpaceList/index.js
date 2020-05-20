import React, { Component } from 'react'
import { Button, Form, Input, Table, Space } from 'antd'
import { FolderAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ContentCard, MessageBox, ModalForm } from '@/components'

import filesize from 'filesize'

const mockStoreSpaceList = [{
    id: 1,
    directoryPath: '/Users/farseer810',
    fileAmount: 12,
    fileTotalSize: 1000000,
    createTime: '2020-05-20 05:51:00'
}]


export default class StoreSpaceList extends Component {
    state = {
        isAddStoreSpaceModalVisible: false,
        isViewStoreSpaceFileModalVisible: false,
        selectedStoreSpace: {},
        selectedStoreSpaceIndex: null,
    }

    handleAddStoreSpace = ({ directoryPath }) => {
        // TODO: 添加存储空间
        this.setState({ isAddStoreSpaceModalVisible: false })
    }

    // TODO: 查看存储空间里的文件
    handleViewStoreSpaceFiles = (record, index) => {
        this.setState({ isViewStoreSpaceFileModalVisible: true, selectedStoreSpace: record, selectedStoreSpaceIndex: index })
    }

    // 删除存储空间信息
    handleDeleteStoreSpace = async (userInfo, index) => {
        try {
            await MessageBox.dangerConfirm({
                content: ['删除后该存储空间的数据将会迁移到其他存储空间，请保证其他存储空间的总剩余空间充足。', '是否确认删除该存储空间？']
            })
        } catch (err) {
            return
        }
        // TODO: 删除存储空间
    }

    render() {
        return (
            <ContentCard
                title="存储空间列表"
                description="可查看添加、编辑、删除存储空间"
                extra={<Button icon={<FolderAddOutlined />} onClick={() => this.setState({ isAddStoreSpaceModalVisible: true })}>添加存储空间</Button>}
            >
                <Table dataSource={mockStoreSpaceList} pagination={false} rowKey='id' size="small">
                    <Table.Column title="目录路径" dataIndex="directoryPath" key="directoryPath" align="center" />
                    <Table.Column title="文件数量" dataIndex="fileAmount" key="fileAmount" align="center" />
                    <Table.Column title="文件总大小" dataIndex="fileTotalSize" key="fileTotalSize" align="center" render={(text, record) => filesize(record.fileTotalSize)} />
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
                                    onClick={() => this.handleViewStoreSpaceFiles(record, index)}
                                >
                                    <EditOutlined />查看文件
                                </Button>
                                <Button size="small" danger onClick={() => this.handleDeleteStoreSpace(record, index)}><DeleteOutlined />删除</Button>
                            </Space>
                        )}
                    />
                </Table>

                {/* {添加存储空间对话框} */}
                <ModalForm
                    title="添加存储空间"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 19 }}
                    visible={this.state.isAddStoreSpaceModalVisible}
                    onCancel={() => this.setState({ isAddStoreSpaceModalVisible: false })}
                    onFinish={this.handleAddStoreSpace}
                    initialValues={{ directoryPath: '' }}
                >
                    <Form.Item
                        name="directoryPath"
                        label="目录路径"
                        rules={[
                            { required: true, message: '请输入目录路径' },
                            { pattern: /^\/.*$/, message: '请输入正确的目录路径(必须为绝对路径)' }
                        ]}
                    >
                        <Input placeholder="目录路径" ref={input => { input && input.focus() }} />
                    </Form.Item>
                </ModalForm>
            </ContentCard>
        )
    }
}
