import nprogressDva from './middlewares/nprogress-dva'
import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true
  }),
  history: createHistory(),
  onError (error) {
    message.error(error.message)
  }
})

app.use(nprogressDva)

// 2. Model
app.model(require('./models/web/index'))

// 3. Router
app.router(require('./routes/web'))

// 4. Start
app.start('#app')
