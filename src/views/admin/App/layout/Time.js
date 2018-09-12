import React from 'react'
import PropTypes from 'prop-types'
import styles from './Time.less'
import classnames from 'classnames'

class Time extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.timeRef = React.createRef()
  }
  weekDay = () => {
    let date = new Date().getDay()
    return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date]
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    if (this.interval) return
    let timeRef = this.timeRef
    this.interval = setInterval(() => {
      timeRef.current.innerHTML = new Date().format('yyyy-MM-dd HH:mm:ss')
    }, 1000)
  }

  render () {
    return (
      <div className={classnames(styles.time, this.props.wrapClass)}>
        <span>{this.weekDay()}</span>
        <span ref={this.timeRef}>{new Date().format('yyyy-MM-dd HH:mm:ss')} </span>
      </div>
    )
  }

  componentWillUnmount () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}

Time.propTypes = {
  wrapClass: PropTypes.string,
  location: PropTypes.object
}

export default Time
