import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
// import { Row, Col } from 'antd'
import PreviewPicture from '../../commonComps/previewPicture'
import EditPatientForm from './editPatientForm'
import ReadonlyDetails from './readonlyDetails'
require('./index.scss')

class EditPatient extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }
  getCorrectPatientDetails () {
    let {patientDetails, activeKey, readonlyPatientDetails} = this.props.mainPageBody
    let resultList = {}
    if (activeKey === '0') {
      resultList = patientDetails
    } else if (activeKey === '1') {
      resultList = readonlyPatientDetails
    }
    return resultList
  }
  chooseDynamic = () => {
    let {activeKey} = this.props.mainPageBody
    // let {info} = patientDetails
    let {info} = this.getCorrectPatientDetails()
    if (activeKey === '0') {
      return <EditPatientForm info={info}/>
    } else if (activeKey === '1') {
      return <ReadonlyDetails info={info}/>
    } else {
      return null
    }
  }
  render () {
    let data = this.props.mainPageBody
    let {activeKey} = this.props.mainPageBody
    const prev_props = {
      imageList: data && data.imgList,
      readonlyImgList: data && data.readonlyImgList,
      activeKey
    }
    return (<div className="editpatient-warp">
      {/* 图片预览组件 */}
      <PreviewPicture {...prev_props}/>
      {
        this.chooseDynamic()
      }
    </div>
    )
  }
}

EditPatient.propTypes = {
  mainPageBody: PropTypes.object,
  info: PropTypes.object
}

export default connect(({ mainPageBody, loading }) => ({ mainPageBody, loading }))((EditPatient))
