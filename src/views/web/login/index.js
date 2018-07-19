import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
const FormItem = Form.Item
require('./index.scss')
class Login extends React.Component {
  login = (e) => {
    e.preventDefault()

    let { dispatch, form } = this.props
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }
  render () {
    const { form } = this.props
    return (
      <div className='login'>
        <div className='title-logo'/>
        <div className='login-form'>
          <Form onSubmit={this.login} >
            <FormItem hasFeedback className="user-mobile">
              <div className="input-mobile-icon"></div>
              {form.getFieldDecorator('userMobile', {
                rules: [
                  // { required: true, message: '请输入正确的手机号!' },
                ],
              })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem hasFeedback className="user-password">
              <div className="input-password-icon"></div>
              {form.getFieldDecorator('userPassword', {
                rules: [
                  // { required: true, message: '请输入密码' },
                ],
              })(<Input type="password" placeholder="密码" />)}
            </FormItem>
            <Button type="primary" className="login-submit" htmlType="submit">立即登录</Button>
          </Form>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
