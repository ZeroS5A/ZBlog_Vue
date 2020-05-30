<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>博客管理</BreadcrumbItem>
                <BreadcrumbItem>已发送</BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <div style="min-height:70vh">
                    <Table border :columns="tableTitle" :data="blogList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" @click="toBlog(index)">查看</Button>
                            <Button type="warning" size="small"@click="editBlog(index)">编辑</Button>
                            <Button type="error" size="small" @click="deleteBlog(index)">删除</Button>
                        </template>
                    </Table>
                </div>
            </Card>
        </Content>
    </Layout>
</template>
<script >
    export default {
        data(){
            return{
                tableTitle:[
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '发布时间',
                        key: 'blogDate',
                        align: 'center'
                    },
                    {
                        title: '浏览量',
                        key: 'browse',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                blogList:[]
            }
        },
        methods:{
            toBlog(e){
                console.log(this.blogList[e].blogId)
                this.$router.push('/blog/'+this.blogList[e].blogId);
            },
            editBlog(e){
                this.$router.push('/admin/editBlog/'+this.blogList[e].blogId);
            },
            deleteBlog(e){
                if(confirm("确定删除这篇文章吗?")){
                    this.Request.DeleteBlog({blogId:this.blogList[e].blogId})
                    .then(result=>{
                        if(result.data.code==200){
                            this.$Message.info("删除成功")
                            this.getBlogList()
                        }
                    })                   
                }
            },
            getBlogList(){
                this.Request.GetBlogListByUserId()
                .then(result=>{
                    if(result.data.code==200){
                        this.blogList=result.data.data
                    }else{
                        this.$Message.error("无法获取数据")
                    }
                })    
            }
        },
        mounted(){
            this.getBlogList()
        }
    }
</script>