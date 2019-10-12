import axios from 'axios';
import qs from 'qs'

// const service = axios.create({
//     baseURL:process.env.VUE_APP_BASE_API,
//     timeout:5000
// })

const request = (url, body, type = 'get', isJson = false) => {
  const query = {
    url: `${process.env.VUE_APP_BASE_API}${url}`,
    method: type,
    withCredentials: true,
    timeout: 5000
  }
  if (type === 'get') {
    query.params = body
    if (query.params === undefined) {
      query.params = { timestamp: (new Date()).getTime() }
    } else {
      query.params.timestamp = (new Date()).getTime()
    }
  } else {
    query.data = isJson ? body : qs.stringify(body)
  }
  console.log(query)
  return axios.request(query).then(res => {
    if (!res.data) {
      reject(new Error('服务器响应超时'))
      return
    }
    return res.data
  }, e => { })
}

export default request //{
    // getEmpList(){
    //     const req = request({
    //         url:'/emp/list',
    //         method:"get"
    //     })
    //     return req;
    // }
    // getEmpList: (query) => request('/emp/list',query,'post')
//}