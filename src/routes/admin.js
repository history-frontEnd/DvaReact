import React from 'react'
import PropTypes from 'prop-types'
import {Redirect, Route, routerRedux, Switch} from 'dva/router'
import dynamic from 'dva/dynamic'
import Admin from 'views/admin/App'

const {ConnectedRouter} = routerRedux
const Routers = function ({history, app}) {
  const routes = []
  routes.push({
    path: `/login`,
    models: () => [import(`../models/admin/login`)],
    component: () => import(`../views/admin/Login`)
  })
  routes.push({
    path: `/dashboard`,
    models: () => [ import(`../models/admin/dashboard`) ],
    component: () => import(`../views/admin/Dashboard`)
  })
  routes.push({
    path: `/userInfo/b`,
    models: () => [ import(`../models/admin/userInfo/userInfoModel`) ],
    component: () => import(`../views/admin/userInfo/bClient`)
  })

  return (
    <ConnectedRouter history={history}>
      <Admin>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard"/>)}/>
          {
            routes.map(({path, ...dynamics}, key) => (<Route key={key}
              exact
              path={path}
              component={dynamic({app, ...dynamics})}
            />))
          }
        </Switch>
      </Admin>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
}

export default Routers
