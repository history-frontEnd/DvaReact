//  病历列表
import React from 'react'
const getPatientlistColumns = (cb) => {
  return [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, row, index) => {
      return index + 1
    }
  }, {
    title: '医院',
    dataIndex: 'user_hospital',
    key: 'user_hospital',
  }, {
    title: '医生',
    dataIndex: 'user_name',
    key: 'user_name',
  }, {
    title: '类型',
    dataIndex: 'case_type',
    key: 'case_type',
    render: (text, row, index) => {
      if (text === 1) {
        return <span>儿童</span>
      } else if (text === 2) {
        return <span>孕妇</span>
      }
    }
  }, {
    title: '患者姓名',
    dataIndex: 'case_name',
    key: 'case_name',
  }, {
    title: '患者性别',
    dataIndex: 'case_sex',
    key: 'case_sex',
    render: (text, row, index) => {
      if (text === 1) {
        return <span >男</span>
      } else if (text === 2) {
        return <span>女</span>
      }
    }
  }, {
    title: '年龄',
    dataIndex: 'case_age',
    key: 'case_age'
  }, {
    title: '患者电话',
    dataIndex: 'case_mobile',
    key: 'case_mobile',
  }, {
    title: '上传日期',
    dataIndex: 'create_datetime',
    key: 'create_datetime',
  }, {
    title: '状态',
    dataIndex: 'case_state',
    key: 'case_state',
    render: (text, row, index) => {
      if (text === '0') {
        return <span style={{color: '#D0021B'}} className="unhandle">未处理</span>
      } else if (text === '1') {
        return <span>已处理</span>
      }
    }
  }, {
    title: '操作',
    dataIndex: '',
    key: '',
    render: (text, row, index) => {
      return <span className="column-edit" onClick={() => cb && cb(row)}>{row.case_state === '0' ? '编辑' : '查看'}</span>
    }
  }]
}

module.exports = getPatientlistColumns
