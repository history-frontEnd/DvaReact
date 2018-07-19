import modelExtend from 'dva-model-extend'
import { model } from '../admin/extend'
import { routerRedux } from 'dva/router'
import {
  login,
  upload,
  getImages,
  getImage,
  submitCase,
  getOssPolicy,
  addImage
} from 'services/web/login'
import { message } from 'antd'

// {id: 'f7f9ec90267d487498610eda9dfa0ab01', url: 'https://oss.biosan.cn/CHD/20180715/d2e7e0d3fd2341b1b1d1e2e351ff4096/1531294913.png?x-oss-process=image/resize,w_100'},
export default modelExtend(model, {
  namespace: 'login',
  state: {
    imageList: []
  },
  reducers: {},
  subscriptions: {
  },
  effects: {
    * login ({ payload }, { put, call, select, take }) {
      if (!payload.userMobile || !payload.userMobile.length) {
        message.error('手机号不能为空~')
        return
      }
      if (!payload.userPassword || !payload.userPassword.length) {
        message.error('密码不能为空~')
        return
      }
      const res = yield call(login, {
        mobile: payload.userMobile,
        pwd: payload.userPassword
      })
      if (res.message === 'SUCCESS') {
        localStorage.setItem('token', res.data)
        yield put(routerRedux.push('/uploader'))
      } else {
        message.error(res.message || '登录失败~')
      }
    },
    * getOssPolicy ({ payload }, { put, call, select, take }) {
      yield put({ type: 'app/updateState', payload: { pin: true } })
      let res = yield call(getOssPolicy, payload)
      yield put({ type: 'app/updateState', payload: { pin: false, oss: res.data } })
    },
    * addImage ({ payload }, { put, call, select, take }) {
      yield call(addImage, payload)
      let res = yield call(getOssPolicy, {})
      yield put(routerRedux.push(`/list/${payload.fileid}`))
      yield put({ type: 'app/updateState', payload: { pin: false, oss: res.data } })
    },
    * setImageList ({ payload }, { put, call, select, take }) {
      yield call(addImage, {
        fileid: payload.oss.fileid,
        filename: payload.file.name,
        filepath: payload.oss.dir,
        content_type: 'image/jpg'
      })
      let res = yield call(getOssPolicy, {})
      yield put({ type: 'getImages', payload: [payload.oss.fileid] })
      yield put({ type: 'app/updateState', payload: { pin: false, oss: res.data } })
    },
    * submitCase ({ payload }, { put, call, select, take }) {
      yield put({ type: 'app/updateState', payload: { pin: true } })
      let res = yield call(submitCase, payload)
      if (res.message === 'SUCCESS') {
        yield put({ type: 'app/updateState', payload: { pin: false } })
        yield put({
          type: 'update',
          payload: {
            imageList: []
          }
        })

        yield put(routerRedux.push('/succ'))
      } else {
        yield put({ type: 'app/updateState', payload: { pin: false } })
        message.error(res.message || '上传失败～')
      }
    },
    * getImages ({ payload }, { put, call, select, take }) {
      const { imageList } = yield select(_ => _.login)
      let res, imgs
      if (payload.length === 1) {
        res = yield call(getImage, payload[0])
        if (res.message === 'SUCCESS') imgs = [{id: payload[0], url: res.data.imageThumbnailUrl}]
      } else {
        res = yield call(getImages, payload)
        if (res.message === 'SUCCESS') imgs = res.data
      }
      if (res.message === 'SUCCESS') {
        yield put({
          type: 'update',
          payload: {
            imageList: imageList.concat(imgs)
          }
        })
      }
    },
    * upload ({ payload }, { put, call, select, take }) {
      const res = yield call(upload, payload)
      console.log(res)
      // yield put(routerRedux.push('/uploader'))
    }
  }
})
