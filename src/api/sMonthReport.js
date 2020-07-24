import request from '@/utils/request'

/**
 * 周报列表
 * @param params
 * @returns {AxiosPromise}
 */
export function weeklyReportList(params) {
  return request({
    url: '/weekly/dateList/admin',
    method: 'get',
    params
  })
}

/**
 * 周报项目列表
 * @param params
 * @returns {AxiosPromise}
 */
export function weeklyPersonList(params) {
  return request({
    url: '/weekly/list',
    method: 'get',
    params
  })
}

/**
 * 删除周报
 * @param id
 * @returns {AxiosPromise}
 */
export function weeklyDelete(id) {
  return request({
    url: `/weekly/delete/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除周报
 * @param ids
 * @returns {AxiosPromise}
 */
export function weeklyBatchDelete(ids) {
  return request({
    url: `/weekly/batchDelete/${ids}`,
    method: 'DELETE'
  })
}

// /***
//  * 汇总
//  * @param ids
//  * @returns {AxiosPromise}
//  */
// export function weeklySummary(ids) {
//   return request({
//     url: `/weekly/summary/${ids}`,
//     method: 'post'
//   })
// }
export function weeklySummary(params) {
  return request({
    url: '/weekly/summaryList',
    method: 'get',
    params
  })
}

export function summaryListAdd(data) {
  return request({
    url: '/weekly/summaryList/add',
    method: 'post',
    data
  })
}

export function excelDownloadSummary(data) {
  return request({
    url: '/excel/downloadSummary',
    method: 'get',
    data,
    responseType: 'blob'
  })
}


/**
 * 周报列表
 * @param params
 * @returns {AxiosPromise}
 *  /weekly/projectList/admin
 */
export function weeklyProjectListAdmin(params) {
  return request({
    url: '/weekly/projectList/admin',
    method: 'get',
    params
  })
}


