import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import config from 'utils/config'
import { isLogin, isAuth, clearUser, setUser } from 'utils'
import { info } from 'services/login'
const menus = [
  // {
  //   id: '1',
  //   name: '授权管理',
  //   icon: 'safety',
  //   route: '/authorizations'
  // },
  {
    id: '1',
    name: '活动管理',
    icon: 'flag',
    route: '/promos'
  },
  {
    id: '2',
    name: '统计',
    icon: 'calculator',
    route: '/statistics'
  },
]
export default {
  namespace: 'app',
  state: {
    user: {},
    menus: menus,
    locationPathname: '',
    locationQuery: {}
  },
  reducers: {
    updateState (state : Object, { payload }:{payload: Object}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    * tongbu ({ _payload }, { put, call, select }) {
      const infoRes = yield call(info)
      if (infoRes.succ && infoRes.data) {
        if (infoRes.data.account_info) {
          yield put({ type: 'initUser', payload: infoRes.data })
        }
      } else {
        clearUser()
        yield put({ type: 'TONGBU_END' })
      }
    },
    * logout ({
      payload
    }, { put, call, select }) {
      clearUser()
      yield put(routerRedux.push('/website'))
    },
    * initUser ({ payload, }, { call, put, select }) {
      let user = {
        bindStatus: payload.bind_status,
        nickName: payload.account_info && payload.account_info.nick_name,
        authUrl: payload.auth_url,
        isCompleted: payload.is_completed,
        ...payload.account_info
      }
      setUser({
        login: true,
        bindStatus: payload.bind_status,
        nickName: payload.account_info && payload.account_info.nick_name,
        isCompleted: payload.is_completed,
      })
      console.log('===== init current user')
      yield put({ type: 'updateState', payload: { user } })
      yield put({ type: 'TONGBU_END' })
    },
    // if (location.pathname === '/website') {
    //   yield put(routerRedux.push({
    //     pathname: '/user',
    //   }))
    // }
    * init5in ({ payload, }, { call, put, select, take }) {
      console.log('====== is Auth')
      console.log(isAuth())
      const { locationPathname } = yield select(_ => _.app)
      console.log('====== current path')
      console.log(locationPathname)

      if (isLogin()) {
        yield put({ type: 'tongbu' })
        yield take('TONGBU_END')
      }
      if (config.openPages && config.openPages.indexOf(locationPathname) >= 0) {
        if (isAuth()) {
          yield put(routerRedux.push({ pathname: config.adminIndex }))
        } else {
          if (isLogin()) {
            locationPathname !== '/register' && (yield put(routerRedux.push({ pathname: '/register' })))
          } else {
            config.openPages.indexOf(locationPathname) < 0 && (yield put(routerRedux.push({ pathname: '/website' })))
          }
        }
      } else {
        if (!isAuth()) {
          yield put(routerRedux.push({ pathname: '/website', search: queryString.stringify({ from: locationPathname }) }))
        }
      }
    }
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {})
    },
    setup ({ dispatch }) {}
  }
}
