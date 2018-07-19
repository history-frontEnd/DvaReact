import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Form, Input, Row, Col, message } from 'antd'
import { Link } from 'dva/router'
import { isLogin, isCompleted } from 'utils'
import { uploadBase64 } from 'utils/uploadImg'
import {
  readOrientation,
  vaildImgType,
  compressImg
} from 'utils/exif'

const FormItem = Form.Item
require('./index.scss')

class RegisterForm extends React.Component {
  state = {
    uploadLoading: false,
    sendindCode: false,
    sendingCode1: false,
    business_licence_url: null,
  }
  toggleShow = (show) => {
    this.setState({ uploadLoading: show })
  }
  componentDidMount () {
    let { dispatch } = this.props
    let step = {step1: false, step2: false, step3: false}

    if (!isLogin()) {
      step.step1 = true
    } else {
      if (isCompleted()) {
        step.step3 = true
      } else {
        step.step2 = true
      }
    }

    // test 调试代码，需要删除
    // step = {step1: false, step2: true, step3: false}
    dispatch({ type: 'register/updateState', payload: step })
  }

  onFileChange = (e) => {
    let { form } = this.props
    let file = e.target.files[0]
    if (file === undefined) return
    vaildImgType(file.slice(0, 2), (fileType) => {
      if (!fileType) {
        message.error('请上传jpg,png,gif图片!')
        return
      }
      this.toggleShow(true)
      readOrientation(file, fileType, (orientation) => {
        let reader = new FileReader()
        reader.onload = () => {
          let base64 = reader.result.replace(/^.*?,/, '')
          let img = new Image()
          img.onload = () => compressImg(img, orientation, 1400, (canvas) => {
            uploadBase64(canvas.toDataURL('image/jpeg', 0.9)).then((res) => {
              if (res.origin) {
                this.setState({business_licence_url: res.origin})
                form.setFieldsValue({business_licence: res.origin})
                this.toggleShow(false)
                message.success('图片已上传!')
              }
            })
          })
          img.src = 'data:image/' + fileType + ';base64,' + base64
        }
        reader.readAsDataURL(file)
      })
    })
  }
  auth = () => {
    let { app } = this.props
    location.href = app.user.authUrl
  }
  handleSubmit = (e) => {
    let { dispatch, form } = this.props
    e.preventDefault()
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'register/register', payload: values })
    })
  }
  handleSubmit1 = (e) => {
    let { dispatch, form } = this.props
    e.preventDefault()
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'register/register1', payload: values })
    })
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
  renderSendCodeBtn = () => {
    if (this.state.sendingCode) {
      return <span className="sendEmailCode" href="javascript:;">再次发送({this.state.sendingCode})</span>
    } else {
      return <a className="sendEmailCode" onClick={this.sendCode}> 发送邮箱验证码</a>
    }
  }
  renderSendCodeBtn1 = () => {
    if (this.state.sendingCode1) {
      return <span className="sendEmailCode" href="javascript:;">再次发送({this.state.sendingCode1})</span>
    } else {
      return <a className="sendEmailCode" onClick={this.sendCode1}> 发送手机验证码</a>
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
      dispatch({ type: 'register/sendCode', payload: { email: email, captcha_type: 'register' } })
    }
  }
  sendCode1 = (e) => {
    let { dispatch, form } = this.props
    let mobile = form.getFieldValue('mobile')
    form.validateFields(['mobile'], { force: true })
    let errs = form.getFieldError('mobile') || []
    if (mobile && !errs.length) {
      this.state.sendingCode1 = 60
      this.sentAnimation('sendingCode1')
      dispatch({ type: 'register/sendCode', payload: { mobile: mobile, captcha_type: 'complete' } })
    }
  }
  handleConfirmBlur = (e) => {
    let { register, dispatch } = this.props
    const value = e.target.value
    dispatch({ type: 'register/updateState', payload: {confirmDirty: register.confirmDirty || !!value} })
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
    let { register, form } = this.props
    if (value && register.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  render () {
    let { register, form } = this.props
    return (
      <div className='website2'>
        <div className='register-header'>
          <div className='register-logo'>
            <div className='logo'></div>
          </div>
        </div>

        {register.step1 && <div className='register-form-wrapper'>
          <div className='step-title'>Step.1：信息注册</div>
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
                })(<Input size="large" type="password" placeholder="密码" />)}
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
              <Row className='form-tip'>
              已经有账号？<Link to="/website">点击登录</Link>
              </Row>
              <Row>
                <Button className="form-btn-login" type="primary" size="large" htmlType="submit"> 立即注册 </Button>
              </Row>
            </Form>
          </div>
        </div>}

        {register.step2 && <div className='register-form-wrapper'>
          <div className='step-title'> Step.2：信息登记 </div>
          <div className='register-form'>
            <Form onSubmit={this.handleSubmit1}>
              {/* <FormItem hasFeedback>
                {form.getFieldDecorator('company_name', {
                  rules: [
                    { required: true, message: '请填写公司名称!' },
                    { pattern: /^.{2,20}$/, message: '请填写正确的公司名称!' },
                  ],
                })(<Input size="large" placeholder="公司名称" />)}
              </FormItem>
              <FormItem hasFeedback>
                {form.getFieldDecorator('company_address', {
                  rules: [
                    { required: true, message: '请填写公司名称!' },
                    { pattern: /^.{2,30}$/, message: '请填写正确的公司地址!' },
                  ],
                })(<Input size="large" placeholder="公司地址" />)}
              </FormItem>
              <FormItem >
                <div className="upload-licence">
                  {form.getFieldDecorator('business_licence_file', {
                  })(<Input accept="*" type="file" onChange={this.onFileChange} placeholder="公司营业执照" />)}
                  {this.state.uploadLoading && <div className="upload-loading"><em /></div>}

                  {this.state.business_licence_url && <div className='business_licence_img' style={{backgroundImage: `url(${this.state.business_licence_url})`}} />}
                </div>
              </FormItem>
              <FormItem className="business_licence_file">
                {form.getFieldDecorator('business_licence', {
                  rules: [
                    { required: true, message: '请上传营业执照!' },
                  ],
                })(<Input size="large" type="hidden" placeholder="上传营业执照" />)}
              </FormItem> */}
              <FormItem hasFeedback>
                {form.getFieldDecorator('official_operator', {
                  rules: [
                    { required: true, message: '请填写运营人姓名!' }
                  ],
                })(<Input size="large" placeholder="运营人姓名" />)}
              </FormItem>
              <FormItem hasFeedback>
                {form.getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: '请填写正确的手机号码!' },
                    { pattern: /^1[0-9]{10}$/, message: '请填写正确的手机号码!' },
                  ],
                })(<Input size="large" placeholder="手机号码" />)}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={12}>
                    {form.getFieldDecorator('mobile_captcha', {
                      rules: [{
                        required: true, message: '请输入手机验证码!',
                      }],
                    })(<Input size="large" placeholder="验证码" />)}
                  </Col>
                  <Col span={12}>
                    {this.renderSendCodeBtn1()}
                  </Col>
                </Row>
              </FormItem>

              <Row>
                <Button className="form-btn-login" type="primary" size="large" htmlType="submit">提交</Button>
              </Row>
            </Form>
          </div>
        </div>}

        {register.step3 && <div className='register-form-wrapper'>
          <div className='step-title'> Step.3：授权吾印开放平台 </div>
          <Button onClick={this.auth} className="wechat-auth-btn" type="primary" size="large">点击进入授权页面</Button>
        </div>}

      </div>
    )
  }
}

RegisterForm.propTypes = {
  app: PropTypes.object,
  register: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({ app, register }) => ({ app, register }))(Form.create()(RegisterForm))
