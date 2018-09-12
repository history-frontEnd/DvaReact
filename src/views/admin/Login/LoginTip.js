import React from 'react'
import PropTypes from 'prop-types'
import config from 'utils/config'
import styles from './LoginTip.less'
import ReactLoading from 'react-loading'
const LoginTip = ({ }) => {
  return (
    <div className={styles.form}>
      <div className={styles.logo} key="1">
        <img src={config.logoSrc} alt={config.logoSrc} />
        <span>{config.logoText}</span>
      </div>
      <div className={styles.loadingWrapper}>
        <ReactLoading type={'bars'} color={'rgb(16, 142, 233)'} height={80} width={80} />
        <span>请稍候...</span>
      </div>
    </div>
  )
}

LoginTip.propTypes = {}

export default LoginTip
