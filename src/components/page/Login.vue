<template>
    <div class="login-wrap">
        <div class="ms-title">SkyWorth海外智能后台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div class="sky-operate">
                    <a class='register'>注册</a>
                    <a class='forget'>忘记密码</a>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (self.ruleForm.username === 'admin' && self.ruleForm.password === 'admin') {
                            localStorage.setItem('ms_username',self.ruleForm.username);
                            self.$router.push('/');
                        } else {
                            self.$message({
                                message: '账号或密码错误，请重新输入',
                                type: 'error',
                                center: true
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang='scss'>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url('../../../static/img/bg.jpg') 100% 100% no-repeat;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .sky-operate{
        width: 100%;
        overflow: hidden;
        .register,.forget{
            font-size:12px;
            line-height:40px;
            color:#4a9aea;
            cursor: pointer;
            float: left;
        }
        .forget{
            float: right;
        }
    }
</style>