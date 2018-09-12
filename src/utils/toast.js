import { Modal, message } from 'antd'
export const ModalMessage = {
  info: (title = '', content = '') => {
    Modal.info({
      title,
      content
    })
  },
  success: (title = '', content = '') => {
    Modal.success({
      title,
      content
    })
  },
  error: (title = '', content = '') => {
    Modal.error({
      title,
      content
    })
  },
  warning: (title = '', content = '') => {
    Modal.warning({
      title,
      content
    })
  }
}

export const MESSAGE = {
  success: (title) => {
    message.success(title)
  },
  error: (title) => {
    message.error(title)
  },
  warning: (title) => {
    message.warning(title)
  }
}
// export default Message
