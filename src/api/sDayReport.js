import request from '@/utils/request'

/**
 * 日报列表
 * @param params
 * @returns {AxiosPromise}
 */
export function dayReportList(params) {
  return request({
    url: '/daily/dateList/admin',
    method: 'get',
    params
  })
}

/**
 * 日报人员列表
 * @param params
 * @returns {AxiosPromise}
 */
export function dailyPersonList(params) {
  return request({
    url: '/daily/list',
    method: 'get',
    params
  })
}

/**
 * 删除日报
 * @param id
 * @returns {AxiosPromise}
 */
export function dailyDelete(id) {
  return request({
    url: `/daily/delete/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除
 * @param ids
 * @returns {AxiosPromise}
 */
export function dailyBatchDelete(ids) {
  return request({
    url: `/daily/batchDelete/${ids}`,
    method: 'DELETE'
  })
}
