<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>博客管理</BreadcrumbItem>
                <BreadcrumbItem>新博客</BreadcrumbItem>
            </Breadcrumb>
                <div style="min-height:80vh">
                    <Row type="flex" justify="center" align="top" class="code-row-bg">
                        <Col span="19">
                            <Card>
                                <Row type="flex" justify="center" align="middle">
                                    <Col span="16"><Input v-model="BlogData.title" maxlength="20" size="large" show-word-limit placeholder="请输入文章标题" /></Col>
                                    <Col span="4" offset="4">
                                    <div>
                                        <i-switch v-model="isMd" @on-change="changeEditor" true-color="#13ce66" false-color="#3480d3" size="large">
                                            <span slot="open">MD</span>
                                            <span slot="close">Html</span>
                                        </i-switch>
                                    </div>
                                        
                                    </Col>
                                </Row>
                                <!-- 富文本编辑器 -->
                                <div style="margin-top:20px">
                                    <div ref="editor" style="text-align:left"></div>
                                </div>
                                <div style="text-aligin:center;margin-top:20px">
                                    <Button @click="getContent">预览内容</Button>
                                    <Button @click="submitBlog" type="primary">发布文章</Button>
                                </div>
                            </Card>
                        </Col>
                        <Col span="5">
                            <Collapse :value="open">
                                <Panel name="1">
                                    发布板块
                                    <p slot="content">
                                        <Select v-model="BlogData.classId" @on-change="changeClass" placeholder="选择板块">
                                            <Option v-for="item in classList" :value="item.classId" :key="item.classId">{{ item.name }}</Option>
                                        </Select>
                                        <!-- <Select v-model="BlogData.tagsList" :disabled="BlogData.classId==''" filterable allow-create @on-create="handleCreate" multiple placeholder="选择标签" style="margin-top:10px">
                                            <Option v-for="item in labelList" :value="{tagsId:item.tagsId}" :key="item.tagsId">{{ item.tagName }}</Option>
                                        </Select> -->

                                        <Select v-model="linsTag" @on-change="addTag" placeholder="选择标签来添加" :disabled="BlogData.classId==''" :label-in-value="true" style="margin-top:10px">
                                            <Option v-for="item in labelList" :value="item.tagsId" :key="item.tagsId">{{ item.tagName }}</Option>
                                        </Select>
                                        <Divider>已添加的标签</Divider>
                                        <Tag color="primary" closable @on-close="delTag(item)" v-for="item in BlogData.tagsList" :key="item.tagsId">{{item.tagName}}</Tag>
                                        <!-- <Select v-model="linsTag" multiple>
                                            <Option v-for="item in labelList" :value="item" :label-in-value="true" :key="item.tagsId">{{ item.tagName }}</Option>
                                        </Select> -->
                                    </p>
                                </Panel>
                                <Panel name="2">
                                    简介描写
                                    <p slot="content">
                                        <Input v-model="BlogData.summary" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="该博主没有写简介噢" />
                                    </p>
                                </Panel>
                                <Panel name="3">
                                    文章设定
                                    <p slot="content">
                                    </p>
                                </Panel>
                            </Collapse>
                            
                        </Col>
                    </Row>
                </div>
        </Content>
    </Layout>
