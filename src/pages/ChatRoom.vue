<style>
    .content{
        /* margin-top: 75px; */
        min-height: 100vh;
        width: 99%;
    }
    .foot{
        position: fixed;
        bottom: 0px;
    }
    .display{display: none}
    .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 80%;
        height: 85vh;
    }
    .chatTextBox textarea{
        border: none !important;
        box-shadow: none !important;
        border: none !important;
        resize: none;
        padding: 15px;
    }
    .chatTextBox textarea:enabled {
        border: none!important;
        box-shadow: none !important;
    }
    .chatTextBox textarea:hover {
        border: none !important;
        box-shadow: none !important;
    }
    .chatTextBox textarea:focus {
        border: none !important;
        box-shadow: none !important;
    }
    /* 重写iview的滚动框高度,使用deep穿透 */
    .leftScotll /deep/ .ivu-scroll-container {
        height:78vh !important;
    }
    .rightScotll /deep/ .ivu-scroll-container {
        height:61vh !important;
    }
    .userItem {
        padding: 10px;
        cursor: pointer;
    }
    .userItem /deep/ .ivu-list-item-meta-description {
      width: 100px;
      white-space: nowrap;/*设置不换行*/
      overflow: hidden; /*设置隐藏*/
      text-overflow: ellipsis; /*设置隐藏部分为省略号*/
    }
    .userItem:hover {
        background-color: #ddd;
    }
    .userItemSel {
        padding: 10px;
        cursor: pointer;
        background-color: #ddd;
    }
    .userItemSel /deep/ .ivu-list-item-meta-description {
      width: 100px;
      white-space: nowrap;/*设置不换行*/
      overflow: hidden; /*设置隐藏*/
      text-overflow: ellipsis; /*设置隐藏部分为省略号*/
    }
    .messageItem-L {
        display: flex;
        margin-top: 20px;
        padding-left: 20px;
    }
    .messageItemText-L {
        float: left;
        margin-left:10px;
        max-width: 60%;
        padding: 6px 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 3px;
        border: 0.1px solid#eee;
        /* -moz-box-shadow:0px 0px 2px #888;box-shadow:0px 0px 2px #888; */
    }
    .messageItemBox-L{
        margin-right: -12px;
        z-index: 2;
        margin-top: 8px;
        width:0;
        height:0;
        border-top:6px solid transparent;
        border-bottom:6px solid transparent;
        border-right:8px solid #fff;
        /* border: 0.1px solid#eee; */
    }
    .messageItem-R {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        padding-right: 20px;
    }
    .messageItemText-R {
        float: left;
        margin-right:10px;
        padding: 6px 10px;
        max-width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #3399ff;
        border-radius: 3px;
        border: 0.1px solid#eee;
        /* -moz-box-shadow:0px 0px 2px #888;box-shadow:0px 0px 2px #888; */
    }
    .messageItemBox-R{
        margin-left: -14px;
        margin-top: 8px;
        z-index: 2;
        width:0;
        height:0;
        border-top:6px solid transparent;
        border-bottom:6px solid transparent;
        border-left:8px solid #3399ff;
        /* border: 0.1px solid#eee; */
    }
    /* 中屏 */
    @media screen and (max-width: 990px) {
      .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 100%;
        height: 85vh;
      }
      .display{display: none}
    }
    /* 小屏 */
    @media screen and (max-width: 768px) {
      .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 100%;
        height: 88vh;
      }
      .display{display: inline}
    }

</style>

