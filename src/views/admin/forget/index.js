import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import RegisterFrame from '../components/registerFrame'
import { Button, Row, Form, Input, Col } from 'antd'
const FormItem = Form.Item

class Forget extends Component {
  state = {
    sendingCode: false
  }
  renderSendCodeBtn = () => {
    if (this.state.sendingCode) {
      return <span className="sendEmailCode" href="javascript:;">再次发送({this.state.sendingCode})</span>
    } else {
      return <a className="sendEmailCode" onClick={this.sendCode}> 发送邮箱验证码</a>
    }
  }
  sendCode = (e) => {
    let { dispatch, form } = this.props
    let email = form.getFieldValue('user_name')
    form.validateFields(['user_name'], { force: true })
    let errs = form.getFieldError('user_name') || []
    if (email && !errs.length) {
      this.state.sendingCode = 60
      this.sentAnimation('sendingCode')
      dispatch({ type: 'forget/sendCode', payload: { email: email, captcha_type: 'forget' } })
    }
  }
  sentAnimation = (attr) => {
    setTimeout(() => {
      let state = {}
      state[attr] = this.state[attr] - 1
      this.setState(state)
      if (this.state[attr] && this.state[attr] > 0) {
        this.sentAnimation(attr)
      } else {
        this.state[attr] = false
      }
    }, 1000)
  }
  handleSubmit = (e) => {
    let { dispatch, form } = this.props
    e.preventDefault()
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'forget/changePassword', payload: values })
    })
  }
  handleConfirmBlur = (e) => {
    let { forget, dispatch } = this.props
    const value = e.target.value
    dispatch({ type: 'forget/updateState', payload: {confirmDirty: forget.confirmDirty || !!value} })
  }
  checkPassword = (rule, value, callback) => {
    let { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback(new Error('输入的密码不一致!'))
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    let { forget, form } = this.props
    if (value && forget.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  render () {
    const { form } = this.props
    return (
      <RegisterFrame>
        <div className='register-form-wrapper'>
          <div className='step-title'>忘记密码</div>
          <div className='register-form'>
            <Form onSubmit={this.handleSubmit}>
              <FormItem hasFeedback>
                {form.getFieldDecorator('user_name', {
                  rules: [
                    { required: true, message: '请输入邮箱地址!' },
                    { type: 'email', message: '请输入正确的邮箱地址!' },
                  ],
                })(<Input size="large" placeholder="邮箱" />)}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={12}>
                    {form.getFieldDecorator('captcha', {
                      rules: [{
                        required: true, message: '请输入邮箱验证码!',
                      }],
                    })(<Input size="large" placeholder="验证码" />)}
                  </Col>
                  <Col span={12}>
                    {this.renderSendCodeBtn()}
                  </Col>
                </Row>
              </FormItem>
              <FormItem hasFeedback>
                {form.getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, message: '密码由6-21字母和数字组成，不能是纯数字或纯英文!' },
                    { validator: this.checkConfirm },
                  ],
                })(<Input size="large" type="password" placeholder="新的密码" />)}
              </FormItem>
              <FormItem hasFeedback>
                {form.getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: '请确认你的密码!',
                  }, {
                    validator: this.checkPassword,
                  }],
                })(<Input size="large" type="password" onBlur={this.handleConfirmBlur} placeholder="重复你的密码" />)}
              </FormItem>
              <Row>
                <Button className="form-btn-login" type="primary" size="large" htmlType="submit"> 立即登录 </Button>
              </Row>
            </Form>
          </div>
        </div>
      </RegisterFrame>
    )
  }
}

Forget.propTypes = {
  forget: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ forget, loading }) => ({ forget, loading }))(Form.create()(Forget))
