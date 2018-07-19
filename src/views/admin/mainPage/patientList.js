import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import getPatientlistColumns from '../../../tableColumns/patientList'
const PAGESIZE = 20
// const {TabPane} = Tabs
require('./index.scss')

class PatientList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      current: 1
    }
  }
  searchKeyFromTabList = (keyList, id) => {
    for (let i = 0; i < keyList.length; i++) {
      if (keyList[i] === id) {
        return true
      }
    }
    return false
  }
  updateTabs = (row) => {
    let {dispatch} = this.props
    let {keyList} = this.props.mainPageBody
    let {case_id, case_state} = row
    // 隔断引用关系
    let keyListClone = cloneDeep(keyList)
    let keyListClone2 = cloneDeep(keyList)
    let flag = keyListClone.indexOf(row.case_state)
    if (flag > -1) {
      keyListClone.splice(flag, 1)
      console.log('keyListClone:' + keyListClone)
      dispatch({
        type: 'mainPageBody/updateKeyList',
        payload: {
          keyList: keyListClone
        }
      })
    }
    // tabs中已存在更新patientDetails
    let result = this.searchKeyFromTabList(keyListClone2, case_state)
    if (!result) {
      // 更新keylist&activeKey
      keyListClone2.push(case_state)
    }
    // 获取病历详情
    dispatch({
      type: 'mainPageBody/getPatientDetails',
      payload: {
        id: case_id,
        keyList: keyListClone2,
        activeKey: case_state
      }
    })
    // 更新activeKey
    // dispatch({
    //   type: 'mainPageBody/updateKeyList',
    //   payload: {
    //     keyList: keyListClone,
    //     activeKey: case_state
    //   }
    // })
  }
  edit = (row) => {
    this.updateTabs(row)
  }
  getPatientList = (current) => {
    let {dispatch} = this.props
    dispatch({
      type: 'mainPageBody/getPatientList',
      payload: {
        page: current,
        pagesize: PAGESIZE
      }
    })
  }
  componentWillMount () {
    this.getPatientList(1)
  }
  render () {
    let {current} = this.state
    let {patientList} = this.props.mainPageBody
    // console.log(111, patientList)
    let {total, pageCount, pageNo, data} = patientList
    const pagination = {
      total: total,
      onChange: (current) => {
        //  pageIndex current
        this.getPatientList(current)
        this.setState({current})
      },
      showTotal: (totalCount) => `共${totalCount}条记录 第${pageNo}/${pageCount}页`,
      pageSize: PAGESIZE,
      // showQuickJumper: true,
      defaultCurrent: 1,
      current
    }
    return (
      <Table className="patient-table"
        rowKey={record => record.case_id}
        dataSource={data}
        columns={getPatientlistColumns(this.edit)}
        pagination = {pagination}
        size='small'/>
    )
  }
}

PatientList.propTypes = {
  mainPageBody: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ mainPageBody, loading }) => ({ mainPageBody, loading }))(PatientList)
