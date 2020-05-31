import React, { Component } from 'react'
import { List, Progress, Button, Tooltip } from 'antd'
import { DeleteOutlined, RedoOutlined, PauseOutlined, ClearOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { removeUploadTask, cancelUploadTask, startUploadTask, removeUploadedTasks } from '@/actions/uploads'

import './upload.less'

const mapState = state => ({
    uploadTaskList: state.uploads.uploadTaskList
})

@connect(mapState, { removeUploadTask, cancelUploadTask, startUploadTask, removeUploadedTasks })
class UploadTaskList extends Component {
    onRestartUploadTask = (id) => {
        const uploadTaskList = this.props.uploadTaskList.filter(item => item.id === id)
        if (uploadTaskList.length === 0) {
            return
        }
        const uploadTaskInfo = uploadTaskList[0]
        this.props.startUploadTask(uploadTaskInfo.uploadDirectoryPath, uploadTaskInfo.file, true)
    }

    render() {
        const listHeader = (
            <div className="upload-task-list-header">
                {/* <Button icon={<PauseOutlined />}>暂停所有任务</Button> */}
                <Button 
                    icon={<ClearOutlined />} 
                    style={{ marginLeft: 12 }} 
                    onClick={this.props.removeUploadedTasks}
                    disabled={this.props.uploadTaskList.filter(item => item.status === 'UPLOADED').length === 0}>清除已完成</Button>
            </div>
        )
        return (
            <List
                itemLayout="horizontal"
                className="upload-task-list"
                header={listHeader}
                dataSource={this.props.uploadTaskList}
                pagination={{ pageSize: 10, showSizeChanger: false, size: 'small' }}
                renderItem={item => {
                    let actions = null
                    if (item.status === 'UPLOADING') {
                        actions = [(
                            <Button size="small" disabled={item.progress === 100} shape="circle" icon={<PauseOutlined />} danger
                                onClick={() => this.props.cancelUploadTask(item.id)} />
                        )]
                    } else if (item.status === 'CANCELED') {
                        actions = [(
                            <Button size="small" shape="circle" icon={<DeleteOutlined />} danger onClick={() => this.props.removeUploadTask(item.id)} />
                        ), (
                            <Button size="small" shape="circle" icon={<RedoOutlined />} onClick={() => { this.onRestartUploadTask(item.id) }} />
                        )]
                    } else {
                        actions = [(
                            <Button size="small" shape="circle" icon={<DeleteOutlined />} danger onClick={() => this.props.removeUploadTask(item.id)} />
                        )]
                    }

                    let progressBar = null
                    if (item.status === 'UPLOADED') {
                        progressBar = <Progress percent={item.progress} />
                    } else if (item.status === 'CANCELED') {
                        progressBar = <Progress percent={item.progress} status="exception" />
                    } else {
                        progressBar = <Progress percent={item.progress} status="active" />
                    }
                    return (
                        <List.Item
                            actions={actions}
                        >
                            <List.Item.Meta
                                title={(
                                    <Tooltip placement="left" title={item.filename}>
                                        <div
                                            style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 244}}>
                                            {item.filename}
                                        </div>
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
