import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Select, Col, Input, Button, Icon, Cascader, Modal, Radio } from 'antd'
import {getSelectOptions} from 'utils/tools'
import {MESSAGE} from 'utils/toast'
import styles from './style.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
class EditUser extends React.Component {
  state = {
    expand: false,
    deptOptions: null
  };
  componentWillReceiveProps (nextProps) {
  }
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('Received values of form: ', values)
      let {user_id, user_state, user_account, user_mobile, user_email, deptId, user_name} = values
      this.props.dispatch({
        type: 'userInfo/effs_saveBClient',
        payload: {user_id, user_state: user_state.toString(), user_account, user_mobile, user_email, deptId, user_name}
      }).then(result => {
        this.props.close()
      }).catch(error => console(error))
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }
  resetPassword = (user_id) => {
    this.props.dispatch({
      type: 'userInfo/effs_resetPassword',
      payload: {
        user_id
      }
    }).then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  }
  getOrgList = (areaid, orgtype) => {
    this.props.dispatch({
      type: 'userInfo/effs_getOrgList',
      payload: {
        areaid,
        orgtype
      }
    })
  }
  handleArea = (value, type) => {
    this.getOrgList(Array.isArray(value) ? value[ value.length - 1 ] : '', this.props.form.getFieldValue('org_type'))
    // this.setState({deptOptions: null})
    this.updateDeptList(null)
  }
  // 更新部门信息
  // 修改所在地 & 改变机构都需要更新
  updateDeptList = (list) => {
    this.props.dispatch({
      type: 'userInfo/updateDeptList',
      payload: list
    })
  }
  // 更改机构类型
  handleOrgType = (e) => {
    let area_id = this.props.form.getFieldValue('area_id')
    this.getOrgList(Array.isArray(area_id) ? area_id[ area_id.length - 1 ] : '', e.target.value)
    this.updateDeptList(null)
  }
  handleOrgName = (value) => {
    let item = this.props.userInfo.orgList.queryItem({field: 'value', value})
    this.updateDeptList(item.children)
  }
  render () {
    const {visible, close, app, userInfo} = this.props
    const { getFieldDecorator } = this.props.form
    const {deptOptions} = this.state
    const {orgList, deptList} = userInfo
    let {globalArea} = app
    let {userOrgIds, create_date_time, update_date_time, deptId, org_type, user_account, user_email, user_mobile, user_name, user_id, org_id, user_state} = userInfo.bUserDetails || {}
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    }
    return (
      <Modal
        title="编辑用户"
        visible={visible}
        footer={null}
        width='750px'
        destroyOnClose={true}
        className="modal-container"
        onCancel = {close}
        maskClosable = {false}>
        <Form
          className={styles.newUserForm}
          layout="vertical"
          onSubmit={this.handleSearch}
        >
          <FormItem
            {...formItemLayout}
            label="user_id:"
            style={{display: 'none'}}
          >
            {getFieldDecorator('user_id', {initialValue: user_id}, {rules: [{
              required: true, message: '请输入账号!',
            }]})(
              <Input placeholder="user_id"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="user_state:"
            style={{display: 'none'}}
          >
            {getFieldDecorator('user_state', {initialValue: user_state}, {rules: [{
              required: true, message: 'user_state',
            }]})(
              <Input placeholder="user_state"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账号:"
          >
            {getFieldDecorator('user_account', {initialValue: user_account}, {rules: [{
              required: true, message: '请输入账号!',
            }]})(
              <Input placeholder="推荐使用手机号"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码:"
          >
            <a onClick={() => this.resetPassword(user_id)}>重置</a>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="appid:"
          >
            {/* {getFieldDecorator('user_name', {})(
             <span></span>
             )} */}
            <span></span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="openid:"
          >
            {/* {getFieldDecorator('pwd', {})(
             <span></span>
             )} */}
            <span></span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名:"
          >
            {getFieldDecorator('user_name', {initialValue: user_name}, {rules: [{
              required: true, message: '请输入姓名!',
            }]})(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码:"
          >
            {getFieldDecorator('user_mobile', {initialValue: user_mobile}, {rules: [{
              required: true, message: '请输入手机号码!',
            }, {
              pattern: /^1[0-10]{10}/g, message: '请输入正确的手机号！'
            }]})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Email:"
          >
            {getFieldDecorator('user_email', {initialValue: user_email})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所在机构类型:"
          >
            {getFieldDecorator('org_type', {initialValue: org_type}, {rules: [{
              required: true, message: '请选择机构类型!',
            }]})(
              <RadioGroup
                onChange={e => this.handleOrgType(e)}>
                <Radio value={'medical'}>医疗机构</Radio>
                <Radio value={'edifact'}>行政机构</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构所在地:"
          >
            {getFieldDecorator('area_id', {initialValue: userOrgIds}, {rules: [{
              required: true, message: '请选择机构所在地!',
            }]})(
              <Cascader options={globalArea} changeOnSelect={true} onChange={value => this.handleArea(value)}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构名称:"
          >
            {getFieldDecorator('org_id', {initialValue: org_id}, {rules: [{
              required: true, message: '请选择机构名称!',
            }]})(
              <Select
                onChange={value => this.handleOrgName(value)}>
                {
                  getSelectOptions(orgList)
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="部门/科室名称:"
          >
            {getFieldDecorator('deptId', {initialValue: deptId}, {rules: [{
              required: true, message: '请选择部门/科室名称!',
            }]})(
              <Select>
                {
                  getSelectOptions(deptList)
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="创建时间:"
          >
            <span>{create_date_time}</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="最近修改时间:"
          >
            <span>{update_date_time}</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="最近登录时间:"
          >
            <span>{update_date_time}</span>
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button icon="plus" htmlType="submit" type="primary">保存</Button>
            <Button style={{ marginLeft: 8, marginRight: 24 }} onClick={close}>
              取消
            </Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

EditUser.propTypes = {
  app: PropTypes.object,
  dispatch: PropTypes.func,
  close: PropTypes.func,
  userInfo: PropTypes.object,
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool
}

export default connect(({app, userInfo}) => ({ app, userInfo }))(Form.create()(EditUser))
