import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
require('./index.scss')
class Succ extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timing: 3
    }
  }
  setInterval (interval = 1000) {
    setTimeout(() => {
      let timing = this.state.timing - 1
      this.setState({
        timing
      })
      if (this.state.timing > 0) {
        this.setInterval()
      } else {
        this.props.history.push(`/uploader`)
      }
    }, interval)
  }
  componentWillMount () {
    this.setInterval()
  }
  render () {
    return (
      <div className='succ'>
        <div className='succ-img'></div>
        <div className='succ-txt'>提交成功</div>
        <div className='succ-time'>{this.state.timing}秒后自动跳转</div>
      </div>
    )
  }
}

Succ.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  history: PropTypes.object,
}
export default connect(({ loading }) => ({ loading }))(Succ)
