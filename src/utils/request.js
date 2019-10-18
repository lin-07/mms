import axios from 'axios';
import qs from 'qs';
import { Loading,Message } from 'element-ui';
// 全局加载器
const loading = {
  loadingInstance:null,
  open: function(){
    if(this.loadingInstance === null){
      this.loadingInstance = Loading.service({
        target:'.main',
        text:'拼命加载中',
        background:'rgba(0,0,0,0.5)'
      })
    }
  },
  close: function() {
    if(this.loadingInstance !== null){
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  }
}


const service = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  loading.open()
  return config
},error => {
  loading.close()
  return Promise.reject(error);
})
// 响应拦截器
service.interceptors.response.use(response => {
  loading.close()
  // console.log('response',response)
  if(response.status !== 200){
    Message({
      message:error.message,
      type:'error',
      duration: 5 * 1000
    })
  }
  
  return response
},error => {
  loading.close()
  return Promise.reject(error);
})

const request = (url, body, type = 'get', isJson = false) => {
  const query = {
    url: url,
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
  return service.request(query).then(response => {
  
    console.log('response-----',response)
    // promise处理响应
    return new Promise((resolve,reject) => {
      if (!response.data) {
        reject(new Error('服务器响应超时'))
        return
      }
      if (response.status === 200) {
        resolve(response.data)
      } else {
        if (response.data.msg) {
          response.data.message = response.data.msg
          reject(response.data)
        }
      }
    })
  }, e => { 
    console.log(e)
  })
}

export default request