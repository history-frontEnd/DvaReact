import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { withRouter, routerRedux } from 'dva/router'
import classnames from 'classnames'
import { Header, Bread, Footer, Sider, styles } from './layout'
import ReactLoading from 'react-loading'
import TagsNav from './layout/TagsNav'
import { forEach } from 'utils/tools'
import './skin.less'
import {
  menu,
  isLogin,
  isEqualLocation,
  isHomeLocation
} from 'utils'
class App extends React.Component {
  // FIXME: hot reload 时app会为空
  shouldComponentUpdate (nextProps) {
    if (!nextProps.app) return false
    return true
  }
  // componentWillUpdate (nextProps, nextState) {
  //   console.log(nextProps)
  //   console.log('componentWillUpdate')
  // }
  render () {
    let { children, location, dispatch, app = {} } = this.props
    const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, userPower, curPowers } = app

    const headerProps = {
      user,
      siderFold,
      location,
      isNavbar,
      menuPopoverVisible,
      navOpenKeys,
      userPower,
      switchMenuPopover () {
        dispatch({ type: 'app/switchMenuPopver' })
      },
      logout () {
        dispatch({ type: 'app/logout' })
      },
      switchSider () {
        dispatch({ type: 'app/switchSider' })
      },
      changeOpenKeys (openKeys) {
        localStorage.setItem('navOpenKeys', JSON.stringify(openKeys))
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
    }
    const siderProps = {
      siderFold,
      darkTheme,
      location,
      navOpenKeys,
      userPower,
      changeTheme () {
        dispatch({ type: 'app/changeTheme' })
      },
      changeOpenKeys (openKeys) {
        localStorage.setItem('navOpenKeys', JSON.stringify(openKeys))
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
    }
    const titleMap = (menu) => {
      let map = {}
      const mapFun = (menu, parentPath = '/') => {
        forEach(menu, (item) => {
          map[parentPath + item.key] = item.name
          if (item.children && item.children.length) {
            mapFun(item.children, parentPath + item.key + parentPath)
          }
        })
      }
      mapFun(menu)
      return map
    }
    const tagsNavProps = {
      list: app.tagNavList,
      titleMap: titleMap(menu),
      value: location,
      handleClick: (route) => {
        console.log('> handleClick')
        dispatch(routerRedux.push(route))
      },
      handleClose: (route) => {
        console.log('> handleClose')
        let navList = app.tagNavList
        let res = navList.filter(item => !isEqualLocation(item, route))
        let nextRoute
        if (navList.length === 2) {
          nextRoute = navList[navList.findIndex(item => isHomeLocation(item)) || 0]
        } else {
          if (isEqualLocation(route, location)) {
            const index = navList.findIndex(item => isEqualLocation(item, route))
            if (index === navList.length - 1) nextRoute = navList[navList.length - 2]
            else nextRoute = navList[index + 1]
          } else {
            nextRoute = location
          }
        }
        dispatch({ type: 'app/setTagNavList', payload: {list: res} })
        dispatch(routerRedux.push(nextRoute))
      },
      handleCloseAll: () => {
        console.log('> handleCloseAll')
        let navList = app.tagNavList
        let res = navList.filter(item => isHomeLocation(item))
        let nextRoute = navList[navList.findIndex(item => isHomeLocation(item)) || 0]
        dispatch({ type: 'app/setTagNavList', payload: {list: res} })
        dispatch(routerRedux.push(nextRoute))
      },
      handleCloseOthers: () => {
        console.log('> handleCloseOthers')
        let navList = app.tagNavList
        let res = navList.filter(item => isHomeLocation(item) || isEqualLocation(item, location))
        let nextRoute = navList[navList.findIndex(item => isEqualLocation(item, location)) || 0]
        dispatch({ type: 'app/setTagNavList', payload: {list: res} })
        dispatch(routerRedux.push(nextRoute))
      }
    }

    let pathname = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`
    if (location.pathname === '/login') {
      return children
    }
    return (
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
        {app.globalLoading && <div className='loading-wrapper'>
          <ReactLoading type={'bars'} color={'rgb(16, 142, 233)'} height={80} width={80} />
        </div>}

        {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          <Sider {...siderProps} />
        </aside> : ''}
        <div className={styles.main}>
          <Header {...headerProps} />
          <div className="tag-nav-wrapper">
            <TagsNav {...tagsNavProps} />
          </div>
          <div className={styles.container}>
            <div className={styles.content} id="warp">
              { children && React.cloneElement(children, { curPowers, key: location.pathname })}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default withRouter(connect(({ app }) => ({ app }))(App))
