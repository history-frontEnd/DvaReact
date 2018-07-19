import React from 'react'
import { connect } from 'dva'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Table, Form, Row, Col } from 'antd'
import { checkString } from 'utils'
import './style.scss'

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
  width: '5%'
}, {
  title: '活动标题',
  dataIndex: 'title',
  key: 'title',
  width: '25%'
},
{
  title: '开始时间',
  dataIndex: 'start_time',
  key: 'start_time',
  width: '15%'
}, {
  title: '结束时间',
  dataIndex: 'end_time',
  key: 'end_time',
  width: '15%'
}, {
  title: '状态',
  dataIndex: 'join',
  key: 'join',
  width: '10%',
  render (text, record) {
    return record.join == 0 ? '未参加' : '已参加'
  }
}, {
  title: '操作',
  dataIndex: 'opt',
  key: 'opt',
  width: '20%',
  render: (text, record, index) => {
    return (<Link to={`promo/${record.id}`}>查看</Link>)
  }
},
]

class PromosIndex extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <Row className="content-wrapper">
      <Col span={22} offset={1}><Table rowKey='id' className="promos-table" bordered columns={columns} dataSource={this.props.promos.list} pagination={false}/></Col>
    </Row>
  }
}
PromosIndex.propTypes = {
  promos: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ promos, loading }) => ({ promos, loading }))(PromosIndex)