<template>
  <Layout>
      <Drawer title="消息列表" :scrollable="true" placement="left" v-model="openChartList">
        <div style="width:100%; height:100%; position:absolute; margin: -16px">
            <div v-for="user in chartUserList" :class="chartTitle==user.userName?'userItemSel':'userItem'" @click="chooseUser(user.userName)" :key="user.userName">
                <Row type="flex" justify="start" align="middle">
                <Col span="22">
                    <ListItemMeta
                        :avatar="user.avatar"
                        :title="user.userName"
                        :description="(usrMessageList[user.userName]==null || usrMessageList[user.userName].data.length==0)?'暂无消息':usrMessageList[user.userName].data[usrMessageList[user.userName].data.length-1].message"
                    />
                </Col>
                <Col span="2">
                    <Badge v-if="(chartTitle !== user.userName && usrMessageList[user.userName]!=undefined)" :count="usrMessageList[user.userName].unRead"></Badge>
                </Col>
                </Row>
            </div>
        </div>
      </Drawer>
      <HomeNav />
      <Content class="content">
      <Card class="chatCard" :padding='0' dis-hover>
          <Row>
              <Col :lg="{span:6}" :md="{span:7}" :xs="{span:0}">
                  <div style="height:85vh;background-color: #f2f2f2;">
                      <!-- 标题 -->
                      <div style="top: 0;height:8%; width:100%; background-color: #ededed; position:absolute; display: flex;justify-content: center;align-items: center;">
                           <p>消息列表</p>
                      </div>
                      <!-- 信息对象 -->
                      <div style="top: 8%;height:92%; width:100%; position:absolute;">
                          <Scroll class="leftScotll">
                              <div v-for="user in chartUserList" :class="chartTitle==user.userName?'userItemSel':'userItem'" @click="chooseUser(user.userName)" :key="user.userName">
                                  <Row type="flex" justify="start" align="middle">
                                  <Col span="22">
                                      <ListItemMeta
                                          :avatar="user.avatar"
                                          :title="user.userName"
                                          :description="(usrMessageList[user.userName]==null || usrMessageList[user.userName].data.length==0)?'暂无消息':usrMessageList[user.userName].data[usrMessageList[user.userName].data.length-1].message"
                                      />
                                  </Col>
                                  <Col span="2">
                                      <Badge v-if="(chartTitle !== user.userName && usrMessageList[user.userName]!=undefined)" :count="usrMessageList[user.userName].unRead"></Badge>
                                  </Col>
                                  </Row>
                              </div>
                          </Scroll>
                      </div>
                  </div>
              </Col>
              <Col :lg="{span:18}" :md="{span:17}" :xs="{span:24}">
                  <div style="height:85vh;background-color: #f4f4f4;">
                      <!-- 标题 -->
                      <Row type="flex" justify="center" align="middle" style="height:8%;">
                          <Col span="8">
                            <div class="display">
                              <Tooltip
                                content="消息列表"
                                placement="top-start"
                                style="margin-left:20px"
                              >
                                <Badge dot :count="totMessage">
                                    <Icon type="md-people" size="20" @click="openChartList = true"/>
                                </Badge>
                              </Tooltip>
                            </div>
                          </Col>
                          <Col span="8" style="display: flex;justify-content: center;align-items: center;">{{chartTitle}}</Col>
                          <Col span="8" style="height:100%;display: flex;justify-content: flex-end;align-items: center;">
                              <Tooltip
                                  v-if="chartTitle!='公共区域'"
                                  content="退出私聊"
                                  placement="top-end"
                                  style="margin-right:20px"
                              >
                                  <Icon type="md-exit" size="20" @click="backPubChart()"/>
                              </Tooltip>
                          </Col>
                      </Row>
                      <!-- 聊天内容 -->
                      <div style="top:8%;height:72%;width:100%;position:absolute;background-color: #f8f8f8;">
                          <div ref=messageBox style="overflow:auto; height:61vh !important;padding-bottom: 15px;">
                              <!-- 聊天内容 -->
                              <div v-for="item in massageList">
                                  <div v-if="item.fromUserName != UserData.userName" class="messageItem-L">
                                      <Avatar style="margin-right:5px" class="avatar" :src="item.fromUserAvatar" />
                                      <div class="messageItemBox-L"></div>
                                      <div class="messageItemText-L">
                                          <p style="word-break:break-all;white-space: pre-line;">{{item.message}}</p>
                                      </div>
                                  </div>
                                  <div v-else class="messageItem-R">
                                      <div class="messageItemText-R">
                                          <p style="color:#fff;word-break:break-all;white-space: pre-line;">{{item.message}}</p>
                                      </div>
                                      <div class="messageItemBox-R"></div>
                                      <Avatar style="margin-left:5px"  class="avatar" :src="UserData.avatar" />
                                  </div>
                              </div>
                          </div>
                      </div>
                      <!-- 输入框 -->
                      <div style="bottom:0; height:20%; width:100%; position:absolute;background-color: white;">
                          <Input ref=sendInput @on-keyup="checkInput" v-model="sendData.message" :maxlength="250" class="chatTextBox" type="textarea" :rows="3" placeholder="开始聊天...." />
                      </div>
                      <!-- 发送按钮 -->
                      <div style="bottom:25px; right:25px; height:2%; position:absolute; background-color: white;">
                          <Button @click="sendMessage()" size="small" type="primary">发送</Button>
                      </div>
                  </div>
              </Col>
          </Row>
      </Card>
      </Content>
      <!-- <HomeFooter class="foot"></HomeFooter> -->
    </Layout>
