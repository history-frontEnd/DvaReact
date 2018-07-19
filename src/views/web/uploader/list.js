import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Upload from 'antd/lib/upload'
import cloneDeep from 'lodash/cloneDeep'
import { Modal, message } from 'antd'
const confirm = Modal.confirm
require('./index.scss')
class List extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      item: null
    }
  }

  submitImgs () {
    let dispatch = this.props.dispatch
    let list = this.props.login.imageList
    let images = list.map((img) => {
      return img.id
    })
    if (images.length) {
      dispatch({ type: 'login/submitCase', payload: {images: images} })
    } else {
      message.error('至少要上传一张照片哦~')
    }
  }
  onFileChange ({ file, fileList }) {
    let { dispatch, app } = this.props
    dispatch({ type: 'app/updateState', payload: { pin: true } })
    if (file.status === 'done') {
      dispatch({ type: 'login/setImageList', payload: { file, oss: app.oss } })
    }
  }
  componentWillMount () {
    let { match } = this.props
    this.props.dispatch({ type: 'login/getImages', payload: [match.params.firstImgId] })
  }
  delete (items) {
    let {dispatch, login} = this.props
    let afterDelete = cloneDeep(login.imageList).filter(item => {
      return item.id !== items.id
    })
    dispatch({
      type: 'login/update',
      payload: {
        imageList: afterDelete
      }
    })
    this.closeBigBox()
  }
  showBigBox (item) {
    this.setState({
      item: item
    })
  }
  closeBigBox () {
    this.setState({
      item: null
    })
  }
  showConfirm (e) {
    e.stopPropagation()
    e.preventDefault()
    let self = this
    confirm({
      title: '确定删除?',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        self.delete(self.state.item)
      },
      onCancel () {
        console.log('Cancel')
      },
    })
  }

  render () {
    let list = this.props.login.imageList
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
      <div className='list'>

        <div className='img-list clearfix'>
          {
            list.map((item) => {
              let id = item.id
              return <div key={id} onClick={this.showBigBox.bind(this, item)} className='item' style={{backgroundImage: `url(${item.url})`}}> </div>
            })
          }
          {
            (list.length < 9) && <Upload {...props}>
              <div className='add-item item'>
                <div className='add-img'></div>
              </div>
            </Upload>
          }
        </div>
        { this.state.item && <div className="big-box" onClick={this.closeBigBox.bind(this)}>
          <img className="show-box" src={this.state.item.url} />
          <div className="box-operations">
            <div className="close-btn" onClick={this.closeBigBox.bind(this)}></div>
            <div className="delete-btn" onClick={this.showConfirm.bind(this)}></div>
          </div>
        </div>
        }
        <div className="uploader-btn" onClick={this.submitImgs.bind(this)}>提交</div>
      </div>
    )
  }
}

List.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
  loading: PropTypes.object,
  login: PropTypes.object,
  app: PropTypes.object,
}
export default connect(({ loading, login, app }) => ({ loading, login, app }))(List)
