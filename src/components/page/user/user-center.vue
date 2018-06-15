<template>
    <!-- 用户 -->
    <div class="user-home">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form" label-width="80px">
                        <el-row :gutter="30">
                            <el-col :span="6">
                                <el-form-item label="名称 / 账号">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="searchName"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.tourName }}</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-button type="primary" icon="search" @click="searchUser()">查询</el-button>
                            <el-button type="primary" icon="search" @click="editInformation(true)">新增</el-button>
                        </el-row>
                    </el-form>
                </div>
                <!-- 分页 -->
                <div>
                    <div class="block">
                        <el-pagination class="page-box"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageQuery.pageNum"
                        :page-sizes="[10, 20, 30]"
                        :page-size="pageQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageQuery.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <!-- table -->
            <div>
                <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" sortable width="50" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column prop="tourTypeName" label="用户类型" width="100" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column label="账号" width="120" header-align="center">
                        <template slot-scope="scope">
                            <a class="click-name" @click="editInformation(false, scope.row)">{{ scope.row.tourAccount }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tourName" label="名称" width="120" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tourTelphone" label="电话号码" width="120" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tourMail" label="邮箱" width="150" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tourAddress" label="地址" width="auto" header-align="center">
                    </el-table-column>
                    <el-table-column label="状态" width="80" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '有效' : '无效' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 用户信息管理窗口 -->
        <el-dialog :title=" isAdd ? '用户新增' : '用户修改'" :visible.sync="editVisible" width="30%" ref="dialog" @close="close(ruleForm)">
            <el-form :model="ruleForm" ref="ruleForm" label-width="90px" class="demo-ruleForm">
                <el-form-item label="名称：" class="required-label">
                    <el-input v-model="ruleForm.tourName" placeholder="请填写名字" :disabled="isAdd ? false : true" maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="账号：" class="required-label">
                    <el-input v-model="ruleForm.tourAccount" placeholder="请填写账号" :disabled="isAdd ? false : true" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="密码：" v-if="isAdd" class="required-label">
                    <el-input v-model="ruleForm.tourPassword" placeholder="请填写密码" maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="类型：" v-if="isAdd" class="required-label">
                    <el-select v-model="ruleForm.tourType" placeholder="请选择类型">
                        <el-option
                        v-for="item in userType"
                        :key="item.codeCode"
                        :label="item.codeName"
                        :value="item.codeCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="英文名：">
                    <el-input v-model="ruleForm.tourEnglishName" placeholder="请填写英文名" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="ruleForm.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="ruleForm.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-form-item label="性别：" class="required-label">
                    <el-radio v-model="ruleForm.tourSex" :label="1">男</el-radio>
                    <el-radio v-model="ruleForm.tourSex" :label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="电话：">
                    <el-input v-model="ruleForm.tourTelphone" placeholder="请填写电话号码" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱：">
                    <el-input v-model="ruleForm.tourMail" placeholder="请填写e-mail" maxlength="25"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址：">
                    <el-input v-model="ruleForm.tourAddress" placeholder="请填写地址" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="传真：">
                    <el-input v-model="ruleForm.tourFox" placeholder="请填写传真" maxlength="20"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="" @click="editVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addUser()">提 交</el-button>
                <el-button v-if="!isAdd" type="primary" @click="updateInfo()">提 交</el-button>
                <el-button v-if="!isAdd" type="danger" @click="deleteUser()">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import $ from 'jquery'
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                isAdd: true, // 区分新增用户还是修改用户
                editVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: '',
                    phone: '',
                    userType: ''
                },
                ruleForm: {
                    isenable: 1,
                    tourType: '1',
                    tourAccount: '',
                    tourName: '',
                    tourEnglishName: '',
                    tourSex: 1,
                    tourAddress: '',
                    tourTelphone: '',
                    tourMail: '',
                    tourFox: '',
                    tourId: '',
                    tourTypeName: '',
                    tourPassword: ''
                },
                userType: [], // 用户类型
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                editForm: [], // 保存修改
                restaurants: [],
                searchName: '',
                searchAccount: '',
                state2: '',
                idx: -1
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.querySearchData()
            this.$refs.dialog.close()
            this.getSelectData('user_type')
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航-当前页
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getData()
            },
            // 一页显示条目
            handleSizeChange (val) {
                this.pageQuery.pageSize = val
                this.getData()
            },
            handleSelectionChange () {

            },
            // 获取用户数据
            getData() {
                let self = this
                let dataUrl = '/api/user/queryUserList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        self.tableData = data.list
                        self.pageQuery.total = data.total
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            // 搜索
            searchUser () {
                let self = this
                console.log(this.searchName)
                let params = {tourAccount: self.searchAccount}
                if (this.searchName == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: '/api/user/queryUserList',
                        param: params,
                        success: function (data) {
                            self.tableData = data.list
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                        }
                    })
                }
            },
            // 打开用户信息管理窗口
            editInformation (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增
                    self.ruleForm.isenable = 1
                    self.ruleForm.tourSex = 1
                    self.ruleForm.tourType = '1'
                    for (let key in self.ruleForm) { // 新增清空数据列表
                        if (key != 'isenable' && key != 'tourSex' && key != 'tourType') {
                            delete self.ruleForm[key]
                        }
                    }
                    self.isAdd = view
                } else { // 修改
                    let params = {tourId: data.tourId}
                    crud.skyworthGet({ // 通过id获取当前用户信息
                        url: '/api/user/findUserById',
                        param: params,
                        success: function (data) {
                            self.ruleForm = data
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                        }
                    })
                    self.isAdd = view
                }
                this.editVisible = true
            },
            // 关闭
            close (formName) {
                console.log(formName)
                // this.$refs[formName].resetFields()
            },
            // 修改
            updateInfo () {
                let self = this
                let parmams = this.ruleForm
                // $.ajax({
                //     type: 'post',
                //     dataType: 'json',
                //     contentType: 'application/json',
                //     url: 'http://172.20.114.62:8082/tvmanage/user/updateUser',
                //     data: JSON.stringify(parmams),
                //     success: function (data) {
                //         self.$message({
                //             message: data.msg,
                //             type: 'success',
                //             center: true
                //         })
                //         self.editVisible = false
                //     },
                //     error: function (data) {
                //         self.$message({
                //             message: '错误',
                //             type: 'error',
                //             center: true
                //         })
                //     }
                // })
                crud.skyworthComplexUpdate({
                    url: '/api/user/updateUser',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.editVisible = false
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            // 新增用户
            addUser () {
                let self = this
                let parmams = this.ruleForm
                crud.skyworthComplexSave({
                    url: '/api/user/addUser',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.editVisible = false
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            // 删除用户
            deleteUser () {
                let self = this
                crud.skyworthDelete({
                    url: '/api/user/deleteUser' + '?tourId=' + self.ruleForm.tourId,
                    param: '',
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.editVisible = false
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            // 获取下拉列表数据
            getSelectData (type) {
                let self = this
                crud.skyworthGet({
                    url: '/api/public/queryBaseType',
                    param: {codeType: type},
                    success: function (data) {
                            self.userType = data
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            // 模糊搜索
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            // 清楚筛选
            createFilter(queryString) {
                // return (restaurant) => {
                //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                // };
            },
            // 模糊搜索数据来源
            querySearchData() {
                let self = this
                crud.skyworthGet({
                    url: '/api/user/queryUserByKey',
                    param: '',
                    success: function (data) {
                        self.restaurants = data
                    },
                    error: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            handleSelect(item) {
                this.searchName = item.tourName
                this.searchAccount = item.tourAccount
            },
            handleIconClick(ev) {
                console.log(ev);
            }
        }
    }

</script>

<style scoped lang="scss">
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .page-box{
        text-align: right;
        margin-bottom: 10px;
    }
    
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
            text-overflow: ellipsis;
            overflow: hidden;
            }
            .addr {
            font-size: 12px;
            color: #b4b4b4;
            }

            .highlighted .addr {
            color: #ddd;
            }
        }
    }
</style>
