/**
 * Created by zhoujie on 2018/8/17.
 * 行政二级表格columns
 */
import React from 'react'
import {Checkbox, Popconfirm, Tooltip} from 'antd'
const confirm = () => {}
const cancel = () => {}
const getAdministrativeOfficeColumns = (editAdmOffice, resetOfficeState) => {
  return [
    {
      title: '部门名',
      dataIndex: 'org_fullname',
      key: 'org_fullname'
    },
    {
      title: '邀请码',
      dataIndex: 'invite_code',
      key: 'invite_code'
    },
    {
      title: '状态',
      dataIndex: 'org_state',
      key: 'org_state',
      render: (text, record) => {
        return <Popconfirm title="是否确认禁用该部门?" onConfirm={() => resetOfficeState(record)} onCancel={cancel} okText="是" cancelText="否"><Checkbox checked={text}>{text ? '启用' : '禁用' }</Checkbox></Popconfirm>
      }
    },
    {
      title: '操作',
      dataIndex: 'case_hosOffice',
      key: 'case_hosOffice',
      render: (text, record) => {
        return <a onClick={() => editAdmOffice(record)}>编辑</a>
      }
    }
  ]
}

module.exports = getAdministrativeOfficeColumns
