import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Tabs} from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import PatientList from './patientList'
import EditPatient from './editPatientContainer'

import './index.scss'

const {TabPane} = Tabs

class MainPageBody extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeKey: '2',
      defaultActiveKey: '2'
    }
  }

  click () {
    let {dispatch} = this.props
    dispatch({
      type: 'mainPageBody/delete',
      payload: 2
    })
  }

  onChange = (activeKey) => {
    console.log(`activeKey:${activeKey}`)
    let {dispatch} = this.props
    // 更新activeKey
    dispatch({
      type: 'mainPageBody/updateKeyList',
      payload: {
        activeKey
      }
    })
  }

  onEdit = (targetKey, action) => {
    let {dispatch} = this.props
    let {keyList} = this.props.mainPageBody
    let resultKeyList = cloneDeep(keyList)
    resultKeyList.splice(resultKeyList.indexOf(targetKey), 1)
    console.log(`after remove:${resultKeyList.join(',')}`)
    dispatch({
      type: 'mainPageBody/updateKeyList',
      payload: {
        activeKey: resultKeyList[0],
        keyList: resultKeyList
      }
    })
  }

  selectFromTablist (tabList, id) {
    for (let i = 0; tabList.length; i++) {
      let {key, content} = tabList[i]
      if (key === id) {
        return content
      }
    }
  }

  render () {
    let {defaultActiveKey} = this.state
    let {keyList, activeKey} = this.props.mainPageBody
    let tabList = [
      {
        key: '2',
        title: '病例列表',
        content: <TabPane tab="病例列表" key="2" className="firstPanelsss"><PatientList/></TabPane>
      },
      {
        key: '0',
        title: '编辑病历',
        content: <TabPane tab="编辑病历" key="0"><EditPatient/></TabPane>
      },
      {
        key: '1',
        title: '查看病历',
        content: <TabPane tab="查看病历" key="1"><EditPatient/></TabPane>
      }
    ]
    return (
      <Tabs defaultActiveKey={defaultActiveKey}
        onChange={this.onChange}
        activeKey={activeKey}
        type="editable-card"
        tabBarGutter={0}
        hideAdd={true}
        onEdit={this.onEdit}
        className="mainPage-tabs">
        {
          keyList.map(item => {
            return this.selectFromTablist(tabList, item)
          })
        }
      </Tabs>
    )
  }
}

MainPageBody.propTypes = {
  mainPageBody: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({mainPageBody, loading}) => ({mainPageBody, loading}))(MainPageBody)
