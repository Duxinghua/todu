import request from '@/utils/request'
/** *
 * 账号列表
 * @returns {AxiosPromise}
 */
export function accountList(params) {
  return request({
    url: '/admin/list/account',
    method: 'get',
    params
  })
}

/**
 * 添加账号
 * @param params
 * @returns {AxiosPromise}
 */
export function accountAdd(data) {
  return request({
    url: '/admin/add/account',
    method: 'post',
    data
  })
}

/**
 * 修改用户状态
 * @param params
 * @returns {AxiosPromise}
 */
export function updateAccountStatus(params) {
  return request({
    url: `/admin/${params.id}/status/${params.userStatus}`,
    method: 'put'
  })
}
export function resetPwd(data) {
  return request({
    url: '/admin/update/resetPwd',
    method: 'post',
    data
  })
}
