<style scoped>
    .header{
        background-color: white;
        -moz-box-shadow:0px -2px 10px #333333; -webkit-box-shadow:0px -2px 10px #333333; box-shadow:0px -2px 10px #333333;
        position: fixed;
        z-index: 999;
        width: 100%;
        height: 60px;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
<Header class="header">
    <Row style="height: 50px;">
        <Col :xs="2" :sm="4" :md="6" :lg="4">
            <a href="/">ZBlog</a>
        </Col>
        <Col :xs="20" :sm="16" :md="12" :lg="14">
            <Row type="flex" justify="center" align="middle" class="code-row-bg" :gutter="16">
                <Col><a href="/" style="color:#3399ff">首页</a></Col>
                <Col><a style="color:#3399ff" type="text" @click="toPage('/admin/userInformation')">个人中心</a></Col>
                <Col><a style="color:#3399ff" type="text" >聊天室</a></Col>
                <Col><Input @on-search="search" v-model="searchData" search enter-button placeholder="搜标题、搜标签" /></Col>
            </Row>
        </Col>
        <Col :xs="2" :sm="4" :md="6" :lg="6">
            <Row type="flex" justify="end" :gutter="5">
                <Col span="4"><a>帮助</a></Col>
                <Col span="12">
                    <div v-if="UserData==null">
                        <a :underline="false" @click="toPage('/login')">登录</a>
                        <a :underline="false">注册</a>
                    </div>
                    <div v-else>
                        <Avatar :src="UserData.avatar" />
                        <Dropdown>
                            <a href="javascript:void(0)">
                                {{UserData.userName}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem><a style="color:#657180" @click="toPage('/admin/sended')">博客管理</a></DropdownItem>
                                <DropdownItem><a style="color:#657180" @click="toPage('/admin/newBlog')">新建博客</a></DropdownItem>
                                <DropdownItem divided><div @click="logout()">登出</div> </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </Col>
    </Row>
</Header>
</template>
<script >
    export default {
        data(){
            return{
                UserData:JSON.parse(localStorage.getItem("UserData")),
                searchData:''
            }
        },
        methods:{
            logout(){
                if(confirm("确定退出账户吗？")){
                    localStorage.clear()
                    this.$router.push({ path: '/' }).catch(data => {  })
                }
            },
            //向父组件传值
            search(){
                this.$router.push({ path: '/' }).catch(data => {  })
                this.$emit('searchData',this.searchData)
            },
            toPage(page){
                this.$router.push(page)
            }
        }

    }
</script>