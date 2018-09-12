import { routerRedux } from 'dva/router'
import {
  getTagNavListFromLocalstorage,
  setTagNavListInLocalstorage,
  needAddTagNavList,
  hasGetUser,
  setLoginIn,
  setLoginOut,
  setUser,
  isLogin,
  Debug
} from 'utils'
import {
  message
} from 'antd'
import db from 'utils/db'
import qs from 'query-string'
import {
  getOauthString,
  unifiedUserLogin,
  getUser
} from 'services/admin/common'
import {
  appid,
  secret,
  oauthUrl
} from 'utils/config'

export default {
  namespace: 'app',
  state: {
    globalLoading: false,
    user: db.getUser() || { user_name: '' },
    menuPopoverVisible: false,
    siderFold: localStorage.getItem('antdAdminSiderFold') === 'true',
    darkTheme: localStorage.getItem('antdAdminDarkTheme') !== 'false',
    isNavbar: document.body.clientWidth < 769,
    tagNavList: JSON.parse(localStorage.getItem('tagNavList') || '[]'),
    navOpenKeys: JSON.parse(localStorage.getItem('navOpenKeys') || '[]'), // 侧边栏菜单打开的keys,
    curPowers: [],
  },
  subscriptions: {
    setup ({ history, dispatch }) {
      Debug(`user is login: ${isLogin()}`)
      if (!isLogin()) {
        if (history.location.pathname !== '/login') {
          history.push('/login')
        }
      }
      window.onresize = function () {
        dispatch({ type: 'changeNavbar' })
      }

      history.listen((location) => {
        if (history.location.pathname !== '/login') {
          if (!hasGetUser()) {
            dispatch({ type: 'getCurrentUser' })
          }
          if (needAddTagNavList(location)) {
            dispatch({ type: 'addTagNavList', payload: { newRoute: location } })
          }
        }
      })
      return () => {}
    }
  },
  effects: {
    * getCurrentUser ({ payload }, { call, put }) {
      const resp = yield call(getUser)
      if (resp.result === 'success') {
        setUser(resp.data)
        yield put({ type: 'updateState', payload: {user: resp.data} })
      } else {
        message.error(resp.message || '当前用户获取失败~')
      }
    },
    * userLogin ({ payload }, { call, put }) {
      const resp = yield call(unifiedUserLogin, {
        appid,
        token: payload.token
      })
      if (resp.result === 'success') {
        setLoginIn({ usertoken: resp.data })
        yield put({ type: 'loginSuccess' })
      } else {
        message.error(resp.message || '登录失败~')
      }
    },
    * getOauthString ({}, { call, put }) {
      const resp = yield call(getOauthString, {
        appid,
        secret
      })
      if (resp.result === 'success') {
        location.href = oauthUrl + resp.data
      } else {
        message.error(resp.message || '登录失败~')
      }
    },
    * logout ({}, { put }) {
      setLoginOut()
      yield put({ type: 'logoutSuccess' })
      yield put(routerRedux.push({
        pathname: '/login',
        state: { nextPathname: location.pathname, nextSearch: location.search },
      }))
    },
    * addTagNavList ({ payload }, { call, put, select }) {
      let tagNavList = yield select((state) => state.app.tagNavList || [])
      let newList = [...tagNavList]
      if (newList.findIndex((item) => {
        return item.pathname === payload.newRoute.pathname
      }) < 0) {
        newList.push(payload.newRoute)
      }
      yield put({ type: 'setTagNavList', payload: {list: newList} })
    },
    * setTagNavList ({ payload }, { call, put, select }) {
      if (payload && payload.list) {
        yield put({ type: 'changeTagNavList', payload })
        setTagNavListInLocalstorage([...payload.list])
      } else {
        yield put({ type: 'changeTagNavList', payload: { list: getTagNavListFromLocalstorage() } })
      }
    },
    * hideLoading ({}, {put}) { yield put({ type: 'updateState', payload: {globalLoading: false} }) },
    * showLoading ({}, {put}) { yield put({ type: 'updateState', payload: {globalLoading: true} }) },
    * updateState ({ payload }, { call, put }) {
      yield put({ type: 'update', payload })
    }
  },
  reducers: {
    changeTagNavList (state, action) {
      return { ...state, tagNavList: action.payload.list }
    },
    loginSuccess (state, action) {
      return { ...state, ...action.payload, login: true }
    },
    logoutSuccess (state) {
      return { ...state, login: false, userPower: {}, curPowers: [] }
    },
    switchSider (state) {
      localStorage.setItem('antdAdminSiderFold', !state.siderFold)
      return { ...state, siderFold: !state.siderFold }
    },
    changeTheme (state) {
      localStorage.setItem('antdAdminDarkTheme', !state.darkTheme)
      return { ...state, darkTheme: !state.darkTheme }
    },
    changeNavbar (state) {
      return { ...state, isNavbar: document.body.clientWidth < 769 }
    },
    switchMenuPopver (state) {
      return { ...state, menuPopoverVisible: !state.menuPopoverVisible }
    },
    handleNavOpenKeys (state, action) {
      return { ...state, ...action.payload }
    },
    changeCurPowers (state, action) {
      return { ...state, ...action.payload }
    },
    update (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  }
}
