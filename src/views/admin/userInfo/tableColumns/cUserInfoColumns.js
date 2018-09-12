//  c端用户信息中心
import React from 'react'
const getCUserInfoColumns = (cb, editRole) => {
  return [{
    title: 'openid',
    dataIndex: 'openid',
    key: 'openid'
  }, {
    title: '手机号码',
    dataIndex: 'user_mobile',
    key: 'user_mobile'
  }, {
    title: 'appid',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '公众号/小程序名',
    dataIndex: 'app_name',
    key: 'app_name'
  }, {
    title: '微信昵称',
    dataIndex: 'case_role',
    key: 'case_role'
  }, {
    title: '登录时间',
    dataIndex: 'update_date_time',
    key: 'update_date_time'
  }]
}

module.exports = getCUserInfoColumns
