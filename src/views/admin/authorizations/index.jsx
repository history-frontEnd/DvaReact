import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Tag, Table, Row, Col } from 'antd'

const columns = [{
  title: '第三方平台',
  dataIndex: 'principal_name',
  key: 'principal_name',
  width: '15%'
}, {
  title: '已授权权限',
  dataIndex: 'power',
  key: 'power',
  width: '50%',
  render: perms => {
    let tags = perms.map((perm, idx) => {
      return <Tag key={idx}>{perm}</Tag>
    })
    return tags
  }
}, {
  title: '授权时间',
  dataIndex: 'create_time',
  width: '10%',
  key: 'create_time'
}
]
let data = []
class AuthorizationsIndex extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return <Row className="content-wrapper">
      <Col span={22} offset={1}><Table rowKey='id' className='authorizations-table' bordered columns={columns} dataSource={this.props.authorizations.list} pagination={false}/></Col>
    </Row>
  }
}
AuthorizationsIndex.propTypes = {
  authorizations: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ authorizations, loading }) => ({ authorizations, loading }))(AuthorizationsIndex)
