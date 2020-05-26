import request from '@/utils/request'
/** *
 * 项目列表
 * @returns {AxiosPromise}
 */
export function projectList(params) {
  return request({
    url: '/project/list',
    method: 'get',
    params
  })
}

/**
 * 添加项目
 * @param data
 * @returns {AxiosPromise}
 */
export function projectAdd(data) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}

/**
 * 更新项目
 * @param data
 * @returns {AxiosPromise}
 */
export function projectUpdate(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

/**
 * 删除项目
 * @param id
 * @returns {AxiosPromise}
 */
export function projectDelete(id) {
  return request({
    url: `/project/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 批量添加
 * @param data
 * @returns {AxiosPromise}
 */
export function projectBatchSave(data) {
  return request({
    url: '/project/update/batch',
    method: 'post',
    data
  })
}

/**
 * 检查项目编号
 * @param params
 * @returns {AxiosPromise}
 */
export function personList() {
  return request({
    url: '/admin/selectList',
    method: 'get'
  })
}
export function checkCode(params) {
  return request({
    url: '/project/checkCode',
    method: 'get',
    params
  })
}

/**
 * 导出模板
 *
 */

export function downloadTemp(params) {
  return request({
    url: '/excel/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 项目已选人员列表
 * @param params
 * @returns {AxiosPromise}
 */
export function projectUserList(params) {
  return request({
    url: '/project/projectUserList',
    method: 'get',
    params
  })
}

/**
 * 可以选择的人员
 * @param params
 * @returns {AxiosPromise}
 */
export function projectOptionalUserList(params) {
  return request({
    url: '/project/projectOptionalUserList',
    method: 'get',
    params
  })
}

/**
 * 添加项目人眼
 * @param params
 * @returns {AxiosPromise}
 */
export function addProjectUsers(data) {
  return request({
    url: '/project/add/projectUsers',
    method: 'post',
    data
  })
}

/**
 * 更新项目人员信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateProjectUser(data) {
  return request({
    url: '/project/update/projectUser',
    method: 'post',
    data
  })
}

/**
 * 删除项目人员
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteProjectUser(data) {
  return request({
    url: '/project/delete/projectUsers',
    method: 'post',
    data
  })
}

/**
 * 可以选择的人员
 * @param params
 * @returns {AxiosPromise}
 */
export function projectSelectListNormalps(params) {
  return request({
    url: '/project/selectList/normal/ps',
    method: 'get',
    params
  })
}
