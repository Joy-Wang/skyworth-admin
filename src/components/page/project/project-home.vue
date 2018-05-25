<template>
    <!-- 方案 -->
    <div class="project-home">
        <div class="container">
            <div>
                <div>
                    <el-form label-width="40px">
                        <el-row :gutter="20">
                            <el-col :span="5">
                                <el-form-item label="编码">
                                    <el-input v-model="search.name" placeholder="请输入编码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="名称">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="state2"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入名称"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.value }}</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="客户">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="state3"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入客户"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.value }}</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search()">查询</el-button>
                                <el-button type="primary" icon="search" @click="addProject()">新增</el-button>
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
            <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="编码" width="200" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageProject(scope.row)">{{ scope.row.tose_code }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="tose_name" label="名称" width="200" header-align="center">
                </el-table-column>
                <el-table-column prop="client" label="客户" width="auto" header-align="center">
                </el-table-column>
                <el-table-column prop="tose_version" label="版本" width="100" header-align="center">
                </el-table-column>
                <el-table-column prop="tose_level" label="优先级" width="100" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.tose_status == 1" class="sky-blue">待提交</span>
                        <span v-else-if="scope.row.tose_status == 2" class="sky-yellow">审核中</span>
                        <span v-else-if="scope.row.tose_status == 3" class="sky-green">通过</span>
                        <span v-else-if="scope.row.tose_status == 4" class="sky-red">不通过</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 方案管理框 -->
        <el-dialog title="方案管理" :visible.sync="editVisible" width="30%">
            <el-form ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="编码">
                    <el-input v-model="projectEditData.tose_code" placeholder="请填写编码" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="projectEditData.tose_name" placeholder="请填写名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="关联客户">
                    <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="state3"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入客户"
                    @select="handleSelect">
                        <i
                            class="el-icon-edit el-input__icon"
                            slot="suffix"
                            @click="handleIconClick">
                        </i>
                        <template slot-scope="{ item }">
                            <div class="name">{{ item.value }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="优先级">
                    <el-input v-model="projectEditData.tose_level" placeholder="请填写优先级"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="projectEditData.tose_version" placeholder="请填写优版本"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio v-model="projectEditData.radio" label="1">启用</el-radio>
                    <el-radio v-model="projectEditData.radio" label="2">停用</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="editVisible = false">删 除</el-button>
                <el-button type="primary" @click="editVisible = false">提 交</el-button>
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
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                searchVisible: false,
                editVisible: false,
                delVisible: false,
                projectEditData: {
                    tose_name: '',
                    tose_code: '',
                    client: '',
                    tose_level: '',
                    status: '',
                    radio: '',
                    tose_version: ''
                },
                search: {
                    name: ''
                },
                state1: '',
                state2: '',
                state3: '',
                radio: '1',
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        mounted () {
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
                    this.tableData = res.data.projectList;
                })
            },
            // 查询
            search () {
    
            },
            // 修改框
            manageProject (date) {
                this.editVisible = true;
                this.projectEditData = date
                this.projectEditData.radio = date.status
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
            },
            // 新增方案
            addProject () {
                this.$router.push({name: 'projectAdd'});
            },
            // 备注
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
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
</style>
