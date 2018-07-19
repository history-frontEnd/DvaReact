import modelExtend from 'dva-model-extend'
import { model } from './extend'

export default modelExtend(model, {
  namespace: 'statistics',
  state: { section: [] },
  subscriptions: {},
  effects: {},
  reducers: {},
})
