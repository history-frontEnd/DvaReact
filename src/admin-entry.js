import { message } from 'antd'
import nprogressDva from './middlewares/nprogress-dva'

import dva from 'dva'
import createLoading from 'dva-loading'
import createBrowserHistory from 'history/createBrowserHistory'
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true
  }),
  history: createBrowserHistory(),
  onError (error) {
    message.error(error.message)
  }
})

app.use(nprogressDva)

// 2. Model
app.model(require('./models/admin/app'))

// 3. Router
app.router(require('./routes/admin'))

// 4. Start
app.start('#root')
