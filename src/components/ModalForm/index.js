import React, { Component } from 'react'
import { Modal, Form } from 'antd'
import PropTypes from 'prop-types'

class ModalForm extends Component {
    formRef = React.createRef()

    onSubmitForm = (values) => {
        this.props.onFinish(values, this.props.extra ? this.props.extra : null)
    }

    render() {
        // 计算Modal组件的props
        const modalPropTypes = {}
        for (let key in this.props) {
            if (key in ModalForm.modalPropTypes) {
                modalPropTypes[key] = this.props[key]
            }
        }

        // 计算Form组件的props
        const formPropTypes = {}
        for (let key in this.props) {
            if (key in ModalForm.formPropTypes && key !== 'onFinish') {
                formPropTypes[key] = this.props[key]
            }
        }

        return (
            <Modal
                {...modalPropTypes}
                onOk={() => this.formRef.current.submit()}
            >
                <Form
                    {...formPropTypes}
                    ref={this.formRef}
                    onFinish={this.onSubmitForm}
                >
                    {this.props.children}
                </Form>
            </Modal>
        )
    }

    // 对话框props
    static modalPropTypes = {
        title: PropTypes.string.isRequired,
        onCancel: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        cancelText: PropTypes.string,
        centered: PropTypes.bool,
        closable: PropTypes.bool,
        destroyOnClose: PropTypes.bool,
        maskClosable: PropTypes.bool,
        okText: PropTypes.string,
        okType: PropTypes.string,
        width: PropTypes.number,
        zIndex: PropTypes.number
    }

    // 表单props
    static formPropTypes = {
        initialValues: PropTypes.object,
        colon: PropTypes.bool,
        hideRequiredMark: PropTypes.bool,
        labelAlign: PropTypes.bool,

        name: PropTypes.string,
        scrollToFirstError: PropTypes.bool,
        size: PropTypes.string,

        validateMessages: PropTypes.any,

        onFinish: PropTypes.func.isRequired,
        onFinishFailed: PropTypes.func,
        onFieldsChange: PropTypes.func,
        onValuesChange: PropTypes.func,
        labelCol: PropTypes.shape({
            span: PropTypes.number.isRequired,
            offset: PropTypes.number,
        }),
        wrapperCol: PropTypes.shape({
            span: PropTypes.number.isRequired,
            offset: PropTypes.number,
        })
    }

    static defaultProps = {
        destroyOnClose: true,
        labelCol: { span: 5, offset: 1 },
        wrapperCol: { span: 15 }
    }

    static propTypes = {
        ...ModalForm.modalPropTypes,
        ...ModalForm.formPropTypes,
        extra: PropTypes.any,
    }
}

export default ModalForm