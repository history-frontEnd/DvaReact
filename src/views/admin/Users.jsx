import React from 'react'
import { Table, Form, Row, Col, Input, Button, DatePicker, Icon } from 'antd'
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const searchInput = [{
  name: '1',
  label: '公众号名称'
}, {
  name: '2',
  label: '联系人'
}, {
  name: '3',
  label: '联系电话'
}, {
  name: '4',
  label: '状态'
}, {
  name: '5',
  label: '日期',
  type: 'RangePicker'
}]
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 150,
  render: text => <a href="#">{text}</a>
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
  width: 70
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address'
}]
const data = []
for (let i = 1; i <= 10; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: `${i}2`,
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`
  })
}
const tableProps = {
  size: 'small'
}
const paginationProps = {
  size: 'large',
  pageSize: 2,
  showSizeChanger: true,
  showQuickJumper: true
}
export default class Admin extends React.Component {
  handleSearch = (e) => {
    e.preventDefault()
  }
  getFields () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return searchInput.map(data => <Col span={8} key={data.name}>
      <FormItem {...formItemLayout} label={data.label}>
        {data.type ? <RangePicker /> : <Input placeholder={`请输入${data.label}`} />}
      </FormItem>
    </Col>)
  }

  render () {
    return <Form
      className="ant-advanced-search-form"
      onSubmit={this.handleSearch}
    >
      <Row type="flex">{this.getFields()}</Row>
      <Row type="flex" style={{marginBottom: 10}}>
        <Col span={8}>
          <Button type="primary" htmlType="submit">查询</Button>
        </Col>
      </Row>
      <Row type="flex">
        <Col span={24}><Table {...tableProps} columns={columns} dataSource={data}  pagination={paginationProps}/></Col>
      </Row>
    </Form>
  }
}
