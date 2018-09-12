/**
 * Created by zhoujie on 2018/8/17.
 * 医院及行政table一级表格columns
 */
import React from 'react'
import {Checkbox, Popconfirm, Tooltip, Row, Divider} from 'antd'
const confirm = () => {}
const cancel = () => {}
const getOriginationOrDepartmentColumns = (editHos, addHosOffice, resetOrgState) => {
  return [
    {
      title: '机构名称',
      dataIndex: 'org_fullname',
      key: 'org_fullname'
    },
    {
      title: '机构扩展名',
      dataIndex: 'org_extendname',
      key: 'org_extendname'
    },
    {
      title: '机构编码',
      dataIndex: 'org_code',
      key: 'org_code'
    },
    {
      title: '机构所在地',
      dataIndex: 'org_localname',
      key: 'org_localname'
    },
    {
      title: '状态',
      dataIndex: 'org_state',
      key: 'org_state',
      render: (text, record) => {
        return <Popconfirm title="是否确认禁用该医院?" onConfirm={() => resetOrgState(record)} onCancel={cancel} okText="是" cancelText="否"><Checkbox checked={text}>{text ? '启用' : '禁用' }</Checkbox></Popconfirm>
      }
    },
    {
      title: '操作',
      dataIndex: 'case_org',
      key: 'case_org',
      render: (text, record) => {
        return <Row><a onClick={() => editHos(record)}>编辑</a><Divider type="vertical"/><a onClick={() => addHosOffice(true, record)}>新建科室</a></Row>
      }
    }
  ]
}

module.exports = getOriginationOrDepartmentColumns
