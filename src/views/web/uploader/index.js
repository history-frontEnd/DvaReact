import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { host } from 'utils/config'
import { Upload, message } from 'antd'
require('./index.scss')

class Uploader extends React.Component {
  onFileChange ({ file, fileList }) {
    let { dispatch, app } = this.props
    dispatch({ type: 'app/updateState', payload: { pin: true } })
    if (file.status === 'done') {
      dispatch({
        type: 'login/addImage',
        payload: {
          fileid: app.oss.fileid,
          filename: file.name,
          filepath: app.oss.dir,
          content_type: 'image/jpg'
        }
      })
    }
    if (file.status === 'error') {
      dispatch({ type: 'app/updateState', payload: { pin: false } })
      message.error(`${file.name} 文件上传出错～`)
    }
  }
  componentDidMount () {
    this.props.dispatch({ type: 'login/getOssPolicy' })
  }
  render () {
    let oss = this.props.app.oss
    const props = {
      showUploadList: false,
      action: `http://biosan-saas.oss-cn-beijing.aliyuncs.com`,
      data: {
        key: oss.dir,
        policy: oss.policy,
        signature: oss.signature,
        OSSAccessKeyId: oss.accessid,
        success_action_status: '200'
      },
      accept: 'image/jpg,image/jpeg,image/png,image/bmp',
      onChange: this.onFileChange.bind(this)
    }
    return (
      <div className='uploader'>
        <div className="uploader-img"></div>

        <Upload {...props}>
          <div className="uploader-btn">上传病例</div>
        </Upload>
      </div>
    )
  }
}

Uploader.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
export default connect(({ loading, app }) => ({ loading, app }))(Uploader)
