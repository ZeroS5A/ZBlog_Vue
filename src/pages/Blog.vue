<style scoped>
    .content{
        margin-top: 75px;
        min-height: 900px;
        
    }
    .NavTitle{
        margin-top: 20px;
        font-family: "PingFang SC";
        font-size: 30px;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
    <Layout>
        <HomeNav></HomeNav>
        <Content class="content">
            <Row type="flex" justify="center" align="top" class="code-row-bg" :gutter="16">
                <Col span="4">
                    <ButtonGroup vertical  size="large" style="float:right">
                        <Button icon="md-arrow-round-back" size="large" @click="back"></Button>
                        <Button icon="md-star" size="large"></Button>
                        <Button @click="likeAction('blog')" :type="BlogData.like==true?'primary':'default'" icon="ios-thumbs-up" size="large"></Button>
                        <Button @click="commentAction()" icon="ios-text" size="large"></Button>
                    </ButtonGroup>
                </Col>
                <Col span="14">
                    <Card shadow>
                        <Avatar size="small" :src="BlogData.avatar" />
                        <a :underline="false" style="margin-left:10px">{{BlogData.userName}}</a>
                        <Tag color="default" style="margin-left:10px">LV0</Tag>
                        <p class="NavTitle">
                            {{BlogData.title}}
                        </p>
                        <div style="margin-top:20px">
                            <Tag v-for="item in BlogData.tagsList" :key="item.tagsId" size="medium" color="#5cadff">{{item.tagName}}</Tag>
                            <span style="margin-left:10px;color:#9ea7b4">{{BlogData.blogDate}}</span>
                        </div>
                        <Divider />
                        <!-- 以下是内容 -->
                        <div v-html="BlogData.blogContentHtml"></div>
                        <mavon-editor
                            v-if="BlogData.blogContentMd != ''"
                            style="z-index:00"
                            class="md"
                            :value="BlogData.blogContentMd"
                            :subfield = "false"
                            :boxShadow = "false"
                            :defaultOpen = "'preview'"
                            :toolbarsFlag = "false"
                            :editable="false"
                            :scrollStyle="true"
                            :ishljs = "true"
                        />
                        
                        <Divider>{{BlogData.browse}}阅读</Divider>
                        <div style="margin-top:20px;text-align:center">
                            <Button icon="md-star">收藏(暂未开放)</Button>
                            <Button @click="likeAction('blog')" :type="BlogData.like==true?'primary':'default'" icon="ios-thumbs-up" style="margin-left:10px">点赞{{BlogData.likeNum}}</Button>
                        </div>
                    </Card>
                    <Divider orientation="left">{{commentList.total==undefined?'0':commentList.total}}条评论</Divider>
                    <!-- 以下是评论 -->
                    <Card shadow>
                        <div style="height:70px;width:100%">
                            <Row type="flex" justify="center" align="middle">
                                <Col span="2"><Avatar size="large" :src="userData==null?'':userData.avatar" /></Col>
                                <Col span="19"><Input :disabled="userData==null" ref=comment v-model="commentContent" maxlength="150" show-word-limit type="textarea" :rows='3' :placeholder="userData==null?'请登录后发言':'畅所欲言吧~~~'" style="width:98%;height:100%" /></Col>
                                <Col span="3"><Button :disabled="userData==null" @click="addComment" type="primary" style="height: 70px;width:100%">发表</Button></Col>
                            </Row>
                        </div>
                        
                        <Divider/>
                        <Row type="flex" justify="center" class="code-row-bg" v-if="commentList.list.length==0">
                            <p>期待你的评论</p>
                        </Row>
                        <div v-else>
                            <Row v-for="Comment in commentList.list" :key="Comment.commentId" >
                                <Col span="2">
                                    <Avatar :src="Comment.avatar" />
                                </Col>
                                <!-- 评论列表 -->
                                <Col span="22">
                                    <a :underline="false"><strong>{{Comment.userName}}</strong></a>
                                    <Tag :color="Comment.rank" style="margin-left:10px">LV1</Tag>
                                    <p style="margin-top:10px;color:#464c5b">{{Comment.content}}</p>
                                    <p style="margin-top:15px;color:#9ea7b4">{{Comment.date}} 
                                    <a :underline="false" @click="likeAction('comment',Comment)" style="margin-left:10px;"><Icon :type="Comment.like==true?'ios-thumbs-up-outline':'ios-thumbs-up'"/>{{Comment.likeNum}}</a>
                                    <a :underline="false" v-if="commentId!=Comment.commentId" style="margin-left:10px" @click="openComment(Comment.commentId)"><Icon type="ios-text-outline" />{{Comment.commentNum}} 展开</a>
                                    <a :underline="false" v-else style="margin-left:10px" @click="closeComment"><Icon type="ios-text-outline" />{{Comment.commentNum}} 收起</a>
                                    <a :underline="false" style="margin-left:10px" @click="openChildComment(Comment)">回复</a>
                                    <a :underline="false" style="margin-left:10px;" type="danger" @click="deleteComment(Comment,'comment')" v-if="userData!=null&&Comment.userName==userData.userName">删除</a>
                                    </p>
                                    <!-- 评论的评论输入框 -->
                                    <Row v-if="Comment.commentId==dialogId" type="flex" justify="start" align="middle">
                                        <Col span="18"><Input :disabled="userData==null" v-model="commentChildContent" maxlength="50" show-word-limit :placeholder="'回复 '+commentChildUserName+'：'" style="width:98%;margin-top:5px" /></Col>
                                        <Col span="4"><Button :disabled="userData==null" type="primary" style="margin-top:5px" @click="addChildComment(Comment.commentId,Comment.userName)">回复</Button></Col>
                                    </Row>
                                    <!-- 展开回复的回复(如果选择的评论是这个评论的话) -->
                                    <div v-if="Comment.commentId==commentId" style="border-left: 5px solid #dcdee2;padding-left:5px;margin-top:10px">
                                        <Row v-for="CommentChild in commentChildList" :key="CommentChild.commentId">
                                            <div style="margin:10px">
                                            <Col span="1">
                                                <Avatar size="small" :src="CommentChild.avatar" />
                                            </Col>
                                            <Col span="23">
                                                <a :underline="false" style="font-size:12px;margin-left:10px"><strong>{{CommentChild.userName}}</strong></a>
                                                <br/>
                                                <span style="display:inline-block;width:80%;word-wrap:break-word;white-space:normal;margin-top:5px;margin-left:10px">
                                                    {{CommentChild.toUserName==null?'':'回复@'+CommentChild.toUserName+'：'}}{{CommentChild.content}}
                                                </span>
                                                <p style="margin-top:5px;color:#9ea7b4;margin-left:10px">{{CommentChild.date}} 
                                                <a :underline="false" @click="likeAction('commentChild',CommentChild)" style="margin-left:10px;"><Icon :type="CommentChild.like==true?'ios-thumbs-up-outline':'ios-thumbs-up'" />{{CommentChild.likeNum}}</a>
                                                <a id="childCommend" :underline="false" style="margin-left:10px" @click="openChildCommentToUser(CommentChild)">回复</a>
                                                <a :underline="false" style="margin-left:10px;" type="danger" @click="deleteComment(CommentChild,'commentChild')" v-if="userData!=null&&CommentChild.userName==userData.userName">删除</a>
                                                </p>
                                            </Col>                                               
                                            </div>
                                        </Row> 
                                    </div>
                                    <Divider/>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Row type="flex" justify="center" class="code-row-bg" style="margin-top:20px">
                        <Page @on-change="changePage" :total="commentList.total" :page-size="commentList.pageSize" show-elevator />
                    </Row>
                </Col>
                <!-- 侧边栏 -->
                <Col span="4">
                    <Card shadow>
                        <p slot="title">关于作者</p>
                        <p>这里写信息</p>
                        <p>这里写信息啊</p>
                        <div style="margin-top:20px;text-align:center">
                            <Button type="primary" icon="ios-search">关注</Button>
                            
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
        <HomeFooter></HomeFooter>
        <BackTop :height="100" :bottom="100">
            <div class="top"><Icon type="md-arrow-round-up" color="blue"/></div>
        </BackTop>
    </Layout>
</template>
<script>
    // 引入组件
    import HomeNav from "@/components/frontground/Home-Nav";
    import HomeFooter from "@/components/frontground/Home-Footer"
    export default {
        components: {
            //导航条
            HomeNav,
            HomeFooter
        },
        data(){
            return{
                BlogData:[],
                commentContent:null,
                commentChildContent:null,
                commentChildUserName:null,
                userData:JSON.parse(localStorage.getItem("UserData")),
                commentList:{
                    list:[]
                },
                commentChildList:null,
                pageNum:0,
                commentId:'',
                dialogId:'',
                lastCommentId:null
            }
        },
        methods:{
            //
            back(){
                window.history.back(-1); 
            },
            commentAction(){
                this.$refs.comment.focus()
            },
            // 点赞
            likeAction(type,comment){
                if(this.userData==null){
                    this.$Message.info("请登录后再操作")
                }else{
                    //未点赞
                    if(!this.BlogData.like && type=='blog'){
                        this.Request.AddLike({blogId:this.BlogData.blogId})
                        .then(result=>{
                            if(result.data.code==200){
                                this.BlogData.like=true
                                this.BlogData.likeNum+=1
                            }
                        })
                    //已点赞
                    }else if(this.BlogData.like==true && type=='blog'){
                        this.Request.DeleteLike({blogId:this.BlogData.blogId})
                        .then(result=>{
                            if(result.data.code==200){
                                this.BlogData.like=false
                                this.BlogData.likeNum-=1
                            }
                        })
                    }
                    if(type=='comment'){
                        //获取点击的是哪个评论赞
                        const index=this.commentList.list.indexOf(comment);
                        var postData={
                            commentId:comment.commentId,
                            blogId:this.BlogData.blogId,
                        }
                        if(this.commentList.list[index].like){
                            this.Request.AddLike(postData)
                            .then(result=>{
                                if(result.data.code==200){
                                    this.commentList.list[index].like=false
                                    this.commentList.list[index].likeNum+=1
                                }
                            })                            
                        }else{
                            this.Request.DeleteLike(postData)
                            .then(result=>{
                                if(result.data.code==200){
                                    this.commentList.list[index].like=true
                                    this.commentList.list[index].likeNum-=1
                                }
                            })                           
                        }
                    }
                    if(type=='commentChild'){
                        //获取点击的是哪个评论赞
                        const index=this.commentChildList.indexOf(comment);
                        var postData={
                            commentId:comment.commentId,
                            blogId:this.BlogData.blogId,
                            dialogId:comment.dialogId,
                            rootId:comment.rootId
                        }
                        if(this.commentChildList[index].like){
                            this.Request.AddLike(postData)
                            .then(result=>{
                                if(result.data.code==200){
                                    this.commentChildList[index].like=false
                                    this.commentChildList[index].likeNum+=1
                                }
                            })                            
                        }else{
                            this.Request.DeleteLike(postData)
                            .then(result=>{
                                if(result.data.code==200){
                                    this.commentChildList[index].like=true
                                    this.commentChildList[index].likeNum-=1
                                }
                            })                           
                        }
                    }
                }
            },
            // 添加主评论
            addComment(){
                if(this.commentContent==null || this.commentContent==''){
                    this.$Message.error("评论内容为空") 
                }else if(this.commentContent.length<3){
                    this.$Message.error("评论不能少于3字")
                }else{
                    var postData={
                        blogId:this.BlogData.blogId,
                        content:this.commentContent
                    }
                    this.Request.AddComment(postData)
                    .then(result=>{
                        if(result.data.code==200){
                            this.$Message.success("评论成功")
                            //手动在头部添加
                            this.commentList.list.unshift(
                                {
                                    avatar: this.userData.avatar,
                                    commentId: result.data.data.commentId,
                                    content: result.data.data.content,
                                    date: result.data.data.date,
                                    userName: this.userData.userName,
                                    like:true,
                                    likeNum:null
                                }
                            )
                            //情况输入框
                            this.commentContent=null
                        }else{
                            this.$Message.error("请登录或服务异常!")
                        }
                    })
                }
            },
            // 获取评论
            getComment(){
                var postData={
                    blogId:this.$route.params.id,
                    pageNum:this.pageNum,
                    token:localStorage.getItem('token')
                }
                this.Request.GetComment(postData)
                .then(result=>{
                    if(result.data.code==200){
                        this.commentList=result.data.data
                    }else if(result.data.code==404){
                        //如果是无数据，那么重置列表
                        this.commentList={list:[]}
                    }else{
                        this.$Message.error("获取评论失败")
                    }
                })
            },
            // 打开子评论
            openChildComment(Comment){
                //添加回复名
                this.commentChildUserName=Comment.userName
                //清空输入框
                this.commentChildContent=null
                this.dialogId=Comment.commentId
                //再打开子评论
                this.openComment(Comment.commentId)
            },
            //设置输入框的提示词，如果是对回复的回复进行回复，还会设置对评论的id
            openChildCommentToUser(CommentChild){
                this.dialogId=CommentChild.dialogId
                this.commentChildUserName='@'+CommentChild.userName
                this.lastCommentId=CommentChild.commentId
                //聚焦
            },
            // 添加子评论
            addChildComment(dialogId,userName){
                if(this.commentChildContent==null || this.commentChildContent==''){
                    this.$Message.error("评论内容为空") 
                }else if(this.commentChildContent.length<3){
                    this.$Message.error("评论不能少于3字")
                }else{
                    var postData={
                        blogId:this.BlogData.blogId,
                        content:this.commentChildContent,
                        dialogId:dialogId,
                        lastCommentId:this.lastCommentId
                    }
                    this.Request.AddComment(postData)
                    .then(result=>{
                        if(result.data.code==200){
                            this.$Message.success("评论成功")
                            //重新获取子评论
                            this.openComment(dialogId)
                            //清空输入框
                            this.commentChildContent=null
                            //清空对谁回复的状态
                            this.commentChildUserName=userName
                            this.lastCommentId=null
                        }else{
                            this.$Message.error("请登录或服务异常!")
                        }
                    })
                }
            },
            changePage(e){
                this.pageNum=e
                this.getComment()
            },
            // 获取子评论
            openComment(commentId){
                //展开之前删除一下，防止数据错乱
                this.commentChildList=[]
                this.commentId=commentId
                this.Request.GetCommentChild({dialogId:commentId,token:localStorage.getItem('token')})
                .then(result=>{
                    if(result.data.code==200){
                        this.commentChildList=result.data.data
                    }else if(result.data.code==404){
                        this.$Message.info("此评论还没有回复噢")
                        this.commentId=''
                    }else{
                        this.$Message.error(result.data.message)
                    }
                })
            },
            // 收起评论
            closeComment(){
                this.commentChildList=null,
                this.commentId=''
            },
            // 删除评论
            deleteComment(e,type){
                this.$Modal.confirm({
                    title: '警告',
                    content: '<p>确定删除这条评论吗？</p>',
                    okText: '删除',
                    cancelText: '取消',
                    onOk:()=>{
                        this.Request.DeleteComment(e)
                        .then(result=>{
                            if(result.data.code==200){
                                //重新获取信息
                                // this.getComment()
                                //从本地列表删除
                                if(type=='comment'){
                                    //获取索引
                                    const index=this.commentList.list.indexOf(e)
                                    this.commentList.list.splice(index,1)
                                }
                                //如果是子评论，则涉及到楼中楼，需要重新获取  
                                else if(type=='commentChild'){
                                    this.openComment(e.dialogId)
                                }   
                                this.$Message.success("删除成功")
                            }
                        })
                    }
                });
            },
        },
        mounted(){
            var postData={
                blogId:this.$route.params.id,
                token:localStorage.getItem('token'),
            }
            this.Request.GetBlog(postData)
            .then(Result => {
                if (Result.data.code === 200) { // 成功
                    this.BlogData = Result.data.data
                    //获取评论
                    this.getComment()
                } else { // 失败
                    this.$Message.error(Result.data.message) // 提示
                }
            })
        }
    }
</script>