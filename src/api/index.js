import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://lczeros.cn/MyBlog',
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=UTF-8",
  },
  withCredentials: true,
});
// 请求拦截器,检测是否有token并携带
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token !== null & token !== '') {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  response => {
    return response
  },
  // 请求失败
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default {
  //无需权限
  GetBlogList(data){
    return instance.post("/blog/getBlogList",data)
  },
  GetBlog(data){
    return instance.post("/blog/getBlog",data)
  },
  GetHomeClass(){
    return instance.post("/blog/getHomeClass")
  },
  GetComment(data){
    return instance.post("/blog/getComment",data)
  },
  GetCommentChild(data){
    return instance.post("/blog/getCommentChild",data)
  },
  UserLogin(data){
    return instance.post("/user/userLogin",data)
  },

  //需要权限
  InsertBlog(data){
    return instance.post("/user/insertBlog",data)
  },
  GetUserData(){
    return instance.post("/user/getUserData")
  },
  UpdateUserData(data){
    return instance.post("/user/updateUserData",data)
  },
  InsertTags(data){
    return instance.post("/user/insertTags",data)
  },
  GetClassificationList(){
    return instance.post("/user/getClassificationList")
  },
  GetTagsList(data){
    return instance.post("/user/getTagsList",data)
  },
  GetBlogListByUserId(data){
    return instance.post("/user/getBlogListByUserId",data)
  },
  DeleteBlog(data){
    return instance.post("/user/deleteBlog",data)
  },
  AddLike(data){
    return instance.post("/user/addLike",data)
  },
  DeleteLike(data){
    return instance.post("/user/deleteLike",data)
  },
  AddComment(data){
    return instance.post("/user/addComment",data)
  },
  DeleteComment(data){
    return instance.post("/user/deleteComment",data)
  },

  //上传接口
  UploadAvatar(data){
    return instance.post("/upload/avatar",data)
  },
}
