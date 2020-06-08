import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Divider, Popover, Modal, Upload, TreeSelect, message, Badge } from 'antd'
import { UnorderedListOutlined, UploadOutlined } from '@ant-design/icons'
import { startUploadTask } from '@/actions/uploads'
import axios from 'axios'

import './upload-control.less'
import UploadTaskList from './UploadTaskList'

const mapState = state => ({
    uploadingCount: state.uploads.uploadingCount
})
@connect(mapState, { startUploadTask })
class UploadControl extends Component {
    state = {
        isUploadModalVisible: false,

        selectedDirectoryPath: "",

        directories: [],
    }

    showUploadModal = async () => {
        try {
            const response = await axios.get('/api/v1/my_space/directories')
            if (response.data.code !== '000000') {
                message.error(response.data.message)
                return
            }
            this.setState({ isUploadModalVisible: true, directories: response.data.data.directories, selectedDirectoryPath: '' })
        } catch (err) {
            message.error('网络错误')
        }
    }

    handleSelectDirectoryChange = (value) => {
        this.setState({ selectedDirectoryPath: value })
    }

    handleBeforeUpload = (file) => {
        if (!this.state.selectedDirectoryPath.startsWith('/')) {
            message.warn('请先选择上传目录')
            return false
        }
        this.props.startUploadTask(this.state.selectedDirectoryPath, file)
        return false
    }

    render() {
        const treeData = this.state.directories.map(item => {
            return { id: item.filepath, pId: item.parentDirectoryPath, value: item.filepath, title: item.filename }
        })
        return (
            <Fragment>
                <div onClick={this.showUploadModal}>
                    <UploadOutlined /><span style={{cursor:'pointer'}}>&nbsp;&nbsp;上传文件</span>
                </div>

                <Modal
                    title="文件上传"
                    visible={this.state.isUploadModalVisible}
                    onCancel={(event) => {
                        event.stopPropagation()
                        this.setState({ isUploadModalVisible: false })
                    }}
                    bodyStyle={{ padding: 0 }}
                    footer={null}
                >
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',boxSizing:"border-box",padding:'0 15px',margin:'10px 0'}}>
                        <div style={{width:'20%'}}>选择目标目录:</div>
                        <TreeSelect
                            showSearch
                            style={{ width: '80%', margin: "6px 0 12px 0" }}
                            value={this.state.selectedDirectoryPath}
                            treeDefaultExpandAll={true}
                            dropdownStyle={{ maxHeight: 700, overflow: 'auto' }}
                            placeholder="请选择保存目录"
                            treeDataSimpleMode
                            onChange={this.handleSelectDirectoryChange}
                            treeData={treeData}
                        />
                    </div>
                    <Upload.Dragger
                        name="file"
                        multiple={true}
                        disabled={!this.state.selectedDirectoryPath}
                        showUploadList={false}
                        withCredentials={true}
                        beforeUpload={this.handleBeforeUpload}
                        className="uploader"
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽文件到这里</p>
                        <p className="ant-upload-hint">支持同时添加多个上传文件</p>
                    </Upload.Dragger>
                </Modal>
                <div>
                    <Divider type="vertical" />
                </div>

                <div>
                    <Popover content={<UploadTaskList />} placement="bottomRight" trigger="click">
                        <Badge count={this.props.uploadingCount} offset={[15, 0]} style={{zIndex: 1}}>
                            <UnorderedListOutlined /><span style={{cursor:'pointer'}}>&nbsp;&nbsp;上传记录</span>
                        </Badge>
                    </Popover>
                </div>
            </Fragment>

        )
    }
}

export default UploadControl