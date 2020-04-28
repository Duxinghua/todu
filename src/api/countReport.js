import request from '@/utils/request'

/**
 * 日报统计
 * @param state
 * @returns {AxiosPromise}
 */
export function dailyCount(params) {
  return request({
    url: '/statistics/daily',
    method: 'get',
    params
  })
}

/**
 * 周报统计
 * @param state
 * @returns {AxiosPromise}
 */
export function weekCount(params) {
  return request({
    url: '/statistics/weekly',
    method: 'get',
    params
  })
}

/**
 * 项目列表
 * @param state
 * @returns {AxiosPromise}
 */
export function projectList(state) {
  return request({
    url: '/project/selectList/admin',
    method: 'get'
  })
}
