/**
 * Created by zhoujie on 2018/8/17.
 * 医院及行政table一级表格columns
 */
import React from 'react'
import {Checkbox, Popconfirm, Tooltip} from 'antd'
const confirm = () => {}
const cancel = () => {}
const getHosOfficeColumns = (editHosOffice, resetOfficeState) => {
  return [
    {
      title: '科室名',
      dataIndex: 'org_fullname',
      key: 'org_fullname'
    },
    {
      title: '诊疗科目',
      dataIndex: 'treat_allname',
      key: 'treat_allname'
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
        return <Popconfirm title="是否确认禁用该科室?" onConfirm={() => resetOfficeState(record)} onCancel={cancel} okText="是" cancelText="否"><Checkbox checked={text}>{text ? '启用' : '禁用' }</Checkbox></Popconfirm>
      }
    },
    {
      title: '操作',
      dataIndex: 'case_hosOffice',
      key: 'case_hosOffice',
      render: (text, record) => {
        return <a onClick={() => editHosOffice(record)}>编辑</a>
      }
    }
  ]
}

module.exports = getHosOfficeColumns
