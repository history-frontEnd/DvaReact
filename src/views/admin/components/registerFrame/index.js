import React from 'react'
import PropTypes from 'prop-types'

const RegisterFrame = (props) => {
  return (
    <div className='website2'>
      <div className='register-header'>
        <div className='register-logo'>
          <div className='logo'></div>
        </div>
      </div>
      {props.children}
    </div>
  )
}

RegisterFrame.propTypes = {
  children: PropTypes.node
}
export default RegisterFrame
