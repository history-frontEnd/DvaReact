//  b端用户信息中心
import React from 'react'
import {Checkbox, Popconfirm, Tooltip} from 'antd'
const confirm = () => {}
const cancel = () => {}
const getBUserInfoColumns = (cb, editRole, bClientEanle) => {
  return [{
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
    width: 100
  }, {
    title: '手机号码',
    dataIndex: 'usermobile',
    key: 'usermobile',
    width: 100,
    render: (text) => {
      return <Tooltip title={text}>
        <span>{text && (text.substring(0, 3) + '****' + text.substring(7, 11))}</span>
      </Tooltip>
    }
  },
  {
    title: '账号',
    dataIndex: 'useraccount',
    key: 'useraccount',
    width: 100,
  }, {
    title: '机构名称',
    dataIndex: 'orgfullname',
    key: 'orgfullname',
    width: 100,
  }, {
    title: '科室/部门名称',
    dataIndex: 'orgfullname_ks',
    key: 'orgfullname_ks',
    width: 100,
  }, {
    title: '子系统与角色',
    dataIndex: 'appRoles',
    key: 'appRoles',
    width: 100,
    render: (text, row) => {
      return <a onClick={() => editRole(row)}>{text && text.getCollection({field: 'typename'}).join(', ') || '尚未配置'}</a>
    }
  }, {
    title: '状态',
    dataIndex: 'userstate',
    key: 'userstate',
    width: 100,
    render: (text, row) => {
      return <Popconfirm title={`确定要${text === '0' ? '启用' : '禁用'}该用户吗`} onConfirm={() => bClientEanle(row)} onCancel={cancel} okText="Yes" cancelText="No">
        <Checkbox checked={text === '1'}>{text === '1' ? '启用' : '禁用' }</Checkbox>
      </Popconfirm>
    }
  }, {
    title: '操作',
    dataIndex: '',
    key: '',
    width: 80,
    render: (text, row) => {
      return <a onClick={() => cb(row)}>编辑</a>
    }
  }]
}

module.exports = getBUserInfoColumns
