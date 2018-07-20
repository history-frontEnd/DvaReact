import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { withRouter, routerRedux } from 'dva/router'
import 'themes/web/index.scss'
import { Spin } from 'antd'
// const { Header, Content, Sider } = Layout
// @withRouter
// @connect(({ app, loading }) => ({ app, loading }))
class Web extends React.Component {
  state = {};

  componentDidMount () {
    console.log('=== layout web Index ===')
  }

  render () {
    let { pathname } = this.props.location

    return (
      <div className="web-container">
        { this.props.app.pin && <div className="spin-mask">
            <Spin size="large" tip="请稍候..."/>
          </div>
        }
        {this.props.children}
      </div>
    )
  }
}
Web.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}
export default withRouter(connect(({ app, loading }) => ({ app, loading }))(Web))
