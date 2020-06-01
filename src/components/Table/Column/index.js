import React, { Component } from 'react'
import propTypes from 'prop-types'

export default class TableColumn extends Component {
    getProps = () => {
        return this.props
    }

    render() {
        return null
    }

    static defaultProps = {
        title: "",
        align: "center",
    }

    static propTypes = {
        title: propTypes.string,
        dataIndex: propTypes.string,
        key: propTypes.string,
        align: propTypes.oneOf(["center", "left", "right"]),
    }
}
