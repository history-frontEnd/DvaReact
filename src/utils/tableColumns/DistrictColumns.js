//  地区名录表头
import React from 'react'
import {Checkbox, Popconfirm, Row, Divider} from 'antd'

const getDistrictColumns = (editDistrict, addAreaChild, changeAreaState) => {
  return [{
    title: '地区名称',
    dataIndex: 'area_fullname',
    key: 'area_fullname',
  }, {
    title: '地区编码',
    dataIndex: 'area_code',
    key: 'area_code',
  }, {
    title: '地区简称',
    dataIndex: 'area_name',
    key: 'area_name',
  }, {
    title: '等级',
    dataIndex: 'area_level',
    key: 'area_level',
  }, {
    title: '排序号',
    dataIndex: 'order_id',
    key: 'order_id',
  }, {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    render: (text, record) => {
      // return <Row><a onClick={() => editDistrict(record)}>编辑</a><Divider type="vertical"/><a onClick={() => newSubDistrict(record)}>新建次级地区</a></Row>
      let area_level = record.area_level
      if (area_level < 4) {
        return <Row><a onClick={() => editDistrict(record)}>编辑</a><Divider type="vertical"/><a onClick={() => addAreaChild(record)}>新建子科目</a></Row>
      } else {
        return <a onClick={() => editDistrict(record)}>编辑</a>
      }
    }
  }, {
    title: '状态',
    dataIndex: 'area_state',
    key: 'area_state',
    render: (text, record) => {
      return <Popconfirm title={'是否确认' + (text ? '禁用' : '启用') + '该地区?'} okText="是" cancelText="否" onConfirm={() => changeAreaState(record)}><Checkbox checked={text}>{text ? '启用' : '禁用' }</Checkbox></Popconfirm>
    }
  }]
}

module.exports = getDistrictColumns
