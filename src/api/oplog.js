import request from '@/utils/request'
/** *
 * 公告列表
 * @returns {AxiosPromise}
 */
export function logList(params) {
  return request({
    url: '/log/list/normal',
    method: 'get',
    params
  })
}

/**
 * 管理员日志
 * @param params
 * @returns {AxiosPromise}
 */
export function logAdminList(params) {
  return request({
    url: '/log/list',
    method: 'get',
    params
  })
}
