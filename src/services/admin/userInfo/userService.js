
import request from 'utils/request'
// 获取B端用户
export async function getBClientUsers (params) {
  return request({
    url: `/userData/bUser`,
    method: 'GET',
    params
  })
}

// 过滤B端用户
export async function filterBClientUsers (params) {
  return request({
    url: `/userData/getUserBList`,
    method: 'GET',
    params
  })
}

// 用户数据模块 / 通过地区编号获取机构列表
export async function getOrgList (params) {
  return request({
    url: `/userData/getOrgListByAreaid`,
    method: 'GET',
    params
  })
}

// 用户数据模块 / 新建 B 端用户
export async function createBUser (params) {
  return request({
    url: `/userData/insertBUser`,
    method: 'POST',
    params
  })
}

// 用户数据模块 / 修改B端用户的个人信息之前先根据userId获取需要的信息
export async function getBUserDetails (params) {
  return request({
    url: `/userData/preUpdateBUser`,
    method: 'GET',
    params
  })
}

// 用户数据模块 / 修改保存用户数据
export async function saveBClient (params) {
  return request({
    url: `/userData/updateBUser`,
    method: 'POST',
    params
  })
}

// 用户数据模块 / B端用户禁用或启用
export async function bClientEnable (params) {
  return request({
    url: `/userData/userState`,
    method: 'POST',
    params
  })
}

// 用户角色关系 / 获取用户拥有的子系统和子系统对应角色的信息
export async function userSystemAndRole (params) {
  return request({
    url: `/userRole/getUserRole`,
    method: 'GET',
    params
  })
}

// 用户角色关系 / 为角色进行授权操作
export async function editUserRole (params) {
  return request({
    url: `/userRole/editUserRole`,
    method: 'POST',
    params
  })
}

// 已选中的roleid
export async function getUserRoleWithSystemType (params) {
  return request({
    url: `/userRole/getUserRoleWithSystemType`,
    method: 'GET',
    params
  })
}

// 用户数据模块 / 过滤 c 端用户
export async function getCUserFilter (params) {
  return request({
    url: `/userData/cUerFilter`,
    method: 'GET',
    params
  })
}

// 用户数据模块 / 重置密码
export async function resetPassword (params) {
  return request({
    url: `/userData/resetPassword`,
    method: 'GET',
    params
  })
}
