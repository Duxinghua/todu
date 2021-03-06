import request from '@/utils/request'

/**
 * 配施日志列表
 * @param params
 * @returns {AxiosPromise}
 */
export function weekList(params) {
  return request({
    url: '/weekly/dateList/normal',
    method: 'get',
    params
  })
}

/**
 * 获取当前周报时间段
 * @param data
 * @returns {AxiosPromise}
 */
export function weekDate(data) {
  return request({
    url: '/weekly/weekDate',
    method: 'post',
    data
  })
}

/**
 * 保存周报
 * @param data
 * @returns {AxiosPromise}
 */
export function weekAdd(data) {
  return request({
    url: '/weekly/add',
    method: 'post',
    data
  })
}

/**
 * 修改周报
 * @param data
 * @returns {AxiosPromise}
 */
export function weekUpdate(data) {
  return request({
    url: '/weekly/update',
    method: 'post',
    data
  })
}

export function reportView(params) {
  return request({
    url: '/weekly/review',
    method: 'get',
    params
  })
}

/**
 * 周报项目列表 只使用一次
 * @param params
 * @returns {AxiosPromise}
 */
export function weekProjectListOne(params) {
  return request({
    url: '/weekly/projectList/weekDate',
    method: 'get',
    params
  })
}

/**
 *
 * @param params
 * @returns {AxiosPromise}
 */
export function weekProjectList(params) {
  return request({
    url: '/weekly/projectList/pid',
    method: 'get',
    params
  })
}

/**
 * 个人周报 最新
 * @param params
 * @returns {AxiosPromise}
 */
export function personWeekList(params) {
  return request({
    url: '/weekly/projectList/person',
    method: 'get',
    params
  })
}

/**
 * 个人周报 查询新加
 * @param params
 * @returns {AxiosPromise}
 */
export function projectListPersonx(params) {
  return request({
    url: '/weekly/projectList/person/x',
    method: 'get',
    params
  })
}

/**
 * 个人周报 删除
 * @param params
 * @returns {AxiosPromise}
 */
export function weeklyDelete(params) {
  return request({
    url: '/weekly/delete/' + params.id,
    method: 'delete'
  })
}

// weekly/add/status?startDateStr=2020-05-04&proCode=CT102901
/**
 * 是否有周报
 * @param params
 * @returns {AxiosPromise}
 */
export function weeklyAddStatus(params) {
  return request({
    url: '/weekly/add/status',
    method: 'post',
    params
  })
}
