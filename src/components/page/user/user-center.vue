<template>
    <!-- 用户 -->
    <div class="user-home">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="名称 / 账号">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="state1"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.value }}({{ item.value }})</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <!-- 分页 -->
                <div>
                    <div class="block">
                        <el-pagination class="page-box"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="40">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <!-- table -->
            <div>
                <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" sortable width="50" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column prop="tour_type" label="用户类型" width="100" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column label="账号" width="120" header-align="center">
                        <template slot-scope="scope">
                            <a class="click-name" @click="editInformation(scope.row)">{{ scope.row.tour_account }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tour_name" label="名称" width="120" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tour_telphone" label="电话号码" width="120" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tour_mail" label="邮箱" width="150" header-align="center">
                    </el-table-column>
                    <el-table-column prop="tour_address" label="地址" width="auto" header-align="center">
                    </el-table-column>
                    <el-table-column label="状态" width="80" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.status == '有效' ? 'sky-green' : 'sky-red'">{{ scope.row.status }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 修改框 -->
        <el-dialog title="用户修改" :visible.sync="editVisible" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="名称">
                    <el-input v-model="ruleForm.tour_name" placeholder="林丹" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="ruleForm.tour_account" placeholder="林丹" disabled></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="ruleForm.tour_english_name" placeholder="请填写英文名"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="ruleForm.tour_sex" label="1">男</el-radio>
                    <el-radio v-model="ruleForm.tour_sex" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="ruleForm.tour_telphone" placeholder="请填写电话号码"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="ruleForm.tour_mail" placeholder="请填写e-mail"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址">
                    <el-input v-model="ruleForm.tour_address" placeholder="请填写地址"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="传真">
                    <el-input v-model="ruleForm.tour_fox" placeholder="请填写传真"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">提 交</el-button>
                <el-button type="danger" @click="editVisible = false">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                userTypeList: [
                    {
                        value: '0',
                        label: '普通用户'
                    },
                    {
                        value: '1',
                        label: '管理员'
                    }
                ],
                radio: '1',
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                editVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: '',
                    phone: '',
                    userType: ''
                },
                ruleForm: {
                    tour_type: '',
                    tour_account: '',
                    tour_name: '',
                    tour_english_name: '',
                    tour_sex: '',
                    tour_address: '',
                    tour_telphone: '',
                    tour_mail: '',
                    tour_fox: ''
                },
                restaurants: [],
                state1: '',
                state2: '',
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        mounted() {
            this.restaurants = this.loadAll();
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.url = '../../../../static/vuetable.json'; // 模拟数据
                this.$axios.get(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.userList;
                })
            },
            // 打开修改信息窗口
            editInformation (date) {
                this.editVisible = true;
                this.ruleForm = date
                console.log(date)
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
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 加载数据
            loadAll() {
                return [
                { "value": "林丽" },
                { "value": "张三" },
                { "value": "王麻子" },
                { "value": "刘武" },
                { "value": "胡德" },
                { "value": "欧阳吉吉" },
                { "value": "姑苏慕容复" },
                { "value": "王语嫣" },
                { "value": "小飞鼠" },
                { "value": "大胖" },
                { "value": "孟峰" },
                { "value": "吴彦祖" },
                { "value": "林丹" },
                { "value": "陈冠希" },
                { "value": "周杰伦" }
                ];
            },
            handleSelect(item) {
                console.log(item);
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
