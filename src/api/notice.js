import request from '@/utils/request'
/** *
 * 公告列表
 * @returns {AxiosPromise}
 */
export function noticeList() {
  return request({
    url: '/publicInfo/list',
    method: 'get'
  })
}

/**
 * 新增公告
 * @param data
 * @returns {AxiosPromise}
 */
export function noticeAdd(data) {
  return request({
    url: '/publicInfo/add',
    method: 'post',
    data
  })
}
