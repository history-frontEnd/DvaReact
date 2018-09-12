import React from 'react'
import config from 'utils/config'
import styles from './Footer.less'

const Footer = () => <div className={styles.footer} >{config.footerText}</div>

export default Footer
