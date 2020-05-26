import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '../router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    var getTimestamp = new Date().getTime()
    var url = config.url
    if (url) {
      if (url.indexOf('?') > -1) {
        url = url + '&timestamp=' + getTimestamp
      } else {
        url = url + '?timestamp=' + getTimestamp
      }
    }
    config.url = url
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 200) {
      // const headers = response.headers
      // if (headers['content-type'] === 'application/octet-stream;charset=utf-8') {
      //   return response.data
      // }
      if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') { // 下载excel类型
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        console.log(11)
        // 获取文件名
        // const fileName = decodeURI(response.headers['content-disposition'].split('=')[1]) // 处理文件名乱码问题
        const fileName = '项目模板.xlsx'
        downloadElement.download = fileName // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
        return
      }
    }

    const res = response.data
    res.code = res.status
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 500) {
      Message({
        message: res.msg || res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('登录超时', '登录超时', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            router.push({ path: '/login' })
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const request = error.request
    const resultData = JSON.parse(request.response)
    if (resultData.code == 502) {
      // Message({
      //   message: '登录已超时,请重新登录',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // router.push({
      //   path: '/login'
      // })
      MessageBox.confirm('登录已超时,请重新登录', {
        confirmButtonText: '重新登录',
        // cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          router.push({ path: '/login' })
          location.reload()
        })
      })
    } else {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