</template>

<script>
    // 引入组件
    import HomeNav from "@/components/frontground/Home-Nav";
    import HomeFooter from "@/components/frontground/Home-Footer";
    import Stomp from 'stompjs'
    import SockJS from 'sockjs-client'

    export default {
        name: 'websocket',
        components: {
                //导航条
                HomeNav,
                HomeFooter
        },
        data(){
            return{
                massageList: [],
                pubMassageList: [],
                usrMessageList: {},
                stompClient: null,
                timer: null,
                socket: null,
                UserData:JSON.parse(localStorage.getItem("UserData")),
                chartUserList: [],
                chartTitle:'公共区域',
                sendData: {
                    toUserName: null,
                    fromUserAvatar: '',
                    message: '',
                },
                sendType:'/sendPub',
                openChartList:false,
                totMessage: 0
            }
        },
        mounted() {
            // this.openSocket()
            this.initWebSocket();
            this.getUserRelationShip();
            this.backPubChart()
        },
        beforeDestroy: function() {
            // 页面离开时断开连接,清除定时器
            this.disconnect()
            clearInterval(this.timer)
        },
        methods: {
            // 原生写法
            openSocket() {
                if(typeof(WebSocket) == "undefined") {
                    console.log("您的浏览器不支持WebSocket");
                }
                else{
                    console.log("您的浏览器支持WebSocket");
                    //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
                    //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
                    var socketUrl="/socketTest";
                    socketUrl=socketUrl.replace("https","ws").replace("http","ws");
                    console.log(socketUrl);
                    if(this.socket!=null){
                        this.socket.close();
                        this.socket=null;
                    }
                    this.socket = new WebSocket(socketUrl);
                    var that = this
                    //打开事件
                    this.socket.onopen = function() {
                        console.log("websocket已打开");
                        //socket.send("这是来自客户端的消息" + location.href + new Date());
                        this.send("connect")
                    };
                    //获得消息事件
                    this.socket.onmessage = function(msg) {
                        console.log(msg.data);
                        //发现消息进入    开始处理前端触发逻辑
                        that.massageList.push({message:msg.data})
                    };
                    //关闭事件
                    this.socket.onclose = function() {
                        console.log("websocket已关闭");
                    };
                    //发生了错误事件
                    this.socket.onerror = function() {
                        console.log("websocket发生了错误");
                    }
                }
            },
            // sockJs初始化
            initWebSocket() {
                this.connection();
                let that= this;
                // 断开重连机制,尝试发送消息,捕获异常发生时重连
                // this.timer = setInterval(() => {
                //     try {
                //         that.stompClient.send("test");
                //     } catch (err) {
                //         console.log("断线了: " + err);
                //         that.connection();
                //     }
                // }, 5000);
            },
            connection() {
                var that = this
                // 建立连接对象
                let socket = new SockJS('https://lczeros.cn/MyBlog/socketConnect?token='+localStorage.getItem("token"),null,{transports:['websocket']});
                // 获取STOMP子协议的客户端对象
                this.stompClient = Stomp.over(socket);
                // 定义客户端的认证信息,按需求配置,目前无法找到stomp在后端的取出方法
                let headers = {
                    // Authorization:localStorage.getItem("token")
                }
                // 向服务器发起websocket连接
                this.stompClient.connect(headers,() => {
                    // 广播订阅地址
                    this.stompClient.subscribe('/topic/public', (msg) => {
                        //转换为字符串
                        var msgData = JSON.parse(msg.body)
                        that.pubMassageList.push(msgData.data)
                        that.sendData.message = ''
                        that.endScoll()
                    },headers);
                    // 单点订阅地址
                    this.stompClient.subscribe('/user/alone/hi',function(msg){
                        var msgData = JSON.parse(msg.body)
                        //如果是自己发的
                        if (that.UserData.userName === msgData.data.fromUserName){
                            that.usrMessageList[msgData.data.toUserName].data.push(msgData.data)
                            that.sendData.message = ''
                        }
                        else {
                            if (that.usrMessageList[msgData.data.fromUserName] == null){
                                that.usrMessageList[msgData.data.fromUserName] = {}
                                that.usrMessageList[msgData.data.fromUserName]["unRead"]=0
                                that.usrMessageList[msgData.data.fromUserName]["data"]=[]
                            }
                            // 设置未读数
                            if (that.chartTitle !== msgData.data.fromUserName){
                                that.usrMessageList[msgData.data.fromUserName].unRead+=1
                                that.totMessage += 1
                            }
                            that.usrMessageList[msgData.data.fromUserName].data.push(msgData.data)

                            // 解决消息来了不会自动刷新的临时办法
                            // const userName = that.sendData.toUserName
                            // that.backPubChart()
                            // if (that.chartTitle!==userName && userName!==null){
                            //   that.chooseUser(userName)
                            // }

                            // 已解决 更新数组
                            // that.usrMessageList = that.usrMessageList
                        }
                        that.endScoll()
                    });
                    this.$Message.success("连接成功")
                }, (err) => {
                    console.log('失败')
                    this.disconnect()
                    this.$Message.error("连接Socket失败")
                    console.log(err);
                });
            },
            disconnect() {
                if (this.stompClient) {
                    this.stompClient.disconnect();
                }
            },
            sendMessage() {
                // 原生写法
                // if(typeof(WebSocket) == "undefined") {
                //     console.log("您的浏览器不支持WebSocket");
                // }
                // else if(this.socket == null){
                //     console.log("你已经断开连接！")
                // }
                // else{
                //     this.socket.send(this.message)
                //     this.massageList.push({message:this.message,type:'self'})
                // }
                this.sendData.fromUserAvatar = this.UserData.avatar
                if(this.sendData.message === '')
                    this.$Message.info("发送为空！")
                else
                    this.stompClient.send(
                        this.sendType,
                        {},
                        JSON.stringify(this.sendData),
                    )
            },
            // 获取关注列表
            getUserRelationShip(){
                 this.Request.GetUserRelationShip()
                    .then(result=>{
                        if (result.data.code == 200){
                            this.chartUserList = result.data.data
                        }else{
                            this.$Message.error("获取用户列表失败")
                        }
                    })
            },
            // 选择用户
            chooseUser(userName){
                if (this.usrMessageList[userName] == null){
                    this.usrMessageList[userName] = {}
                    this.usrMessageList[userName]["data"]=new Array()
                }
                if (this.usrMessageList[userName]["unRead"] != 0 && this.usrMessageList[userName]["unRead"] != undefined){
                    this.totMessage -= this.usrMessageList[userName]["unRead"]
                }
                this.usrMessageList[userName]["unRead"]=0
                this.massageList = this.usrMessageList[userName].data
                this.sendType = '/sendUsr'
                this.sendData.toUserName = userName
                this.chartTitle = userName
                // this.$refs.sendInput.focus()
                this.endScoll()
                this.openChartList = false
            },
            backPubChart(){
                this.massageList = []
                this.massageList = this.pubMassageList
                this.sendType = '/sendPub'
                this.sendData.toUserName = null
                this.chartTitle = '公共区域'
                // this.$refs.sendInput.focus()
            },
            checkInput(e) {
                if (e.key==='Enter' && e.ctrlKey === true){
                    this.sendMessage()
                }
            },
            endScoll() {
                // 新消息置底
                setTimeout(() => {
                    console.log(this.$refs)
                    this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight+100;                     
                }, 10);

            }
        }
    }
</script>
