
import request from '@/utils/request'

/**
 * 权限树列表
 * @param state
 * @returns {AxiosPromise}
 */
export function authorityTeeList(state) {
  return request({
    url: '/admin/authority/treeList',
    method: 'get'
  })
}

/**
 * 权限列表
 * @param typeSearch
 * @param stateSearch
 * @param pageNum
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function authorityList(typeSearch, stateSearch, pageNum, pageSize) {
  return request({
    url: `admin/authority/list?authType=${typeSearch}&status=${stateSearch}&pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

/**
 * 删除权限
 * @param id
 * @returns {AxiosPromise}
 */
export function authorityDelete(id) {
  return request({
    url: `admin/authority/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 添加权限
 * @param data
 * @returns {AxiosPromise}
 */
export function authorityAdd(data) {
  return request({
    url: 'admin/authority/add',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @param data
 * @returns {AxiosPromise}
 */
export function authorityUpdate(data) {
  return request({
    url: 'admin/authority/update',
    method: 'post',
    data
  })
}

/**
 * 更新状态
 * @param id
 * @param status
 * @returns {AxiosPromise}
 */
export function authorityUpdateStatus(id, status) {
  return request({
    url: `admin/authority/${id}/status/${status}`,
    method: 'put'
  })
}

/**
 * 菜单树
 * @param id
 * @param status
 * @returns {AxiosPromise}
 */
export function authorityTree(id, status) {
  return request({
    url: '/admin/menus',
    method: 'get'
  })
}

