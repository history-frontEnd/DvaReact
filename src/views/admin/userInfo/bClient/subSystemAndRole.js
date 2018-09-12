import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tag, Tree, Col, Input, Button, Icon, Cascader, Modal, Radio } from 'antd'
import styles from './style.less'
const TreeNode = Tree.TreeNode

// 获取子系统&角色
function getSubSystem_role (data) {
  const log = () => {}
  let innerContent = []
  if (Array.isArray(data) && data.length !== 0) {
    innerContent = data.map((item, index) => {
      let {systemname, systemid, roleInfo} = item
      return <div className={styles.innerLine} key={systemid}>
        <div className={styles.label} >{systemname}</div>
        <div className={styles.items} >{
          roleInfo && roleInfo.map(its => {
            return <Tag closable onClose={log} key={its.roleid}>{its.rolename}</Tag>
          })
        }</div>
      </div>
    })
  }
  return <div className={styles.subSystemLeft}>
    <div className={styles.header}><span className={styles.title}>子系统简称</span><span>角色</span></div>
    <div className={styles.content}>{innerContent}</div>
  </div>
}

class SystemAndRole extends React.Component {
  state = {
    expand: false,
    submitBody: null
  };
  componentWillReceiveProps (nextProps) {
    if (nextProps.visible === true && nextProps.userInfo.userSelectedRole) {
      this.filterCheckKeys(nextProps.userInfo.userSelectedRole, nextProps.app.globalSystemAndRole)
    }
  }
  submit = () => {
    let userid = this.props.record.userid
    this.props.dispatch({
      type: 'userInfo/effs_editUserRole',
      payload: {
        userid,
        userRoleInfo: this.state.submitBody
      }
    }).then(result => {
      if (result === 'success') {
        // 用户角色
        this.props.dispatch({
          type: 'userInfo/effs_userSystemAndRole',
          payload: {
            userid
          }
        })
      }
    })
  }
  combineCheckKeysAndGlobalTree = () => {
    let {userSelectedRole} = this.props.userInfo
    let {globalSystemAndRole} = this.props.app
    globalSystemAndRole && globalSystemAndRole.map(item => {
      // init
      let {typetag} = item
      let selected = userSelectedRole && userSelectedRole.queryItem({field: 'typetag', value: typetag})
      let keys = (selected && selected.roleids) ? selected.roleids.split(',') : []
      item.checkedKeys = keys
    })
    return globalSystemAndRole
  }
  filterCheckKeys = (userSelectedRole, globalSystemAndRole) => {
    // let {globalSystemAndRole} = this.props.app
    // let {userSelectedRole} = this.props.userInfo
    // let {expand, ...rest} = this.state
    let submitBody = []
    userSelectedRole && userSelectedRole.map(item => {
      let {roleids, typetag} = item
      let roles_id_array = roleids.split(',')
      let globalChildren = globalSystemAndRole.queryItem({field: 'typetag', value: typetag})
      let {systemInfo} = globalChildren || {}
      systemInfo && systemInfo.map(_items => {
        let {systemid, role} = _items
        role.map(ch => {
          if (roles_id_array.indexOf(ch.roleid) > -1) {
            submitBody.push({
              userid: this.props.record.userid,
              systemid,
              roleid: ch.roleid
            })
          }
        })
      })
    })
    this.setState({submitBody})
  }
  onCheck = (checkedKeys, type) => {
    let {userSelectedRole} = this.props.userInfo
    let {globalSystemAndRole} = this.props.app
    // 更新checkedkeys
    let onchecked = globalSystemAndRole.queryItem({field: 'typename', value: type})
    let {typename, typetag} = onchecked
    // 更新选中的角色
    let _check = userSelectedRole.queryItem({field: 'typename', value: type})
    if (_check) {
      _check.roleids = checkedKeys.join(',')
    } else {
      userSelectedRole.push({
        roleids: checkedKeys.join(','),
        typename,
        typetag
      })
    }
    this.setState({[type]: checkedKeys}, this.filterCheckKeys.bind(this, userSelectedRole, globalSystemAndRole))
  }
  renderTreeNodes = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }
    return data.map((item) => {
      if (item.role) {
        return (
          <TreeNode title={item.systemname} key={item.systemid} dataRef={item}>
            {this.renderTreeNodes(item.role)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.rolename} key={item.roleid}/>
    })
  }
  setRoleTree = (roleData) => {
    let result = null
    if (Array.isArray(roleData) && roleData.length !== 0) {
      result = roleData.map((item, index) => {
        return <div className={styles.rolePanel} key={item.typename}>
          <div className={styles.title}>{item.typename}</div>
          <div>
            {
              <Tree
                checkable
                key={item.typename}
                checkedKeys={item.checkedKeys}
                onCheck={(value) => this.onCheck(value, item.typename)}>
                {
                  this.renderTreeNodes(item.systemInfo)
                }
              </Tree>
            }
          </div>
        </div>
      })
    }
    return <div className={styles.subSystemRight}>
      <div className={styles.header}><span className="title">全部角色</span></div>
      <div className={styles.content}>{result}</div>
    </div>
  }
  render () {
    let {visible, close, userInfo} = this.props
    let {userSystemAndRole} = userInfo
    // 设置tree keys
    let globalSystemAndRole = this.combineCheckKeysAndGlobalTree()
    return <Modal
      title="子系统与角色" visible={visible}
      footer={null}
      destroyOnClose={true}
      width='1069px'
      className="modal-container"
      onCancel = {close}
      maskClosable = {false}>
      <div className={styles.warp}>
        {getSubSystem_role(userSystemAndRole)}
        {this.setRoleTree(globalSystemAndRole)}
      </div>
      <div className={styles.systemFooter}><Button className={styles.cancel} onClick={close}>取消</Button><Button type="primary" onClick={this.submit}>保存</Button></div>
    </Modal>
  }
}

SystemAndRole.propTypes = {
  record: PropTypes.object,
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  close: PropTypes.func,
  visible: PropTypes.bool,
  app: PropTypes.object
}

export default connect(({app, userInfo}) => ({ app, userInfo }))(SystemAndRole)
