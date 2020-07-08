import request from '@/utils/request'

/**
 * 配施日志列表
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
 * 配施日志人员列表
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
 * 删除配施日志
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

/**
 * 配施日志列表 /admin/dept/list
 * @param params
 * @returns {AxiosPromise}
 */
export function admindeptlist(params) {
  return request({
    url: '/admin/dept/list',
    method: 'get',
    params
  })
}

/**
 * 管理员查询日志// GET /daily/list/admin
 * @param params
 * @returns {AxiosPromise}
 */
export function dailyListAdmin(params) {
  return request({
    url: '/daily/list/admin',
    method: 'get',
    params
  })
}

/**
 * 管理员查询日志// GET //daily/list/admin/workNumber
 * @param params
 * @returns {AxiosPromise}
 */
export function dailyListAdminWorkNumber(params) {
  return request({
    url: '/daily/list/admin/workNumber',
    method: 'get',
    params
  })
}

/**
 * 个人填报率 /statistics/statisticsDaily
 * @param params
 * @returns {AxiosPromise}
 */
export function statisticsDaily(params) {
  return request({
    url: '/statistics/statisticsDaily',
    method: 'get',
    params
  })
}

/**
 * 统计室所填报率 /statistics/statisticsDaily/dept
 * @param params
 * @returns {AxiosPromise}
 */
export function statisticsDailyDept(params) {
  return request({
    url: '/statistics/statisticsDaily/dept',
    method: 'get',
    params
  })
}
// GET /statistics/statisticsDaily/noReport 查询一周室所未填报人员(默认上周五到本周四)
export function statisticsDailyNoReport(params) {
  return request({
    url: '/statistics/statisticsDaily/noReport',
    method: 'get',
    params
  })
}
