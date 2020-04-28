import request from '@/utils/request'

/**
 * 普通用户 日报列表
 * @param params
 * @returns {AxiosPromise}
 */
export function dayReportList(params) {
  return request({
    url: '/daily/list/normal',
    method: 'get',
    params
  })
}
export function dayReportListOnDate(params) {
  return request({
    url: '/daily/projectList/date',
    method: 'get',
    params
  })
}

/**
 * 查看日报
 * @param params
 * @returns {AxiosPromise}
 */
export function reportView(params) {
  return request({
    url: '/daily/review',
    method: 'get',
    params
  })
}

/**
 * 添加日报
 * @param data
 * @returns {AxiosPromise}
 */
export function reportAdd(data) {
  return request({
    url: '/daily/add',
    method: 'post',
    data
  })
}

/**
 * 更新日报
 * @param data
 * @returns {AxiosPromise}
 */
export function reportUpdate(data) {
  return request({
    url: '/daily/update',
    method: 'post',
    data
  })
}

/**
 * 项目下拉列表
 * @param data
 * @returns {AxiosPromise}
 */
export function projectList(params) {
  return request({
    url: '/project/selectList/normal',
    method: 'get',
    params
  })
}

/**
 * 角色下拉
 * @param data
 * @returns {AxiosPromise}
 */
export function projectRoleList(params) {
  return request({
    url: '/project/projectRoleList',
    method: 'get',
    params
  })
}

/**
 * 角色下拉
 * @param data
 * @returns {AxiosPromise}
 */
export function projectReportList(params) {
  return request({
    url: '/daily/projectList/pid',
    method: 'get',
    params
  })
}

/** ****通过项目查询 日汇报*******/
