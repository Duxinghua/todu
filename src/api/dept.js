import request from '@/utils/request'

/**
 *
 */

/**
 * 检查手机号码时候重复
 * @param data
 * @returns {AxiosPromise}
 */
export function checkContactInfo(params) {
  return request({
    url: '/admin/add/checkContactInfo',
    method: 'get',
    params
  })
}
/**
 * 检查工号是否重复
 * @param data
 * @returns {AxiosPromise}
 */
export function checkWorkNumber(params) {
  return request({
    url: '/admin/add/checkWorkNumber',
    method: 'get',
    params
  })
}
export function deptAdd(data) {
  return request({
    url: '/admin/dept/add',
    method: 'post',
    data
  })
}

/**
 * 部门列表
 * @param data
 * @returns {AxiosPromise}
 */
export function deptList() {
  return request({
    url: '/admin/dept/list',
    method: 'get'
  })
}

/**
 * 部门树
 * @param data
 * @returns {AxiosPromise}
 */
export function deptTreeList(data) {
  return request({
    url: '/admin/dept/treeList',
    method: 'get',
    data
  })
}
/** ********部门用户********/
/**
 * 部门人员列表
 * @param params
 * @returns {AxiosPromise}
 */
export function deptPersonList(params) {
  return request({
    url: '/admin/list/dept',
    method: 'get',
    params
  })
}

/**
 * 删除人员
 * @param id
 * @returns {AxiosPromise}
 */
export function deletePerson(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'delete'
  })
}

/**
 *修改用户信息
 * @param id
 * @returns {AxiosPromise}
 */
export function updatePerson(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}
/**
 * 批量删除人员
 * @param id
 * @returns {AxiosPromise}
 */
export function batchDeletePerson(id) {
  return request({
    url: 'admin/batchDelete/' + id,
    method: 'delete'
  })
}

/**
 * 添加用户
 * @param id
 * @returns {AxiosPromise}
 */
export function savePerson(data) {
  return request({
    url: 'admin/add',
    method: 'post',
    data
  })
}

/**
 *批量添加用户
 * @param data
 * @returns {AxiosPromise}
 */
export function batchSavePerson(data) {
  return request({
    url: 'admin/add/batchAdd',
    method: 'post',
    data
  })
}

// 配施   GET /admin/list/ps
/**
 *批量添加用户
 * @param data
 * @returns {AxiosPromise}
 */
export function AdminListPs(params) {
  return request({
    url: 'admin/list/ps',
    method: 'get',
    params
  })
}

// 删除 DELETE /admin/ps/{id}
/**
 * 批量删除人员
 * @param id
 * @returns {AxiosPromise}
 */
export function adminPsDel(id) {
  return request({
    url: 'admin/ps/' + id,
    method: 'delete'
  })
}

// 搜索  searchAdminps

/**
 *批量添加用户
 * @param data
 * @returns {AxiosPromise}
 */
export function searchAdminps(params) {
  return request({
    url: 'admin/list/ps',
    method: 'get',
    params
  })
}
