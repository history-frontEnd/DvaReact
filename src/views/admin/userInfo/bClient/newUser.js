import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Select, Col, Input, Button, Icon, Cascader, Modal, Radio } from 'antd'
import {getSelectOptions} from 'utils/tools'
import {MESSAGE} from 'utils/toast'
import styles from './style.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
class NewUser extends React.Component {
  state = {
    expand: false,
    deptOptions: null
  };

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        return
      }
      this.props.dispatch({
        type: 'userInfo/effs_createBuser',
        payload: {
          ...values,
          area_id: values.area_id[values.area_id.length - 1]
        }
      }).then(result => {
        if (result === 'success') {
          MESSAGE.success('新建用户成功！')
          this.props.close()
        }
      }).catch(error => MESSAGE.error(error))
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
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
    this.setState({deptOptions: null})
  }
  handleOrgType = (e) => {
    let area_id = this.props.form.getFieldValue('area_id') || 'null'
    area_id = Array.isArray(area_id) ? area_id[area_id.length - 1] : 'null'
    this.getOrgList(area_id, e.target.value)
    this.setState({deptOptions: null})
  }
  handleOrgName = (value) => {
    let item = this.props.userInfo.orgList.queryItem({field: 'value', value})
    this.setState({deptOptions: item.children})
    // this.props.form.setFieldsValue('org_id', '')
  }
  render () {
    const {deptOptions} = this.state
    const {visible, close, app, userInfo} = this.props
    const { getFieldDecorator } = this.props.form
    const {orgList} = userInfo
    let {globalArea} = app
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
      <Modal title="新增用户"
        visible={visible}
        footer={null}
        destroyOnClose={true}
        width='750px'
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
            label="账号:"
          >
            {getFieldDecorator('user_account', {})(
              <Input placeholder="推荐使用手机号"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码:"
          >
            {getFieldDecorator('user_password', {})(
              <Input placeholder="若不设置密码，保存后按规则自动生成" type="password"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名:"
          >
            {getFieldDecorator('user_name', {rules: [{
              required: true, message: '请输入姓名!',
            }]})(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码:"
          >
            {getFieldDecorator('user_mobile', {rules: [{
              required: true, message: '请输入手机号码!',
            }, {
              pattern: /^1[0-9]{10}/g, message: '请输入正确的手机号！'
            }]})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Email:"
          >
            {getFieldDecorator('user_email', {})(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所在机构类型:"
          >
            {getFieldDecorator('org_type', {initialValue: 'medical'}, {rules: [{
              required: true, message: '请选择机构类型!',
            }]})(
              <RadioGroup
                onChange={value => this.handleOrgType(value)}>
                <Radio value={'medical'}>医疗机构</Radio>
                <Radio value={'edifact'}>行政机构</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构所在地:"
          >
            {getFieldDecorator('area_id', {rules: [{
              required: true, message: '请选择机构所在地!',
            }]})(
              <Cascader options={globalArea} expandTrigger='hover' placeholder="请选择机构所在地" changeOnSelect={true} onChange={value => this.handleArea(value)}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="机构名称:"
          >
            {getFieldDecorator('org_name', {rules: [{
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
            {getFieldDecorator('org_id', {rules: [{
              required: true, message: '请选择部门/科室名称!',
            }]})(
              <Select>
                {
                  getSelectOptions(deptOptions)
                }
              </Select>
            )}
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

NewUser.propTypes = {
  app: PropTypes.object,
  dispatch: PropTypes.func,
  close: PropTypes.func,
  userInfo: PropTypes.object,
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool
}

export default connect(({app, userInfo}) => ({ app, userInfo }))(Form.create()(NewUser))
