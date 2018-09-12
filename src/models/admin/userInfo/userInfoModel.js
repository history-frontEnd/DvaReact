import modelExtend from 'dva-model-extend'
import {model} from '../extend'
import {getBClientUsers, filterBClientUsers, getOrgList,
  createBUser, getBUserDetails, saveBClient, bClientEnable,
  userSystemAndRole, editUserRole, getUserRoleWithSystemType,
  getCUserFilter, resetPassword} from 'services/admin/userInfo/userService'
import {MESSAGE} from 'utils/toast'
import {PAGESIZE} from 'utils/config'

export default modelExtend(model, {
  namespace: 'userInfo',
  state: {
    newUserInfoSubmit: {usermobile: '', areaid: '', username: '', orgname: ''},
    newCUserInfoSubmit: {user_mobile: '', app_name: ''},
    bClientUserList: null,
    cClientUserList: null,
    orgList: null,
    bUserDetails: null,
    userSystemAndRole: null,
    userSelectedRole: null,
    deptList: null
  },
  reducers: {
    updateNewUserInfo (state, {payload}) {
      return {
        ...state,
        newUserInfoSubmit: {
          ...state.newUserInfoSubmit,
          ...payload
        }
      }
    },
    updateCUserInfo (state, {payload}) {
      return {
        ...state,
        newCUserInfoSubmit: {
          ...state.newCUserInfoSubmit,
          ...payload
        }
      }
    },
    updatebClientUserList (state, {payload}) {
      return {
        ...state,
        bClientUserList: payload
      }
    },
    updatebcClientUserList (state, {payload}) {
      return {
        ...state,
        cClientUserList: payload
      }
    },
    updateOrgList (state, {payload}) {
      return {
        ...state,
        orgList: payload
      }
    },
    updateBUserDetails (state, {payload}) {
      return {
        ...state,
        bUserDetails: payload
      }
    },
    updateUserSystemAndRole (state, {payload}) {
      return {
        ...state,
        userSystemAndRole: payload
      }
    },
    updateUserSelectedRole (state, {payload}) {
      return {
        ...state,
        userSelectedRole: payload
      }
    },
    updateDeptList (state, {payload}) {
      return {
        ...state,
        deptList: payload
      }
    }
  },
  effects: {
    * effs_getBClientUsers ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(getBClientUsers, {...payload})
      let {code, data, message, result} = resp
      if (result === 'success') {
        yield put({
          type: 'updatebClientUserList',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_filterBClientUsers ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(filterBClientUsers, {...payload})
      let {code, data, message, result} = resp
      if (result === 'success') {
        yield put({
          type: 'updatebClientUserList',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_getCUserFilter ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(getCUserFilter, {...payload})
      let {code, data, message, result} = resp
      if (result === 'success') {
        yield put({
          type: 'updatebcClientUserList',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_getOrgList ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(getOrgList, {...payload})
      let {code, data, message, result} = resp
      if (result === 'success') {
        yield put({
          type: 'updateOrgList',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_createBuser ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(createBUser, {...payload})
      let {result, message} = resp
      if (result === 'success') {
        // 刷新table
        let userInfo = yield select(state => state.userInfo)
        yield put({
          type: 'effs_filterBClientUsers',
          payload: {
            ...userInfo.newUserInfoSubmit,
            pageSize: PAGESIZE,
            pageNum: 1
          }
        })
      } else {
        MESSAGE.error(message)
        // Promise.reject(message)
      }
      return result
    },
    * effs_getBUserDetails ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(getBUserDetails, {...payload})
      let {result, message, data} = resp
      let {area_id, org_type, org_id} = data
      if (result === 'success') {
        yield put({
          type: 'updateBUserDetails',
          payload: data
        })
        // if (!Array.isArray(userOrgIds) || userOrgIds.length === 0) {
        //   MESSAGE.error('机构所在地异常！')
        //   return
        // }
        // 获取所在地机构列表
        let dept = yield call(getOrgList, {areaid: area_id, orgtype: org_type})
        let deptList = dept.data.queryItem({field: 'value', value: org_id})
        if (dept.result === 'success') {
          yield put({
            type: 'updateDeptList',
            payload: deptList.children
          })
        }
        // yield put({
        //   type: 'effs_getOrgList',
        //   payload: {
        //     areaid: area_id,
        //     orgtype: org_type
        //   }
        // })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_saveBClient ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(saveBClient, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        // 刷新table
        let userInfo = yield select(state => state.userInfo)
        yield put({
          type: 'effs_filterBClientUsers',
          payload: {
            ...userInfo.newUserInfoSubmit,
            pageSize: PAGESIZE,
            pageNum: 1
          }
        })
        MESSAGE.success('保存成功！')
      } else {
        MESSAGE.error(message)
      }
      return Promise[result === 'success' ? 'resolve' : 'reject'](message)
    },
    * effs_bClientEnable ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(bClientEnable, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        // 刷新table
        let userInfo = yield select(state => state.userInfo)
        yield put({
          type: 'effs_filterBClientUsers',
          payload: {
            ...userInfo.newUserInfoSubmit,
            pageSize: PAGESIZE,
            pageNum: 1
          }
        })
        MESSAGE.success(`${payload.user_state === '0' ? '禁用' : '启用'} 成功！`)
      } else {
        MESSAGE.error(message)
      }
      return result
    },
    * effs_userSystemAndRole ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(userSystemAndRole, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        yield put({
          type: 'updateUserSystemAndRole',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
      return result
    },
    * effs_editUserRole ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(editUserRole, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        MESSAGE.success('角色授权成功！')
      } else {
        MESSAGE.error(message)
      }
      return result
    },
    * effs_getUserRoleWithSystemType ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(getUserRoleWithSystemType, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        yield put({
          type: 'updateUserSelectedRole',
          payload: data
        })
      } else {
        MESSAGE.error(message)
      }
    },
    * effs_resetPassword ({
      payload
    }, { put, call, select, take }) {
      let resp = yield call(resetPassword, {...payload})
      let {result, message, data} = resp
      if (result === 'success') {
        MESSAGE.success('密码已初始化！')
      } else {
        MESSAGE.error(message)
      }
      return Promise[result === 'success' ? 'resolve' : 'reject'](message)
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {},
  },
})
