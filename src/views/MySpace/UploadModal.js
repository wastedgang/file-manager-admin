import React, { Component } from 'react'
import { Modal, Row, Col, Upload, Space, Divider } from 'antd'

import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

export default class UploadModal extends Component {

    getPreUploadData = (file) => {
        console.log('getPreUploadData', file)
    }

    beforeUpload = (file) => {
        console.log('beforeUpload', file)
    }

    handleUploaderChange = (fileInfo) => {
        console.log('handleUploaderChange', fileInfo)
    }

    customUpload = (options) => {
        console.log('customUpload', options)
    }

    render() {
        return (
            <Modal
                {...this.props}
                title="上传文件"
                visible={this.props.visible}
                footer={null}
            >
                <Row>
                    <Space>
                        <Upload
                            name="file"
                            multiple={true}
                            directory={true}
                            className="uploader"
                            showUploadList={false}
                            data={this.getPreUploadData}
                            withCredentials={true}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleUploaderChange}
                            customRequest={this.customUpload}
                        >
                            <div>
                                <PlusOutlined />
                                <div className="ant-upload-text">拖拽或点击上传</div>
                            </div>
                        </Upload>
                        <Divider type="vertical" />
                    </Space>
                </Row>
            </Modal>
        )
    }

    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired
    }
}
