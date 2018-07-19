import 'themes/admin/index.scss'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
// import MainPageBody from './mainPage/index'
import { Layout } from 'antd'
// import { openPages } from 'utils/config'
const { Header, Content } = Layout

class Layouts extends React.Component {
  state = {
    collapsed: false,
    visible: false,
    silder: true
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  onVisibleChange = (visible) => {
    this.setState({
      visible: visible
    })
  }
  clickMenu = ({key}) => {
    if (key === 'logout') {
      this.props.dispatch({ type: 'app/logout' })
    }
  }
  componentDidMount () {
    // const mql = window.matchMedia('(max-width:769px)')
    // mql.addListener(this.responsiveHandler.bind(this))
    // this.responsiveHandler(mql)
  }

  render () {
    let { pathname } = this.props.location
    let showHeader = pathname === '/website' || pathname === '/'
    // pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    // if (openPages && openPages.includes(pathname) || pathname === '/wechatAuth') {
    //   return (this.props.children)
    // }
    return (<Layout className="layout-warp">
      <Header className="header" style={{display: showHeader ? 'none' : 'block'}}>
        {/* <img src={require('../../assets/img/mainpage-title.png')}/> */}
        <img src="https://biosan-saas.oss-cn-beijing.aliyuncs.com/heart/body-title.png"/>
      </Header>
      <Content>
        {this.props.children}
      </Content>
    </Layout>)
  }
}

Layouts.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(Layouts))
