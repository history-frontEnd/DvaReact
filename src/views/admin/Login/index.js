import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin } from 'antd'
import LoginTip from './LoginTip'
import { withRouter, routerRedux } from 'dva/router'
import styles from './LoginTip.less'
import qs from 'query-string'
import LoginForm from './LoginForm'
import {isUnifiedLogin} from 'utils/config'

class Login extends React.Component {
  componentDidMount () {
    isUnifiedLogin && this.isUseUnifiedLogic()
    // this.props.dispatch(routerRedux.push({ pathname: '/dashboard' }))
  }
  isUseUnifiedLogic () {
    let query = qs.parse(this.props.location.search)
    if (query && query.token) {
      this.props.dispatch({type: 'app/userLogin', payload: { token: query.token }}).then(() => {
        setTimeout(() => {
          this.props.dispatch(routerRedux.push({ pathname: '/dashboard' }))
        }, 2000)
      })
    } else {
      this.props.dispatch({type: 'app/getOauthString'})
    }
  }
  login = (payload) => {
    this.props.dispatch({
      type: 'login/submit',
      payload
    })
  }
  chooseRender () {
    return isUnifiedLogin ? <div className={styles.spin}>
      <Spin tip="加载用户信息..." spinning={false} size="large">
        <LoginTip />
      </Spin>
    </div> : <LoginForm onOk={this.login}/>
  }
  render () {
    console.log(this.props)
    return this.chooseRender()
  }
}
Login.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default withRouter(connect(({login}) => ({login}))(Login))
