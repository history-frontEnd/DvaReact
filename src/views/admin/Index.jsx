import 'themes/admin/index.scss'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {withRouter, routerRedux} from 'dva/router'
import {Layout, Menu, Icon, Breadcrumb, Popover} from 'antd'

import {openPages} from 'utils/config'

const {Header, Content, Sider} = Layout

// @withRouter
// @connect(({ app, loading }) => ({ app, loading }))
class Admin extends React.Component {
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

  returnItem (item) {
    const {dispatch, location} = this.props
    const {pathname} = location
    return <a onClick={() => {
      item.route && item.route !== pathname && this.setState({visible: false},
        dispatch(routerRedux.push({pathname: item.route})))
    }}>
      {item.icon && <Icon type={item.icon}/>}
      {item.name && <span> {item.name}</span>}
    </a>
  }

  renderBreadcrumb () {
    const {pathname} = this.props.location
    return [{icon: 'home'}].concat(this.props.app.menus.filter(menu => menu.route === pathname))
      .map((menu, idx) => <Breadcrumb.Item key={idx}>
        {this.returnItem(menu)}
      </Breadcrumb.Item>)
  }

  renderMenu () {
    const {pathname} = this.props.location
    const defaultKey = this.props.app.menus.filter(menu => menu.route === pathname).map(menu => menu.id)
    return <Menu mode="inline" defaultSelectedKeys={defaultKey}>{this.props.app.menus.map(menu => <Menu.Item
      key={menu.id}>
      {this.returnItem(menu)}
    </Menu.Item>)}</Menu>
  }

  responsiveHandler (mql) {
    this.setState({
      silder: !mql.matches
    })
  }

  clickMenu = ({key}) => {
    if (key === 'logout') {
      this.props.dispatch({type: 'app/logout'})
    }
  }

  componentDidMount () {
    const mql = window.matchMedia('(max-width:769px)')
    mql.addListener(this.responsiveHandler.bind(this))
    this.responsiveHandler(mql)
  }

  render () {
    let {pathname} = this.props.location
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    if (openPages && openPages.includes(pathname) || pathname === '/wechatAuth') {
      return (this.props.children)
    }

    return (
      <Layout>
        {this.state.silder && <Sider style={{background: '#fff'}} trigger={null} collapsible
          collapsed={this.state.collapsed}
          onCollapse={collapsed => this.setState({collapsed})}>
          <div className="title">{!this.state.collapsed ? '  开放平台' : ''}</div>
          {this.renderMenu()}
        </Sider>}
        <Layout>
          <Header>
            {this.state.silder
              ? <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}/>
              : <Popover placement="bottomLeft" trigger="click" overlayClassName="ant-menu-popover"
                onVisibleChange={this.onVisibleChange} visible={this.state.visible}
                content={this.renderMenu()}>
                <div className="trigger">
                  <Icon type="bars"/>
                </div>
              </Popover>
            }
            <Menu mode="horizontal" onClick={this.clickMenu}>
              <Menu.SubMenu title={
                <div className="user-menu">
                  <div className="user-img" style={{backgroundImage: `url(${this.props.app.user.head_img})`}}/>
                  <div className="user-info">
                    <span>{this.props.app.user && this.props.app.user.nickName}</span>
                    <div className="user-ids">
                      {this.props.app.user && this.props.app.user.account_type === '1' &&
                      <div className="info-tag tag-green" color="green">服务号</div> ||
                      <div className="info-tag tag-orange">订阅号</div>}
                      {this.props.app.user && this.props.app.user.verify_type === '1' &&
                      <div className="info-tag tag-red">已认证</div> || <div className="info-tag tag-grey">未认证</div>}
                    </div>
                  </div>
                </div>
              }>
                <Menu.Item key="logout">登出</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>
          <Content style={{margin: '14px 24px 0'}}>
            <Breadcrumb>{this.renderBreadcrumb()}</Breadcrumb>
            <div className="ant-view-content">
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

Admin.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default withRouter(connect(({app, loading}) => ({app, loading}))(Admin))
