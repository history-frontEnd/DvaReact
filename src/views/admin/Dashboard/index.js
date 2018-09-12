import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import './index.less'

class Dashboard extends React.Component {
  componentDidUpdate () { console.log('Dashboard upldated') }

  render () {
    return (
      <Row gutter={24}>
        <Col span={24}>
          <div style={{textAlign: 'center', marginTop: '200px'}}> 欢迎来到基础服务平台 </div>
        </Col>
      </Row>
    )
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
