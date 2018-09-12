import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Row, Col, Input, Button, Icon, Table, Modal } from 'antd'
import styles from './style.less'
import getCUserInfoColumns from '../tableColumns/cUserInfoColumns'
import {PAGESIZE} from 'utils/config'

class InfoTable extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      current: 1
    }
  }
  search (current = 1) {
    this.props.dispatch({
      type: 'userInfo/effs_getCUserFilter',
      payload: {
        ...this.props.userInfo.newUserInfoSubmit,
        page_size: PAGESIZE,
        page_num: current
      }
    })
  }
  render () {
    console.log(this.props)
    let {userInfo} = this.props
    let {total, list, pages, pageNum} = userInfo.cClientUserList || {}
    const {current} = this.state
    const pagination = {
      total,
      onChange: (current) => {
        this.search(current)
        this.setState({current})
      },
      showTotal: (totalCount) => `共${totalCount}条记录 第${pageNum}/${pages}页`,
      pageSize: PAGESIZE,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent: current,
      current
    }
    return <Table
      size="middle"
      rowKey = {(record) => record.user_id}
      dataSource={list}
      pagination={pagination}
      columns={getCUserInfoColumns()}/>
  }
}

InfoTable.propTypes = {
  dispatch: PropTypes.func,
  userInfo: PropTypes.object
}

export default connect(({app, userInfo}) => ({ app, userInfo }))(InfoTable)
