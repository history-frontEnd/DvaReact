import React from 'react'
// import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
require('./index.scss')

class ReadonlyDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }
  render () {
    let {info} = this.props
    let {user_hospital, user_name, case_type, case_name, case_mobile, case_sex, case_advice, case_conclusion, case_age, case_result, case_other} = info
    return (<div className="edit-patient-submit">
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
        <Row>
          <Col span={8}>类型选择：</Col>
          <Col span={16}>{case_type === '1' ? '儿童' : '孕妇'}</Col>
        </Row>
        <Row>
          <Col span={8}>姓名：</Col>
          <Col span={16}>{case_name}</Col>
        </Row>
        <Row>
          <Col span={8}>性别：</Col>
          <Col span={16}>{case_sex === 1 ? '男' : '女'}</Col>
        </Row>
        <Row>
          <Col span={8}>年龄：</Col>
          <Col span={16}>{case_age}</Col>
        </Row>
        <Row>
          <Col span={8}>电话：</Col>
          <Col span={16}>{case_mobile}</Col>
        </Row>
        <Row>
          <Col span={8}>处理意见：</Col>
          <Col span={16}>{case_advice}</Col>
        </Row>
        <Row style={{display: case_result ? 'block' : 'none'}}>
          <Col span={8}>诊断结论：</Col>
          <Col span={16}>{case_result}</Col>
        </Row>
        <Row>
          <Col span={8}>下一步考虑：</Col>
          <Col span={16}>{case_conclusion}</Col>
        </Row>
        <Row style={{display: case_other ? 'block' : 'none', wordWrap: 'break-word'}}>
          <Col span={8}>其它：</Col>
          <Col span={16}>{case_other}</Col>
        </Row>
      </div>
    </div>
    )
  }
}

ReadonlyDetails.propTypes = {
  info: PropTypes.object
}

export default ReadonlyDetails
