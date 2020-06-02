<style scoped>
    .content{
        margin-top: 75px;
        min-height: 900px;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
    <Layout>
        <!-- 导航条组件 接受子组件传值 -->
        <HomeNav v-on:searchData="search"></HomeNav>
        <!-- 页面内容 -->
        <Content class="content">
            <Row type="flex" justify="center" align="top" class="code-row-bg" :gutter="16">
                <!-- 左边栏目 -->
                <Col span="4">
                    <Card title="今日推荐" icon="md-bulb" :padding="0" shadow >
                        <CellGroup @on-click="changeLabel">
                            <Cell title="推荐阅读" name="A" :selected="classLabal=='推荐阅读'"/>
                            <Cell title="近期热门" name="B" :selected="classLabal=='近期热门'"/>
                            <Cell title="最新博文" name="C" :selected="classLabal=='最新博文'"/>
                        </CellGroup>
                    </Card>

                    <Card v-for="items in ClassLabelList" :key="items.classId" :padding="0" shadow >
                        <p slot="title">
                            <a @click.prevent="changeClass(items)">
                            <Icon :type="items.icon"></Icon>
                            {{items.name}}
                            </a>
                        </p>
                        <a slot="extra" >
                            <Icon type="ios-arrow-forward" />   
                        </a>
                        <!-- 子标题 -->
                        <CellGroup>
                            <a v-for="item in items.tTagsList" :key="item.classId" @click="changeLabel(item)">
                                <Cell :title="item.tagName" :selected="classLabal==item.tagName"/>
                            </a> 
                        </CellGroup>
                    </Card>                       
                </Col>
                <!-- 中间内容 -->
                <Col span="12">
                    <!-- 滚动图片 -->
                    <Carousel autoplay loop :height='150'>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img style="max-width: 100%;max-height: 100%; margin: auto;" src="https://lczeros.cn/blogData/images/1.png" alt="">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img style="max-width: 100%;max-height: 100%; margin: auto;" src="https://lczeros.cn/blogData/images/2.png" alt="">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img style="max-width: 100%;max-height: 100%; margin: auto;" src="https://lczeros.cn/blogData/images/3.png" alt="">
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div class="demo-carousel">
                                <img style="max-width: 100%;max-height: 100%; margin: auto;" src="https://lczeros.cn/blogData/images/4.png" alt="">
                            </div>
                        </CarouselItem>
                    </Carousel>
                    <Divider>{{classLabal}}</Divider>
                    <!-- 博文详情 -->
                    <List item-layout="vertical">
                        <Card shadow>
                            <ListItem v-for="item in BlogList" :key="item.blogId">
                                <a @click="toBlog(item.blogId)" style="color:black">
                                    <ListItemMeta :title="item.title" :description="item.summary" />
                                </a> 
                                <Row type="flex" justify="center" align="middle">
                                    <Col span="12">
                                        <Avatar size="small" :src="item.avatar" />
                                        <a :underline="false" style="margin-left:10px">{{item.userName}}</a>
                                        <span style="margin-left:10px;color:#9ea7b4">{{item.blogDate}}</span>
                                    </Col>
                                    <Col span="8" offset="4">
                                        <Icon size="15" type="md-star-outline" />
                                        <Icon type="ios-thumbs-up-outline"  style="margin-left:10px"/>{{item.likeNum}}
                                        <Icon type="ios-text-outline" style="margin-left:10px"/>{{item.commentNum}}
                                        <Icon type="ios-eye" style="margin-left:10px"/>{{item.browse}}
                                    </Col>
                                </Row>
                            </ListItem>
                                              
                        </Card>
                    </List>
                    <!-- 页面选择器 -->
                    <Row type="flex" justify="center" class="code-row-bg" style="margin-top:20px">
                        <Page :total="pageNumData.total" :page-size="pageNumData.pageSize" @on-change="changePage" show-elevator />
                    </Row>
                            
                </Col>
                <!-- 右边公告 -->
                <Col span="4">
                    <Card dis-hover>
                        <p slot="title">公告栏目</p>
                        <p><a style="color:#3399ff" @click="toBlog(1)" type="text">关于注册</a></p>
                        <p><a style="color:#3399ff" @click="toBlog(2)" type="text">关于网站</a></p>
                        <p><a style="color:#3399ff" @click="toBlog(3)" type="text">联系我们</a></p>
                        <p><a style="color:#3399ff" @click="toBlog(4)" type="text">更新公告</a></p>
                    </Card>
                </Col>
            </Row>
        </Content>
        <!-- 页脚 -->
        <HomeFooter></HomeFooter>
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
        data () {
            return {
                BlogList:[],
                classLabal:'推荐阅读',
                ClassLabelList:[],
                postData:{
                    pageNum:0,
                    title:'%',
                    tagName:'%',
                    classId:'%'
                },
                pageNumData:{
                    total:0,
                    pageNum:0,
                    pageSize:0,
                }
            }
        },
        methods:{
            //跳转到具体博客
            toBlog(e){
                this.$router.push({path:'blog/'+e});
            },
            //获取博客列表
            getBlogList(){
                this.Request.GetBlogList(this.postData)
                .then(Result=>{
                    if(Result.data.code==200){
                        this.BlogList=Result.data.data.list
                        //设置分页
                        this.pageNumData={
                            total:Result.data.data.total,
                            pageNum:Result.data.data.pageNum,
                            pageSize:Result.data.data.pageSize,
                        }
                    }
                })
            },
            //页面切换操作
            changePage(e){
                this.postData.pageNum=e
                this.getBlogList()
            },
            //切换子标题
            changeLabel(e){
                if(e==='A'){
                    this.classLabal='推荐阅读'
                    this.postData={
                        title:'%',
                        tagName:'%',
                        classId:'%'
                    }  
                }else if(e==='B'){
                    this.classLabal='近期热门'
                    this.postData={
                        title:'%',
                        tagName:'%',
                        classId:'%'
                    } 
                }else if(e==='C'){
                    this.classLabal='最新博文'
                    this.postData={
                        title:'%',
                        tagName:'%',
                        classId:'%'
                    } 
                }else{
                    this.classLabal=e.tagName
                    this.postData={
                        title:'',
                        tagName:e.tagName==''?'%':e.tagName,
                        classId:e.classification
                    }                  
                }
                this.getBlogList()
            },
            //切换大分类
            changeClass(e){
                this.classLabal=e.name
                this.postData={
                    title:'%',
                    tagName:'%',
                    classId:e.classId
                }
                this.getBlogList()
            },
            //接受子组件传值
            search(searchData){
                this.postData={
                    title:'%'+searchData+'%',
                    tagName:'%'+searchData+'%',
                    classId:'%'
                }
                this.getBlogList()
            }
        },
        mounted() {
            this.getBlogList()
            //获取分类
            this.Request.GetHomeClass()
            .then(result=>{
                if(result.data.code==200){
                    this.ClassLabelList=result.data.data
                }else{
                    this.$Message.error("获取分类失败")
                }
            })
        },
    }
</script>
