import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Form, Input, Icon } from 'antd'

import './index.scss'

const FormItem = Form.Item

class Website extends React.Component {
  login = (e) => {
    e.preventDefault()
    let { dispatch, form } = this.props
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        console.log(errors)
        return
      }
      dispatch({ type: 'website/login', payload: values })
    })
  }
  render () {
    const { website, form } = this.props
    const { getFieldDecorator } = form
    return (
      <div className="login-warp">
        <div className="headers">
          {/* <img src={require('../../../assets/img/login-title.png')}/> */}
          <img src="https://biosan-saas.oss-cn-beijing.aliyuncs.com/heart/home-title.png"/>
        </div>
        <div className="login-body-warp">
          <div className="login-body">
            {!website.isHideLogin && <div className='login-form'>
              <div className="login-title">手机号登录</div>
              <Form onSubmit={this.login}>
                <FormItem>
                  {getFieldDecorator('userMobile', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('userPassword', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <Button type="primary" size="large" className="form-btn-login" htmlType="submit">登录</Button>
                {/* </Row> */}
              </Form>
            </div>}
          </div>
        </div>
        <div className="footer"/>
        {/* <div className='website-mask'/> */}
      </div>
    )
  }
}

Website.propTypes = {
  website: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ website, loading }) => ({ website, loading }))(Form.create()(Website))
