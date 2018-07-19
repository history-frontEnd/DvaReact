import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Icon, Button, Radio, Select } from 'antd'
import { connect } from 'dva'
// import { Link } from 'dva/router'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
require('./index.scss')

class EditPatientForm extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      resultShow: false,
      otherShow: false,
      invoke: false
    }
  }
  save = (values) => {
    let {dispatch} = this.props
    let {patientDetails} = this.props.mainPageBody
    let {info, images} = patientDetails
    let {case_id} = info
    dispatch({
      type: 'mainPageBody/savePatientDetails',
      payload: {
        id: case_id,
        images,
        ...values
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.save(values)
      }
    })
  }
  handleAdviceChange = (value) => {
    if (value === '先天性心脏病') {
      this.setState({resultShow: true, invoke: true})
    } else {
      this.setState({resultShow: false, invoke: true})
    }
  }
  handleConclusionChange = (value) => {
    let flag = value === '其它'
    this.setState({otherShow: flag, invoke: true})
    // if (value === '其它') {
    //   this.setState({otherShow: true, invoke: true})
    // }
    //  else {
    //   this.setState({resultShow: false, invoke: true})
    // }
  }
  onValuesChange = (props, changedValues, allValues) => {
    console.log(props)
  }
  render () {
    // let {patientDetails} = this.props.mainPageBody
    let {info} = this.props
    let {case_name, case_mobile, case_sex} = info
    // 回填基本信息
    let {user_hospital, user_name, case_age, case_type, case_advice, case_result, case_conclusion, case_other} = info
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
    if (!this.state.invoke) {
      this.state.resultShow = case_advice === '先天性心脏病'
      this.state.otherShow = case_conclusion === '其它'
    }
    // let showConclution = case_conclusion === '先天性心脏病'
    // let showother = case_other === '其它'
    const { getFieldDecorator } = this.props.form
    return (
      <div className="edit-patient-submit">
        <div className="edit-patient-baseinfo">
          <div className="title">上传单位信息</div>
          <Row>
            <Col span={6}>医院：</Col>
            <Col span={18}>{user_hospital}</Col>
          </Row>
          <Row>
            <Col span={6}>医生：</Col>
            <Col span={18}>{user_name}</Col>
          </Row>
        </div>
        <div className="edit-patient-submit-form">
          <div className="title">患者信息</div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="类型选择"
              {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: case_type ? case_type.toString() : '2'
              })(
                <RadioGroup>
                  <Radio value={'1'}>儿童</Radio>
                  <Radio value={'2'}>孕妇</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              label="姓名"
              {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: case_name,
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="性别"
              {...formItemLayout}>
              {getFieldDecorator('sex', {
                initialValue: case_sex ? case_sex.toString() : '1',
                rules: [{ required: true, message: 'Please input your sex!' }],
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              label="年龄"
              {...formItemLayout}>
              {getFieldDecorator('age', {
                initialValue: case_age
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="电话"
              {...formItemLayout}>
              {getFieldDecorator('mobile', {
                rules: [{ pattern: /^1[0-9]{10}$/, message: '请输入正确手机号码' }],
                initialValue: case_mobile
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="处理意见"
              {...formItemLayout}>
              {getFieldDecorator('advice', {
                initialValue: case_advice,
                rules: [],
              })(
                <Select style={{ width: '100%' }} onChange={this.handleAdviceChange}>
                  <Option value="未见明显异常">未见明显异常</Option>
                  <Option value="心脏生理性变化过程">心脏生理性变化过程</Option>
                  <Option value="先天性心脏病">先天性心脏病</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              style={{display: this.state.resultShow ? 'block' : 'none'}}
              label="诊断结论"
              {...formItemLayout}>
              {getFieldDecorator('result', {
                initialValue: case_result,
              })(
                // <DatePicker style={{width: '100%'}}/>
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem
              label="下一步考虑"
              {...formItemLayout}>
              {getFieldDecorator('conclusion', {
                initialValue: case_conclusion
              })(
                <Select style={{ width: '100%' }} onChange={this.handleConclusionChange}>
                  <Option value="建议随访">建议随访</Option>
                  <Option value="转院治疗">转院治疗</Option>
                  <Option value="定期复查，每周记录体重，注意呼吸">定期复查，每周记录体重，注意呼吸</Option>
                  <Option value="其它">其它</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              style={{display: this.state.otherShow ? 'block' : 'none'}}
              label="其它"
              {...formItemLayout}>
              {getFieldDecorator('other', {
                initialValue: case_other
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                保存
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

EditPatientForm.propTypes = {
  mainPageBody: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  info: PropTypes.object
}

export default connect(({ mainPageBody, loading }) => ({ mainPageBody, loading }))(Form.create()(EditPatientForm))
