import React from 'react'
import { Table, Row, Col, Input, Button, DatePicker, Icon, Radio } from 'antd'
import moment from 'moment'
import { connect } from 'dva'
import NumberCard from '../components/numberCard'
import './style.scss'
const { RangePicker } = DatePicker
// const { RadioButton, RadioGroup } = Radio
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const DAY_MS = 24 * 60 * 60 * 1000

const columns = [
  {
    title: '活动名称',
    dataIndex: 'market_name',
    key: 'market_name',
    width: '50%'
  }, {
    title: '新增粉丝数',
    dataIndex: 'fans_count',
    key: 'fans_count',
    width: '50%'
  }
]

class StatisticsIndex extends React.Component {
  constructor (props) {
    super(props)
    this.datePickerChange = this.datePickerChange.bind(this)
    this.radioButtonChange = this.radioButtonChange.bind(this)
    this.state = {
      dateRange: [moment(), moment()],
      dateKeyword: 'today'
    }
  }
  datePickerChange (date) {
    this.getSectionData(date)
    this.setState({
      dateRange: date,
      dateKeyword: ''
    })
  }
  radioButtonChange (e) {
    const dateKeyword = e.target.value
    let dateRange = []
    switch(dateKeyword) {
      case 'today':
        dateRange = [moment(), moment()]
        break
      case 'yesterday':
        dateRange = [moment(Date.now() - 1 * DAY_MS), moment(Date.now() - 1 * DAY_MS)]
        break
      case 'week':
        dateRange = [moment(Date.now() - 7 * DAY_MS), moment()]
        break
      case 'month':
        dateRange = [moment(Date.now() - 30 * DAY_MS), moment()]
        break
    }
    this.setState({
      dateRange,
      dateKeyword
    })
    this.getSectionData(dateRange)
  }
  getSectionData (dateRange) {
    const { dispatch } = this.props
    const payload = {
      start: dateRange[0].format('YYYY-MM-DD'),
      end: dateRange[1].format('YYYY-MM-DD')
    }
    // dispatch({ type: 'statistics/section', payload })
  }
  componentDidMount () {
    this.getSectionData(this.state.dateRange)
  }
  render () {
    const { section } = this.props.statistics
    return (
      <div>
        <div className="date-search-wrap">
          <Row className="date-search-content">
            <Col offset={1} md={8}>
              <Row type="flex" align="middle">
                <Col md={4} className="label-bold">时间筛选</Col>
                <Col md={20}><RangePicker value={this.state.dateRange} onChange={this.datePickerChange} /></Col>
              </Row>
            </Col>
            <Col xs={{offset: 1}} md={10}>
              <Row type="flex" align="middle">
                <Col md={3} className="label-bold">快速选择</Col>
                <Col md={21}>
                  <RadioGroup value={this.state.dateKeyword} onChange={this.radioButtonChange}>
                    <RadioButton value="today">今天</RadioButton>
                    <RadioButton value="yesterday">昨天</RadioButton>
                    <RadioButton value="week">近7天</RadioButton>
                    <RadioButton value="month">近30天</RadioButton>
                  </RadioGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Row className="content-wrapper">
          <Col span={22} offset={1}><Table bordered rowKey='market_name' columns={columns} dataSource={section} pagination={false}/></Col>
        </Row>
      </div>
    )
  }
}

export default connect(({ statistics, loading }) => ({ statistics, loading }))(StatisticsIndex)
