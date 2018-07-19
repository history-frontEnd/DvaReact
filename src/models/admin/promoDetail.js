import pathToRegexp from 'path-to-regexp'
import { detail, join, cancelJoin } from '../../services/promos'
import { message } from 'antd'
export default {

  namespace: 'promoDetail',

  state: {
    data: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/promo/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'detail', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    * detail ({
      payload,
    }, { call, put }) {
      const res = yield call(detail, payload)
      if (res.succ) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: res.data,
          },
        })
      }
    },
    * join ({
      payload,
    }, { call, put, select }) {
      const res = yield call(join, payload)
      if (res.succ) {
        const { data } = yield select(_ => _.promoDetail)
        let record = Object.assign({}, data)
        record.join = 1
        yield put({
          type: 'update',
          payload: { data: record },
        })
        message.success('参加成功！')
      } else {
        message.error('加入失败！')
      }
    },
    * cancelJoin ({
      payload
    }, { call, put, select }) {
      const res = yield call(cancelJoin, payload)
      if (res.succ) {
        const { data } = yield select(_ => _.promoDetail)
        let record = Object.assign({}, data)
        record.join = 0
        yield put({
          type: 'update',
          payload: { data: record },
        })
        message.success('取消参加成功！')
      } else {
        message.success('取消参加失败！')
      }
    },
  },
  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
    update (state, { payload }) {
      return {
        ...state,
        data: payload.data
      }
    },
  },
}
