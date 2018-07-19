import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
require('./index.scss')

const Detail = ({ promoDetail, dispatch }) => {
  const join = () => {
    dispatch({ type: 'promoDetail/join', payload: { id: promoDetail.data.id, join: true } })
  }
  const cancelJoin = () => {
    dispatch({ type: 'promoDetail/cancelJoin', payload: { id: promoDetail.data.id, join: false } })
  }
  const preview = () => {
    window.open('https://pro.modao.cc/app/091c8433c7f61e3a3ec2400a6691afea7cc65fda')
  }
  let renderJoinButton = () => {
    if (promoDetail.data.join === 1) {
      return (
        <div>
          {/* <Button className="btn-margin" disabled>已参加</Button> */}
          <Button className="btn-margin btn-cancel" onClick={cancelJoin}>取消参加</Button>
          <Button className="btn-margin btn-preview" onClick={preview}>预览活动</Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button className="btn-margin" type="primary" onClick={join}>参加</Button>
          <Button className="btn-margin btn-preview" onClick={preview}>预览活动</Button>
        </div>
      )
    }
  }
  return (
    <Row className={'promo-content'}>
      <Col span={20}>
        <div className="promo">
          <div className="promo-item">
            <div className="promo-label">活动名称</div>
            <div className="promo-value">{promoDetail.data.title}</div>
          </div>

          <div className="promo-item">
            <div className="promo-label">活动描述</div>
            <div className="promo-value promo-desc" dangerouslySetInnerHTML={{__html: promoDetail.data.description}}></div>
          </div>

          <div className="promo-item">
            <div className="promo-label">菜单栏名称</div>
            <div className="promo-value">免费领取优惠券</div>
          </div>

          <div className="promo-item">
            <div className="promo-label">开始时间</div>
            <div className="promo-value">{moment(promoDetail.data.start_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>

          <div className="promo-item">
            <div className="promo-label">结束时间</div>
            <div className="promo-value">{moment(promoDetail.data.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>

          <div className="promo-item">
            <div className="promo-label">状态</div>
            <div className="promo-value">{promoDetail.data.join === 0 ? '未参加' : '已参加'}</div>
          </div>

        </div>
        {renderJoinButton()}
      </Col>
    </Row>
  )
}

Detail.propTypes = {
  promoDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ promoDetail, loading }) => ({ promoDetail, loading: loading.models.promoDetail }))(Detail)
// <div span={20} className="promo-img"
//   style={{
//     backgroundImage: `url(${promoDetail.data.image})`
//   }}
// />
