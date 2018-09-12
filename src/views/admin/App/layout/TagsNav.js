import React from 'react'
import PropTypes from 'prop-types'
import './TagsNav.less'
import classnames from 'classnames'
import { Button, Dropdown, Menu, Icon, Tag } from 'antd'
class TagsNav extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.scrollOuterRef = React.createRef()
    this.scrollBodyRef = React.createRef()
    this.onDropDownMenuClick = this.onDropDownMenuClick.bind(this)
    this.state = {
      tagBodyLeft: 0,
    }
  }

  // componentDidMount () {}
  handlescroll (e) {
    var type = e.type
    let delta = 0
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
    }
    // this.handleScroll(delta)
  }
  isCurrentTag (item) {
    if (item.pathname === this.props.value.pathname) {
      return true
    }
    return false
  }
  handleScroll (offset) {
    if (offset > 0) {
      this.setState({
        tagBodyLeft: Math.min(0, this.state.tagBodyLeft + offset)
      })
    } else {
      if (this.scrollOuterRef.current.offsetWidth < this.scrollBodyRef.current.offsetWidth) {
        if (this.state.tagBodyLeft < -(this.scrollBodyRef.current.offsetWidth - this.scrollOuterRef.current.offsetWidth)) {
          this.setState({
            tagBodyLeft: this.state.tagBodyLeft
          })
        } else {
          this.setState({
            tagBodyLeft: Math.max(this.state.tagBodyLeft + offset, this.scrollOuterRef.current.offsetWidth - this.scrollBodyRef.current.offsetWidth)
          })
        }
      } else {
        this.state.tagBodyLeft = 0
      }
    }
  }
  onDropDownMenuClick ({ key }) {
    if (key === 'close-all') {
      this.props.handleCloseAll()
    } else {
      this.props.handleCloseOthers()
    }
  }
  dropDownMenu () {
    return (
      <Menu onClick={this.onDropDownMenuClick}>
        <Menu.Item key="close-all">关闭所有</Menu.Item>
        <Menu.Item key="close-others">关闭其他</Menu.Item>
      </Menu>
    )
  }
  handleClose (e, item) {
    e.preventDefault()
    e.stopPropagation()
    this.props.handleClose(item)
  }
  handleClick (e, item) {
    e.preventDefault()
    e.stopPropagation()
    this.props.handleClick(item)
  }
  render () {
    return (
      <div className="tags-nav">
        <div className="close-con">
          <Dropdown overlay={this.dropDownMenu()} style={{ marginTop: '7px' }}>
            <Button size="small" type="text">
              <Icon type="close-circle-o" style={{ fontSize: 16, color: '#08c' }}/>
            </Button>
          </Dropdown>
        </div>
        <div className="btn-con left-btn">
          <Button icon="left" type="text" onClick={() => { this.handleScroll(240) }}></Button>
        </div>
        <div className="btn-con right-btn">
          <Button icon="right" type="text" onClick={() => { this.handleScroll(-240) }}></Button>
        </div>

        <div className="scroll-outer" ref={this.scrollOuterRef}>
          <div ref={this.scrollBodyRef} className="scroll-body" style={{left: this.state.tagBodyLeft + 'px'}}>
            {
              this.props.list.map((item, index) =>
                <Tag
                  key={index}
                  closable={(item.pathname !== '/dashboard')}
                  color={this.isCurrentTag(item) ? '#108ee9' : ''}
                  visible={true}
                  checked={true}
                  onClick={(e) => this.handleClick(e, item)}
                  onClose={(e) => this.handleClose(e, item)}
                > {this.props.titleMap[item.pathname] || item.pathname} </Tag>
              )
            }
          </div>
        </div>

      </div>
    )
  }
}

TagsNav.propTypes = {
  location: PropTypes.object,
  list: PropTypes.array,
  value: PropTypes.object,
  titleMap: PropTypes.object,
  handleClick: PropTypes.func,
  handleClose: PropTypes.func,
  handleCloseAll: PropTypes.func,
  handleCloseOthers: PropTypes.func
}

export default TagsNav
