import _ from 'lodash'

const menu = [
  // 勿删
  {
    id: _.uniqueId(),
    key: 'dashboard',
    name: '管理平台',
    icon: 'laptop',
    power: [1, 2],
  },
  // 用户信息中心
  {
    id: _.uniqueId(),
    key: 'userInfo',
    name: '用户信息中心',
    icon: 'user',
    clickable: false,
    power: [1],
    children: [
      {
        id: _.uniqueId(),
        key: 'B',
        name: 'b端用户',
        power: [1, 2, 3, 4, 5],
      },
      // {
      //   id: _.uniqueId(),
      //   key: 'C',
      //   name: 'c端用户',
      //   power: [1, 2, 3, 4, 5],
      // }
    ],
  }
]

export default menu
