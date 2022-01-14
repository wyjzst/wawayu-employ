import axios from 'axios';

console.log(window.location.host)

if(window.location.host=='mk.wawayu.tv'){
  axios.defaults.baseURL ='http://mk.wawayu.tv/';//
}else{
  axios.defaults.baseURL ='http://tmk.wwy158.com/';//
}

function getLS(name) {
  return localStorage[name];
}

function delLS(name) {
  localStorage.removeItem(name);
}

//http request 拦截器
axios.interceptors.request.use(
  config => {
    const token =getLS('token');//注意使用的时候需要引入cookie方法，推荐js-cookie
    if (config.data instanceof File) {
      config.headers = {
        'Content-Type':'multipart/form-data'
      }
      let formData = new FormData();
      formData.append("file", config.data);
      config.data = formData;
    } else {
      config.headers = {
        'Content-Type':'application/json'
      }
      if(token){
        config.headers.token = token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.status == 4){
      delLS('token');
      delLS('AdminInfo');
      location.reload();
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data).then(response => {
            resolve(response.data);
          },err => {
            console.log(err)
            reject(err)
          })
   })
 }

 