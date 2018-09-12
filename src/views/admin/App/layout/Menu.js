import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
// import Immutable from 'immutable'
import { menu } from 'utils'
// const immutableMenu = Immutable.fromJS(menu)
function Menus ({ siderFold, darkTheme, location, handleClickNavMenu, navOpenKeys, userPower, changeOpenKeys }) {
  const topMenus = menu.map(item => item.key)

  const getMenus = (menuArray, isSiderFold, parentPath = '/') => {
    return menuArray.map((item) => {
      const linkTo = parentPath + item.key
      if (item.children) {
        return (
          <Menu.SubMenu key={linkTo} title={<span>{item.icon ? <Icon type={item.icon} /> : ''} {isSiderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name} </span>}>
            {getMenus(item.children, isSiderFold, `${linkTo}/`)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={linkTo}>
          <Link to={linkTo}>
            {item.icon ? <Icon type={item.icon} /> : ''}
            {isSiderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
          </Link>
        </Menu.Item>
      )
    })
  }

  const getMenusByPower = (menuArray) => {
    return menuArray.reduce((array, item) => {
      // if (!userPower[item.id] || !item.power.find(cur => cur === 1)) {
      //   return array
      // }
      // const hasPower = !!userPower[item.id].find(cur => cur === 1) // cur == 1：菜单查看权限
      // if (item.children) {
      //   if (hasPower) {
      //     item.children = getMenusByPower(item.children)
      //     array.push(item)
      //   }
      // } else {
      //   hasPower && array.push(item)
      // }
      array.push(item)
      return array
    }, [])
  }

  const menuPower = getMenusByPower(menu)
  const menuItems = getMenus(menuPower, siderFold)

  const getAncestorKeys = (key) => {
    const map = {
      '/navigation/navigation2': ['/navigation'],
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    // if (navOpenKeys.length) {
    //   changeOpenKeys([])
    // }
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  // 菜单栏收起时，不能操作openKeys
  // let menuProps = {
  //   onOpenChange,
  //   openKeys: navOpenKeys,
  // }
  let defaultSelectedKeys = []
  if (/\/dashboard/.test(location.pathname)) {
    defaultSelectedKeys.push('/dashboard')
  } else {
    defaultSelectedKeys = navOpenKeys.concat(location.pathname)
  }
  let menuProps = !siderFold ? {
    onOpenChange,
    defaultSelectedKeys,
    openKeys: navOpenKeys,
  } : {}
  return (
    <Menu
      key='1'
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      inlineCollapsed={ siderFold }
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
  userPower: PropTypes.object,
}

export default Menus
