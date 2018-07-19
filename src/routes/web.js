import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import Web from '../views/web/Index'
const { ConnectedRouter } = routerRedux
const Routers = function ({ history, app }) {
  const routes = []
  routes.push({
    path: `/login`,
    models: () => [import(`../models/web/login`)],
    component: () => import(`../views/web/login`)
  })
  routes.push({
    path: `/uploader`,
    models: () => [import(`../models/web/login`)],
    component: () => import(`../views/web/uploader`)
  })
  routes.push({
    path: `/list/:firstImgId`,
    models: () => [import(`../models/web/login`)],
    component: () => import(`../views/web/uploader/list`)
  })
  routes.push({
    path: `/succ`,
    models: () => [import(`../models/web/login`)],
    component: () => import(`../views/web/uploader/succ`)
  })
  return (
    <ConnectedRouter history={history}>
      <Web>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/login" />)} />
          {routes.map(({ path, ...dynamics }, key) => (<Route key={key}
            exact
            path={path}
            component={dynamic({ app, ...dynamics })}
          />))}
        </Switch>
      </Web>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
}

export default Routers
