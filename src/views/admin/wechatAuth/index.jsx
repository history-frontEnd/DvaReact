import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Row, Col } from 'antd'

let data = []
class WechatAuth extends React.Component {
  constructor (props) {
    super(props)
  }
  auth = () => {
    location.href = this.props.app.user.authUrl
  }
  render () {
    return <Row span="24" style={{marginTop: '200px', textAlign: 'center'}}>
      <Button type="primary" size="large" onClick={this.auth}> 点击进行微信认证 </Button>
    </Row>
  }
}
WechatAuth.propTypes = {
  app: PropTypes.object,
  wechatAuth: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ wechatAuth, app, loading }) => ({ wechatAuth, app, loading }))(WechatAuth)
