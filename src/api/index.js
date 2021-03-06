import axios from 'axios';
import { Message } from 'view-design';
import router from '../router'

const instance = axios.create({
  // baseURL: 'https://lczeros.cn/MyBlog',
  baseURL: 'http://127.0.0.1:8082/MyBlog',
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
  response => {
    //拦截失效token
    if(response.data.code == 4107){
      router.push("/login")
      // 清除过期信息
      localStorage.removeItem("token")
      localStorage.removeItem("UserData")
      Message.info('登录已过期,请重新登陆');
      // 使用windows跳转无法保存状态
      // window.location.href='/login?type=4107'
    }
    return response
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default {
  showMessage(e){
    this.$Message(e)
  },
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
  UserRegister(data){
    return instance.post("/user/userRegister",data)
  },
  GetMailCode(data){
    return instance.post("/blog/getMailCode",data)
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
  UpdatePassWd(data){
    return instance.post("/user/updatePassWd",data)
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
  UpdateEmail(data){
    return instance.post("/user/updateEmail",data)
  },
  ChangeAttention(data){
    return instance.post("/user/changeAttention",data)
  },
  GetUserRelationShip(){
    return instance.post("/user/getUserRelationShip")
  },

  //上传接口
  UploadImage(data){
    return instance.post("/upload/image",data)
  },
}