</template>
<script >
    import E from 'wangeditor'
    
    export default {
        name: 'editor',
        data(){
            return{
                editorContent: '',
                editor : null,
                open:[1,2],
                isMd:false,
                BlogData:{
                    title:'',
                    classId:'',
                    tagsList:[],
                    summary:"该博主没有写简介噢",
                    blogContentHtml:'',
                    blogContentMd:''
                },
                editorType:[
                    {
                        id:'1',
                        type:'HTML编辑器'
                    },{
                        id:'2',
                        type:'MD编辑器'
                    }
                ],
                classList:[],
                labelList:[],
                linsTag:[]
            }
        },
        methods: {
            changeClass(e){
                this.BlogData.tagsList=[]
                var postData={
                    classId:this.BlogData.classId
                }
                this.Request.GetTagsList(postData)
                .then(response=>{
                    if(response.data.code==200){
                        this.labelList=response.data.data
                    }else{
                        alert("获取标签失败！")
                    }
                })
            },
            //新添加标签(暂停使用)
            handleCreate (val) {
                var postData={
                    tagName:val,
                    classification:this.BlogData.classId
                }
                this.Request.InsertTags(postData)
                .then(response=>{
                    if(response.data.code==200){
                        this.labelList.push({
                            tagsId: response.data.data.tagsId,
                            tagName: response.data.data.tagName
                        });
                        // this.BlogData.tagsList.push({
                        //     tagsId: response.data.data.tagsId,
                        // })
                        // this.linsTag=''
                    }else{
                        alert("添加失败！")
                    }
                })

            },
            addTag(e){
                this.BlogData.tagsList.push({
                    tagsId: e.value,
                    tagName: e.label
                })
            },
            delTag(item){
                const index = this.BlogData.tagsList.indexOf(item);
                this.BlogData.tagsList.splice(index,1)
            },
            changeEditor (status) {
                this.$Message.info(status?"切换到MD编辑器":"切换到Html编辑器");
                this.isMd=status
            },
            getContent: function () {
                console.log(this.linsTag)
                alert(this.BlogData.tagsList)
            },
            submitBlog(){
                if(this.BlogData.title==""){
                    alert("请输入标题")
                }else if(this.BlogData.classId==''){
                    alert("请选择一个板块")
                }else if(this.BlogData.blogContentHtml == '' && this.BlogData.blogContentMd == ''){
                    alert("请输入正文")
                }else{
                    this.Request.InsertBlog(this.BlogData)
                    .then(result=>{
                        if(result.data.code==200){
                            this.$Message.success("发送成功");
                            this.$router.push({path:'/admin/sended'});
                        }else if(result.data.code==504){
                            this.$Message.info("标签添加失败或无标签")
                        }else{
                             this.$Message.error(result.data.message)
                        }
                    })
                }
            },
            setEditor(){
                this.editor=new E(this.$refs.editor)
                this.editor.customConfig.onchange = (html) => {
                    this.BlogData.blogContentHtml = html
                }
                this.editor.customConfig.zIndex = 0 // 配置编辑区域的 z-index
                this.editor.customConfig.uploadImgServer = '/MyBlog/upload/image' // 上传图片到服务器 配置服务器端地址
                this.editor.customConfig.uploadImgHeaders = {
                    'Authorization': localStorage.getItem('token'),
                }
                this.editor.customConfig.uploadFileName = 'image'
                this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 1 张图片
                this.editor.customConfig.uploadImgTimeout = 60000
                this.editor.customConfig.uploadImgHooks = {
                    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                    customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                    // 举例：假如上传图片成功后，服务器端返回的是 {data:'....'} 这种格式，即可这样插入图片：
                    insertImg(result.data.imgUrl)
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                    }
                }
                this.editor.create()
            }
        },
        
        mounted() {
            this.setEditor()
            //获取分类数据
            this.Request.GetClassificationList()
            .then(response=>{
                if(response.data.code==200){
                    this.classList=response.data.data
                }
            })
            //是否是修改博客
            if(this.$route.params.id!=null){
                this.Request.GetBlog({blogId:this.$route.params.id})
                .then(Result => {
                    if (Result.data.code === 200) { // 成功
                        this.BlogData = Result.data.data
                        //设置编辑器
                        this.editor.txt.html(Result.data.data.blogContentHtml)
                        //设置标签
                        this.labelList=Result.data.data.tagsList
                    } else { // 失败
                        this.$Message.error(Result.data.data.message) // 提示
                    }
                })
            }
        },
        beforeRouteLeave (to, from, next) {
            this.BlogData=[]
            this.editor.txt.clear()
            next()
        }
    }
</script>