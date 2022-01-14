import axios from 'axios';
import router from '../router'
if(window.location.host=='tmk.wwy158.com'){
  axios.defaults.baseURL ='http://tmk.wwy158.com/';//
}else{
  axios.defaults.baseURL ='http://mk.wawayu.tv/';//
}

function getLS(name) {
  return localStorage[name];
} 
//http request 拦截器
axios.interceptors.request.use(
  config => {
    const token =getLS('token');//注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json'
    }
    if(token){
      config.headers = {
        'Content-Type':'application/json',
        'token':token
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
    // if (response.status === 200) {            
    //     return Promise.resolve(response);        
    // } else {  
    //     router.push({
    //         path:"/",
    //         querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
    //       })          
    //     return Promise.reject(response);        
    // }    
    if(response.data.errCode ==4){
      router.push({
        path:"/",
        querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


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

 