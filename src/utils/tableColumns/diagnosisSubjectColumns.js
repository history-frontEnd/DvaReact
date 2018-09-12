/**
 * Created by zhoujie on 2018/8/17.
 * 诊疗科目
 */
import React from 'react'
import { Popconfirm, Checkbox, Row, Divider } from 'antd'
const cancel = () => {}
const getDiagnosisSubjectColumns = (addTreatment, editTreatment, changeTreatmentState) => {
  return [
    {
      title: '诊疗科目名称',
      dataIndex: 'treat_fullname',
      key: 'treat_fullname',
      width: '24%'
    },
    {
      title: '诊疗科目编码',
      dataIndex: 'treat_code',
      key: 'treat_code',
      width: '18%'
    },
    {
      title: '状态',
      dataIndex: 'treat_state',
      key: 'treat_state',
      width: '40%',
      render: (text, record) => {
        return <Popconfirm title={'是否确认' + (text ? '禁用' : '启用') + '该诊疗科目?'} onConfirm={() => changeTreatmentState(record)} onCancel={cancel} okText="是" cancelText="否"><Checkbox checked={text}>{text ? '启用' : '禁用' }</Checkbox></Popconfirm>
      }
    },
    {
      title: '操作',
      dataIndex: 'case_diagnosis',
      key: 'case_diagnosis',
      width: '18%',
      render: (text, record) => {
        let treat_level = record.treat_level
        if (treat_level < 3) {
          return <Row><a onClick={() => editTreatment(true, record)}>编辑</a><Divider type="vertical"/><a onClick={() => addTreatment(true, record)}>新建子科目</a></Row>
        } else {
          return <a onClick={() => editTreatment(true, record)}>编辑</a>
        }
      }
    }
  ]
}

module.exports = getDiagnosisSubjectColumns
