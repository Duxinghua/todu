import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/admin/personData',
    method: 'get',
    params: { token }
  })
}
export function updatePwd(data) {
  return request({
    url: '/admin/update/pwd',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param data
 * @returns {AxiosPromise}
 */
export function userUpdate(data) {
  return request({
    url: '/admin/update/persondata',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
/**
 * 添加配施人员
 * @param data
 * @returns {AxiosPromise}
 */
export function addBatchAddPs(data) {
  return request({
    url: '/admin/add/batchAdd/ps',
    method: 'post',
    data
  })
}

