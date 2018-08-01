import React from 'react'
import PropTypes from 'prop-types'
import {Redirect, Route, routerRedux, Switch} from 'dva/router'
import dynamic from 'dva/dynamic'
import Admin from '../views/admin/layout'

const {ConnectedRouter} = routerRedux
const Routers = function ({history, app}) {
  const routes = []
  routes.push({
    path: `/website`,
    models: () => [import(`../models/admin/website`)],
    component: () => import(`../views/admin/website`)
  })
  routes.push({
    path: `/promos`,
    models: () => [import(`../models/admin/mainPage`)],
    component: () => import(`../views/admin/mainPage`)
  })

  return (
    <ConnectedRouter history={history}>
      <Admin>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/website"/>)}/>
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
