<template>
    <!-- 注册 -->
    <div class="register-wrap">
        <div class="ms-title">注册</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item prop="name" label="用户名">
                    <el-input v-model="ruleForm.name" placeholder="请填写用户名"></el-input>
                </el-form-item>
                <el-form-item prop="account" label="账号">
                    <el-input v-model="ruleForm.account" placeholder="请填写账号"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" placeholder="请填写密码" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="电话">
                    <el-input v-model="ruleForm.phone" placeholder="请填写电话号码"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="ruleForm.email" placeholder="请填写e-mail地址"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="radio" label="1">男</el-radio>
                    <el-radio v-model="radio" label="2">女</el-radio>
                </el-form-item>
                <div class="register-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">注 册</el-button>
                </div>
                <div class="sky-operate">
                    <p>已有账号？ <router-link :to="{name: 'login'}">登 录</router-link></p>
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
                    name: '',
                    account: '',
                    password: '',
                    phone: '',
                    email: '',
                    sex: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请填写用户名', trigger: this.submitForm }
                    ],
                    account: [
                        { required: true, message: '请填写账号', trigger: this.submitForm }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: this.submitForm }
                    ],
                    phone: [
                        { required: true, message: '请填写电话号码', trigger: this.submitForm }
                    ],
                    email: [
                        { required: true, message: '请填写e-mail', trigger: this.submitForm }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: this.submitForm }
                    ]
                },
                radio: '1'
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
    .register-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url('../../../../static/img/bg.jpg') 100% 100% no-repeat;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -290px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height: 390px;
        margin-top: -225px;
        margin-left: -190px;
        padding:40px;
        padding-bottom: 20px;
        border-radius: 5px;
        background: #fff;
    }
    .register-btn{
        text-align: center;
        margin: 2% 0;
        button{
            width:100%;
            height:36px;
        }
    }
    .sky-operate{
        width: 100%;
        overflow: hidden;
        p{
            font-size:12px;
            line-height:40px;
            color:#777;
            a{
                color:#4a9aea;
                cursor: pointer;
            }
        }
    }
</style>