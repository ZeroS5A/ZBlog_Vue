<style scoped>
    .logo{
        text-align: center;
        margin-bottom: 20px;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
    <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="1" style="height:100vh"></Col>
        <Col span="6">
            <div class="logo">
                <a href="/">ZBlog</a>
            </div>
            <Card style="width:100%">
                <div style="">
                    <!-- 设置验证框架 -->
                    <Form ref="formData" :model="formData" label-position="top" :rules="ruleCustom">
                        <FormItem label="用户名" prop="userName">
                            <Input placeholder="输入用户名" v-model="formData.userName">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="密码" prop="passwd">
                            <Input type="password" placeholder="输入密码" v-model="formData.passwd" @keyup.enter.native="login('formData')">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="login('formData')">登录</Button>
                            <Button @click="handleReset('formCustom')" style="margin-left: 8px">注册</Button>
                            <a :underline="false" href="/login" style="margin-left:10px">忘记密码？</a>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </Col>
        <Col span="1"></Col>
    </Row>
</template>
<script>
    import md5 from 'js-md5';
    export default {
        data(){
            // 验证逻辑
            const validatorUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入你的用户名'));
                } else {
                    callback()
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入你的密码'));
                } else {
                    callback()
                }
            };
            

            return{
                // 验证配置,应该与验证的对象名相一致
                ruleCustom: {
                    userName:[
                        { validator: validatorUserName, trigger: 'blur'}
                    ],
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                },
                formData:{
                    userName:'',
                    passwd:'',
                }
                
            }
        },
        methods:{

            login(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var postData={
                            userName:this.formData.userName,
                            password:md5(this.formData.passwd)
                        }
                        this.Request.UserLogin(postData)
                        .then(result=>{
                            if(result.data.code==4105){
                                
                            }else if(result.data.code==302){
                                this.$Message.error('账号或者密码错误');
                            }else if(result.data.code==303){
                                this.$Message.error('此账户已被封禁');
                            // 写入数据
                            }else if(result.data.code==200){
                                localStorage.setItem("UserData",JSON.stringify(result.data.data.UserData))
                                localStorage.setItem("token",result.data.data.token)
                                this.$Message.success('登录成功');
                                this.$router.push("/");
                            }else{
                                this.$Message.error(result.data.message);
                            }
                        })
                        
                    } else {
                        this.$Message.error('请检查输入');
                    }
                })

            }
        }
    }
</script>