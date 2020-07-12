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
    .userItem:hover {
        background-color: #ddd;
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

</style>

<template>
    <Layout>
        <HomeNav></HomeNav>
        <Content class="content">
            <Card class="chatCard" :padding='0' dis-hover>
                <Row>
                    <Col span="6">
                        <div style="height:85vh;background-color: #f2f2f2;">
                            <!-- 标题 -->
                            <div style="top: 0;height:8%; width:100%; background-color: #ededed; position:absolute; display: flex;justify-content: center;align-items: center;">
                                 <p>消息列表</p>
                            </div>
                            <!-- 信息对象 -->
                            <div style="top: 8%;height:92%; width:100%; position:absolute;">
                                <Scroll class="leftScotll">
                                    <div v-for="count in 10"  @click="chooseUser(count)">
                                        <ListItemMeta class="userItem" avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description..." />
                                    </div>
                                </Scroll>
                            </div>
                        </div>
                    </Col>
                    <Col span="18">
                        <div style="height:85vh;background-color: #f4f4f4;">
                            <!-- 标题 -->
                            <div style="height:8%;width:100%;position:absolute;display: flex;justify-content: center;align-items: center;">
                                 <p>ZEROS</p>
                            </div>
                            <!-- 聊天内容 -->
                            <div style="top:8%;height:72%;width:100%;position:absolute;background-color: #f8f8f8;">
                                <Scroll class="rightScotll">
                                    <!-- 聊天内容 -->
                                    <div  v-for="item in massageList">
                                        <div v-if="item.type != 'self'" class="messageItem-L">
                                            <Avatar style="margin-right:5px" class="avatar" src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" />
                                            <div class="messageItemBox-L"></div>
                                            <div class="messageItemText-L">
                                                <p style="word-break:break-all;">{{item.message}}</p>
                                            </div>
                                        </div>
                                        <div v-else class="messageItem-R">
                                            <div class="messageItemText-R">
                                                <p style="color:#fff;word-break:break-all;">{{item.message}}</p>
                                            </div>
                                            <div class="messageItemBox-R"></div>
                                            <Avatar style="margin-left:5px"  class="avatar" src="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" />
                                        </div>                                        
                                    </div>
                                </Scroll>
                            </div>
                            <!-- 输入框 -->
                            <div style="bottom:0; height:20%; width:100%; position:absolute;background-color: white;">
                                <Input v-model="sendData.message" :maxlength="250" class="chatTextBox" type="textarea" :rows="3" placeholder="开始聊天...." />
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
                massageList: [
                    {
                        user: "name",
                        message: 'hello1'
                    },
                    {
                        user: "name",
                        message: 'hello2',
                        type: 'self'
                    },
                    {
                        user: "name",
                        message: 'hello3'
                    },
                ],
                stompClient: null,
                timer: null,
                socket: null,
                sendData: {
                    message: '',
                }
            }
        },
        mounted() {
            // this.openSocket()
            this.initWebSocket();
        },
        beforeDestroy: function() {
            /** 页面离开时断开连接,清除定时器 */
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
                    var socketUrl="http://localhost:8081/MyBlog/socketTest";
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
                let socket = new SockJS('http://127.0.0.1:8081/MyBlog/socketConnect?token='+localStorage.getItem("token"));
                // 获取STOMP子协议的客户端对象
                this.stompClient = Stomp.over(socket);
                // 定义客户端的认证信息,按需求配置,目前无法找到stomp在后端的取出方法
                let headers = {
                    // Authorization:localStorage.getItem("token")
                }
                // 向服务器发起websocket连接
                this.stompClient.connect(headers,() => {
                    // 广播订阅地址
                    this.stompClient.subscribe('/topic/hello', (msg) => {
                        //转换为字符串
                        var msgData = JSON.parse(msg.body)
                        console.log(msgData);
                        that.massageList.push(msgData.data)
                        that.sendData.message = ''
                    },headers);
                    // 单点订阅地址
                    this.stompClient.subscribe('/user/alone/hi',function(msg){
                        console.log(msg)
                    });
                }, (err) => {
                    console.log('失败')
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
                this.stompClient.send(
                    '/msg',
                    {},
                    JSON.stringify(this.sendData),
                )
            }
        }
    }
</script>