import React from 'react'
import PropTypes from 'prop-types'
import { setSize } from 'utils/canvasExt.js'
import {
// _toFloatX,
  _fixedDrawSize,
  _fixedEdgePic,
  _fixedCenterPic
} from 'utils/fixPos'
require('./index.scss')
const TOOLBAR = ['prev', 'next', 'zz', 'yz', 'fd', 'sx']
class Picture extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.initCase()
    this.currentIndex = 0
  }
  initCase () {
    this.resPos = {
      sx: 0,
      sy: 0,
      sw: 0,
      sh: 0
    }
    this.drawPos = {
      dx: 0,
      dy: 0,
      dw: 0,
      dh: 0
    }
    this.imageRatio = undefined
    this.containerRatio = undefined
    this.imgRotation = 0
    this.scale = 1
    this.minScale = 0.5
    this.maxScale = 4
    this.fuckNum = 0
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.rotateEnable = true
    this.imgRotation = 0
  }
  imageListCount () {
    let resultList = this.getCorrectImgList()
    return resultList && resultList.length || 0
  }
  scaleOperator () {
    // this.props.imageList
    if (this.scale < 1) {
      this.scale = Math.max(this.scale, this.minScale)
      if (!this.rotateEnable) _fixedCenterPic.bind(this)('cover1')
    } else {
      this.scale = Math.min(this.scale, this.maxScale)
      if (!this.rotateEnable) _fixedEdgePic.bind(this)('cover1')
    }
    // this.drawCanvas()
    this.resource().onload = () => {
      this._drawImage()
    }
    // this._drawImage()
  }
  operator (item) {
    console.log(item)
    if (item === 'fd') {
      this.scale = this.scale + 0.1
      this.scaleOperator()
    }
    if (item === 'sx') {
      this.scale = this.scale - 0.1
      this.scaleOperator()
    }
    if (item === 'prev') {
      this.initCase()
      if (this.currentIndex === 0) {
        this.currentIndex = this.imageListCount() - 1
      } else {
        this.currentIndex = this.currentIndex - 1
      }
      this.setStat()
      this.drawCanvas()
    }
    if (item === 'next') {
      this.initCase()
      if (this.currentIndex === this.imageListCount() - 1) {
        this.currentIndex = 0
      } else {
        this.currentIndex = this.currentIndex + 1
      }
      this.setStat()
      this.drawCanvas()
    }
    // 逆时针
    if (item === 'zz') {
      this.imgRotation = this.imgRotation - 10 * Math.PI / 180
      this.drawCanvas()
    }
    // 顺时针
    if (item === 'yz') {
      this.imgRotation = this.imgRotation + 10 * Math.PI / 180
      this.drawCanvas()
    }
  }
  ctx () {
    return this.canvas.getContext('2d')
  }
  resource () {
    let img = new Image()
    let anchor = document.createElement('a')
    anchor.href = this.src
    // cross domain (除了base64 和 当前域名)
    if (/^data:image/.test(this.src) || location.host === anchor.host) {} else {
      img.crossOrigin = ''
    }
    img.src = this.src
    return img
  }
  setStat () {
    if (this.stat) {
      this.stat.innerHTML = `${this.currentIndex + 1}/${this.imageListCount()}`
    }
  }
  componentWillReceiveProps (nextProps) {
    // if (nextProps.imageList && nextProps.imageList.length === 0 && this.canvas) {
    //   let ctx = this.ctx()
    //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    //   ctx.fillStyle = '#fff'
    //   ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // }
    // console.log('=============================')
    // console.log(nextProps)
    // console.log('=============================')
  }
  componentDidMount () {
    console.log('===> componentDidMount ===')
    setSize(this.canvas, 900, 700)
    let rect = this.canvas.getBoundingClientRect()
    // set offset
    let parentStyle = window.getComputedStyle(this.canvas.parentElement)
    let parentRect = this.canvas.parentElement.getBoundingClientRect()
    this.offset = {
      top: parentRect.top - rect.top,
      left: parentRect.left - rect.left,
      width: parseFloat(parentStyle.width),
      height: parseFloat(parentStyle.height)
    }
    this.offset.top = this.offset.top <= 0 ? 0 : this.offset.top
    this.offset.left = this.offset.left <= 0 ? 0 : this.offset.left
    // this.loadImg()
    this.drawCanvas()
  }
  _drawImage () {
    let ctx = this.ctx()
    let img = this.resource()
    if (!ctx) return
    ctx.save()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.translate(this.drawPos.dx + this.drawPos.dw / 2, this.drawPos.dy + this.drawPos.dh / 2)
    ctx.scale(this.scale, this.scale)
    ctx.rotate(this.imgRotation)
    ctx.drawImage(img, this.resPos.sx, this.resPos.sy, this.resPos.sw, this.resPos.sh, -1 * this.drawPos.dw / 2, -1 *
      this.drawPos.dh / 2, this.drawPos.dw, this.drawPos.dh)
    ctx.restore()
  }
  drawCanvas () {
    let resultList = this.getCorrectImgList()
    if (resultList && resultList.length) {
      this.src = resultList[this.currentIndex].imageUrl
      this.loadImg()
    }
  }
  loadImg () {
    this.resource().onload = () => {
      console.log('===> img onload')
      _fixedDrawSize.bind(this)('cover1')
      this._drawImage()
    }
  }
  handleMouseDown (e) {
    console.log('down ~~~')
    this.isMoveMode = true
    this.startX = e.pageX
    this.startY = e.pageY
    this.fuckNum = 0
  }
  handleMouseMove (e) {
    console.log('move ~~~')
    this.fuckNum++
    if (this.fuckNum % 1 !== 0) return
    if (this.isMoveMode) {
      console.log('move2 ~~~')
      let nowX = Math.floor(e.pageX)
      let nowY = Math.floor(e.pageY)
      this.drawPos.dx += nowX - this.startX
      this.drawPos.dy += nowY - this.startY
      this._drawImage()
      this.startX = nowX
      this.startY = nowY
    }
  }
  handleMouseUp () {
    console.log('up ~~~')
    if (this.scale < 1) {
      this.scale = Math.max(this.scale, this.minScale)
      if (!this.rotateEnable) _fixedCenterPic.bind(this)('cover1')
    } else {
      this.scale = Math.min(this.scale, this.maxScale)
      if (!this.rotateEnable) _fixedEdgePic.bind(this)('cover1')
    }
    this._drawImage()
    this.isMoveMode = false
  }
  getCorrectImgList () {
    let {readonlyImgList, imageList, activeKey} = this.props
    let resultList = []
    if (activeKey === '0') {
      resultList = imageList
    } else if (activeKey === '1') {
      resultList = readonlyImgList
    }
    return resultList
  }
  // mousedown
  // mousemove
  // mouseup
  render () {
    let resultList = this.getCorrectImgList()
    console.log('-------------------')
    console.log(resultList)
    console.log('-------------------')
    if (resultList && resultList.length !== 0) {
      this.setStat()
      this.drawCanvas()
    }
    // else {
    //   if (this.canvas) {
    //     let ctx = this.ctx()
    //     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    //     ctx.fillStyle = '#fff'
    //     ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    //   }
    // }

    return <div className="preview-warp">
      <div className='preview-img-container'>
        <div className="canvasWrapper"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}>
          <div className="stat" ref={(stat) => { this.stat = stat }}>0/0</div>
          <canvas ref={(canvas) => { this.canvas = canvas }} />
        </div>
      </div>
      <div className="preview-tools">
        {
          TOOLBAR.map(item => {
            return <div className="img-warp" onClick={this.operator.bind(this, item)} key={item}><img key={item} src={require(`../../assets/img/${item}.png`) }/></div>
          })
        }
      </div>
    </div>
  }
}
Picture.propTypes = {
  imageList: PropTypes.array,
  readonlyImgList: PropTypes.array,
  activeKey: PropTypes.string
}

export default Picture
