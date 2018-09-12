import { browserHistory } from 'react-router'
import Cookie from './cookie'
import {
  isPord,
  isDebug
} from 'utils/config'
import db from 'utils/db'

export menu from './menu'

export const Debug = (msg) => {
  if (!isDebug || isPord) {
    return
  }
  if (typeof (msg) === 'string') {
    console.log(' ====Debug====: ' + msg)
  } else {
    console.log(' ====Debug====: ')
    console.log(msg)
  }
}

export const routeEqual = (route1, route2) => {
  return route1.pathname === route2.pathname && route1.search === route2.search
}

export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNavList
  return list ? JSON.parse(list) : []
}

export const setTagNavListInLocalstorage = list => {
  localStorage.tagNavList = JSON.stringify(list)
}

export function equalSet (a, b) {
  const as = new Set(a)
  const bs = new Set(b)
  if (as.size !== bs.size) return false
  for (let ai of as) if (!bs.has(ai)) return false
  return true
}

export function needAddTagNavList (location) {
  return [
    '/',
    '/login'
  ].findIndex((pathname) => pathname === location.pathname) < 0
}

export function isEqualLocation (location1, location2) {
  return location1.pathname === location2.pathname
}

export function isHomeLocation (location) {
  return location.pathname === '/dashboard'
}

export function isLogin () {
  return Cookie.get('userSession') // && Cookie.get('userSession') > new Date().getTime()
}

export function hasGetUser () {
  return !!db.get('user')
}

export function setUser (user) {
  db.setUser(user)
}
export function setLoginIn (data) {
  const now = new Date()
  now.setDate(now.getDate() + 1)
  Cookie.set('userSession', now.getTime())
  Cookie.set('userToken', data.usertoken)
}

export function setLoginOut () {
  db.removeUser()
  Cookie.remove('userSession')
  Cookie.remove('userToken')
}
