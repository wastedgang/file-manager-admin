import React, { Component } from 'react'
import { List, Progress, Button, Spin, Tooltip } from 'antd'
import { CloseOutlined, DeleteOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { removeUploadTask, cancelUploadTask, restartUploadTask } from '@/actions/uploads'

import './upload.less'

const mapState = state => ({
    uploadTaskList: state.uploads.uploadTaskList
})

@connect(mapState, { removeUploadTask, cancelUploadTask, restartUploadTask })
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
                            <Button size="small" disabled={item.uploadProgress === 100} shape="circle" icon={<CloseOutlined />} danger onClick={() => this.props.cancelUploadTask(item.id)} />
                        )]
                    } else if (item.status === 'CANCELED') {
                        actions = [(
                            <Button size="small" shape="circle" icon={<RedoOutlined />} onClick={() => { this.props.restartUploadTask(item.id) }} />
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
                    } else if (item.status === 'UPLOADED') {
                        progressBar = <Progress percent={item.uploadProgress} />
                    } else if (item.status === 'CANCELED') {
                        progressBar = <Progress percent={item.uploadProgress} status="exception" />
                    } else {
                        progressBar = <Progress percent={item.uploadProgress} status="active" />
                    }
                    return (
                        <List.Item
                            actions={actions}
                        >
                            <List.Item.Meta
                                title={(
                                    <Tooltip placement="left" title={item.filename}>
                                        {item.filename.length > 30 ? item.filename.substr(0, 30) + '...' : item.filename}
                                    </Tooltip>
                                )}
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
