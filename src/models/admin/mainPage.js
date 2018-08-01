import modelExtend from 'dva-model-extend'
import {model} from './extend'
import {message} from 'antd'
import {getImgList, getPatientDetails, getPatientList, savePatientDetails} from '../../services/admin/patientList'

export default modelExtend(model, {
  namespace: 'mainPageBody',
  state: {
    activeKey: '2',
    keyList: ['2'],
    patientList: {
      data: [],
      pageCount: 1,
      pageNo: 1,
      pageSize: 50
    },
    patientDetails: {},
    imgList: [], //  编辑的imglist
    readonlyImgList: []// 只读的imglist
  },
  reducers: {
    'patientList' (state, {payload: data}) {
      return {
        ...state,
        patientList: data
      }
    },
    'patientDetails' (state, {payload: data}) {
      return {
        ...state,
        patientDetails: data
      }
    },
    'readonlyPatientDetails' (state, {payload: data}) {
      return {
        ...state,
        readonlyPatientDetails: data
      }
    },
    'imgList' (state, {payload: data}) {
      return {
        ...state,
        imgList: data
      }
    },
    'readonlyImgList' (state, {payload: data}) {
      return {
        ...state,
        readonlyImgList: data
      }
    },
    'updateKeyList' (state, {payload: data}) {
      let result = Object.assign({}, state, {...data})
      return result
    }
  },
  subscriptions: {},
  effects: {
    * getPatientList ({
      payload
    }, {put, call, select, take}) {
      let resp = yield call(getPatientList, {
        page: payload.page,
        pagesize: payload.pagesize
      })
      let {code, data, message} = resp
      if (code === 200) {
        yield put({
          type: 'patientList',
          payload: data
        })
      } else {
        message.error(resp.message)
      }
    },
    * getPatientDetails ({
      payload
    }, {put, call, select, take}) {
      let {id, ...rest} = payload
      let resp = yield call(getPatientDetails, {
        id
      })
      let {code, data, message} = resp
      if (code === 200) {
        let {activeKey} = rest
        let detailsType = ''
        if (activeKey === '0') {
          detailsType = 'patientDetails'
        } else if (activeKey === '1') {
          detailsType = 'readonlyPatientDetails'
        }
        // 保存病历详情
        yield put({
          type: detailsType,
          payload: data
        })
        // 更新keylist
        yield put({
          type: 'updateKeyList',
          payload: {
            ...rest
          }
        })
        // // 获取图片详情
        let imgResp = yield call(getImgList, {
          ids: data.images
        })
        let {code} = imgResp
        let reducerType = ''
        if (activeKey === '0') {
          reducerType = 'imgList'
        } else if (activeKey === '1') {
          reducerType = 'readonlyImgList'
        }
        if (code === 200) {
          yield put({
            type: reducerType,
            payload: imgResp.data
          })
        } else {
          message.error(imgResp.message)
        }
      } else {
        message.error(resp.message)
      }
    },
    * savePatientDetails ({
      payload
    }, {put, call, select, take}) {
      let {images, ...rest} = payload
      let resp = yield call(savePatientDetails, {
        images: images.join(','),
        ...rest
      })
      let {code} = resp
      if (code === 200) {
        // 重新刷新
        let resp = yield call(getPatientList, {
          page: 1,
          pagesize: 20
        })
        let {code, data} = resp
        if (code === 200) {
          yield put({
            type: 'patientList',
            payload: data
          })
        }
        // 更新keylist
        yield put({
          type: 'updateKeyList',
          payload: {
            activeKey: '2'
          }
        })
        message.success('病历保存成功！')
      } else {
        message.error(resp.message)
      }
    },
    * getImgList ({
      payload
    }, {put, call, select, take}) {
      let resp = yield call(getImgList, {
        ...payload
      })
      let {code, data} = resp
      if (code === 200) {
        yield put({
          type: 'imgList',
          payload: data
        })
      } else {
        message.error(resp.message)
      }
    }
  }
})
