import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Row, Col, Input, Button, Icon, Cascader } from 'antd'
import {PAGESIZE} from 'utils/config'
import styles from './style.less'

const FormItem = Form.Item

class SearchForm extends React.Component {
  state = {
    expand: false,
  };
  componentWillMount () {
    // init
    this.search()
    // 全国地区
    this.props.dispatch({
      type: 'app/effs_getGlobalArea'
    })
    // 系统角色
    this.props.dispatch({
      type: 'app/effs_globalSystemAndRole'
    })
  }
  search () {
    this.props.dispatch({
      type: 'userInfo/effs_filterBClientUsers',
      payload: {
        ...this.props.userInfo.newUserInfoSubmit,
        pageSize: PAGESIZE,
        pageNum: 1
      }
    })
  }
  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('Received values of form: ', values)
      this.search()
      this.setState({current: 1})
    })
  }
  hanldeInputValue = (e, type) => {
    let v = type === 'areaid' ? Array.isArray(e) ? e[e.length - 1] : '' : e.target.value
    this.props.dispatch({
      type: 'userInfo/updateNewUserInfo',
      payload: {
        [type]: v
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'userInfo/updateNewUserInfo',
      payload: {
        usermobile: '',
        areaid: '',
        username: '',
        orgname: ''
      }
    })
  }
  render () {
    let {userInfo, form, app} = this.props
    let {username, usermobile, orgname, areaid} = userInfo.newUserInfoSubmit
    let {globalArea} = app
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <Form
        className={styles.searchFormContainer}
        onSubmit={this.handleSearch}
        id="bform"
      >
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('usermobile', {initialValue: usermobile})(
                <Input placeholder="请输入11位手机号" onChange={(e) => this.hanldeInputValue(e, 'usermobile')}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="机构所在地"
            >
              {getFieldDecorator('areaid', {initialValue: areaid})(
                <Cascader options={globalArea} placeholder="请选择机构所在地" changeOnSelect={true} onChange={(value) => this.hanldeInputValue(value, 'areaid')}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="姓名:"
            >
              {getFieldDecorator('username', {initialValue: username})(
                <Input placeholder="请输入关键字" onChange={(e) => this.hanldeInputValue(e, 'username')}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="机构名称/拓展名:"
            >
              {getFieldDecorator('orgname', {initialValue: orgname})(
                <Input placeholder="请输入关键字" onChange={(e) => this.hanldeInputValue(e, 'orgname')}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button style={{ marginLeft: 8, marginRight: 24 }} onClick={this.handleReset}>
              重置
            </Button>
            <Button icon="search" type="primary" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

SearchForm.propTypes = {
  app: PropTypes.object,
  userInfo: PropTypes.object,
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
}
function mapStateToProps ({app, userInfo}) {
  return {
    app,
    userInfo
  }
}
export default connect(mapStateToProps)(Form.create()(SearchForm))
