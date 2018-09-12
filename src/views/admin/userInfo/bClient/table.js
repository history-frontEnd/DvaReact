import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Row, Col, Input, Button, Icon, Table, Modal } from 'antd'
import styles from './style.less'
import getBUserInfoColumns from '../tableColumns/bUserInfoColumns'
import NewUser from './newUser'
import EditUser from './editUser'
import SubSystemAndRole from './subSystemAndRole'
import {PAGESIZE} from 'utils/config'

class InfoTable extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      newUser: false,
      editUser: false,
      subSystem: false,
      current: 1,
      height: 400
    }
  }
  componentDidMount () {
    this.setState({height: document.getElementById('warp').clientHeight - document.getElementById('bform').clientHeight - document.getElementById('toolBar').clientHeight - 100})
  }
  search (current = 1) {
    this.props.dispatch({
      type: 'userInfo/effs_filterBClientUsers',
      payload: {
        ...this.props.userInfo.newUserInfoSubmit,
        pageSize: PAGESIZE,
        pageNum: current
      }
    })
  }
  controlState = (type, result) => {
    this.setState({[type]: result})
  }
  editUser = (record) => {
    this.props.dispatch({
      type: 'userInfo/effs_getBUserDetails',
      payload: {
        user_id: record.userid
      }
    })
    this.setState({record, editUser: true})
  }
  editRole = (record) => {
    // 用户角色
    this.props.dispatch({
      type: 'userInfo/effs_userSystemAndRole',
      payload: {
        userid: record.userid
      }
    })
    // 子系统角色&选中
    this.props.dispatch({
      type: 'userInfo/effs_getUserRoleWithSystemType',
      payload: {
        userid: record.userid
      }
    })
    this.setState({record, subSystem: true})
  }
  bClientEanle = (record) => {
    let {userid, userstate} = record
    this.props.dispatch({
      type: 'userInfo/effs_bClientEnable',
      payload: {
        user_id: userid,
        user_state: userstate === '0' ? '1' : '0'
      }
    })
  }
  render () {
    let {userInfo} = this.props
    let {bClientUserList} = userInfo
    let {dataCount, dataList, pageNum, pages} = bClientUserList || {}
    const {newUser, editUser, subSystem, record, current, height} = this.state
    const newUser_props = {
      visible: newUser,
      close: () => this.controlState('newUser', false)
    }
    const editUser_props = {
      visible: editUser,
      close: () => this.controlState('editUser', false),
      record
    }
    const sub_props = {
      record,
      visible: subSystem,
      close: () => this.controlState('subSystem', false)
    }
    const pagination = {
      total: dataCount,
      onChange: (current) => {
        this.search(current)
        this.setState({ current })
      },
      showTotal: (total) => `共${total}条记录 第${pageNum}/${pages}页`,
      pageSize: PAGESIZE,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent: 1,
      current
    }
    return <Fragment>
      <div className={styles.toolBar} id="toolBar">
        <Button icon="file-add" type="primary" className={styles.newUser} onClick= {() => this.controlState('newUser', true)}>新建用户</Button>
        {/* <Button>批量新建</Button> */}
      </div>
      <Table
        dataSource={dataList}
        pagination={pagination}
        rowKey={record => record.userid}
        size="middle"
        scroll = {{x: 800, y: height}}
        columns={getBUserInfoColumns(this.editUser, this.editRole, this.bClientEanle)}/>
      {/* 新增用户 */}
      <NewUser {...newUser_props}/>
      {/* 编辑用户 */}
      <EditUser {...editUser_props}/>
      {/* 批量新建 */}
      {/* 子系统与角色 */}
      <SubSystemAndRole {...sub_props}/>
    </Fragment>
  }
}

InfoTable.propTypes = {
  dispatch: PropTypes.func,
  userInfo: PropTypes.object
}

export default connect(({app, userInfo}) => ({ app, userInfo }))(InfoTable)
