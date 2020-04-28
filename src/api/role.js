import request from '@/utils/request'

/**
 * 角色列表
 * @param state
 * @returns {AxiosPromise}
 */
export function roleList(state) {
  return request({
    url: `/admin/role/list/${state}`,
    method: 'get'
  })
}

/**
 * 添加角色
 * @param data
 * @returns {AxiosPromise}
 */
export function roleAdd(data) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data
  })
}
/**
 * 更新角色
 * @param data
 * @returns {AxiosPromise}
 */
export function roleUpdate(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param data
 * @returns {AxiosPromise}
 */
export function roleDelete(id) {
  return request({
    url: `/admin/role/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 移动权限
 * @param data
 * @returns {AxiosPromise}
 */
export function roleRight(data) {
  return request({
    url: 'admin/role/rights',
    method: 'post',
    data
  })
}

/**
 * 移除权限
 * @param id
 * @param rightId
 * @returns {AxiosPromise}
 */
export function roleRightDelete(id, rightId) {
  return request({
    url: `admin/role/${id}/right/${rightId}`,
    method: 'delete'
  })
}

/**
 * 修改角色状态
 * @param id
 * @param status
 * @returns {AxiosPromise}
 */
export function roleUpdateStatus(id, status) {
  return request({
    url: `admin/role/${id}/status/${status}`,
    method: 'put'
  })
}
