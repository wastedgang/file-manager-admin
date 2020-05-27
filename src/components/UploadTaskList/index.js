import React, { Component } from 'react'
import { List, Progress, Button, Spin } from 'antd'
import { CloseOutlined, DeleteOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { removeUploadTask, cancelUploadTask } from '@/actions/uploads'

import './upload.less'

const mapState = state => ({
    uploadTaskList: state.uploads.uploadTaskList
})

@connect(mapState, { removeUploadTask, cancelUploadTask })
class UploadTaskList extends Component {
    render() {
        return (
            <List
                itemLayout="horizontal"
                className="upload-task-list"
                dataSource={this.props.uploadTaskList}
                renderItem={item => {
                    let actions = null
                    if (item.status === 'STARTING') {
                        actions = [(
                            <Spin indicator={<LoadingOutlined />} />
                        )]
                    } else if (item.status === 'UPLOADING') {
                        actions = [(
                            <Button size="small" shape="circle" icon={<CloseOutlined />} danger onClick={() => this.props.cancelUploadTask(item.id)} />
                        )]
                    } else if (item.status === 'CANCELED') {
                        actions = [(
                            <Button size="small" shape="circle" icon={<RedoOutlined />} />
                        ), (
                            <Button size="small" shape="circle" icon={<DeleteOutlined />} danger onClick={() => this.props.removeUploadTask(item.id)} />
                        )]
                    } else {
                        actions = [(
                            <Button size="small" shape="circle" icon={<DeleteOutlined />} danger onClick={() => this.props.removeUploadTask(item.id)} />
                        )]
                    }

                    let progressBar = null
                    if (item.status === 'STARTING') {
                        progressBar = <Progress percent={item.hashCalculateProgress} status="active" strokeColor="#faad14" />
                    } else {
                        progressBar = <Progress percent={item.uploadProgress} status="active" />
                    }
                    return (
                        <List.Item
                            actions={actions}
                        >
                            <List.Item.Meta
                                title={item.filename}
                                description={progressBar}
                            />
                        </List.Item>
                    )
                }}
            >
            </List>
        )
    }
}

export default UploadTaskList
