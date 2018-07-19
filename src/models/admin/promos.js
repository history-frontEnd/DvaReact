import modelExtend from 'dva-model-extend'
import { pageModel } from './extend'

export default modelExtend(pageModel, {
  namespace: 'promos',
  state: {
    list: []
  },
  reducers: {},
  subscriptions: {},
  effects: {}
})
