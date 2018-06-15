<template>
    <!-- 基础信息 -->
    <div class="base-info">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="5">
                                <el-form-item label="类型" label-width="40px">
                                    <el-select v-model="searchInfoType" clearable placeholder="请选择类型">
                                        <el-option
                                        v-for="item in infoType"
                                        :key="item.codeCode"
                                        :label="item.codeName"
                                        :value="item.codeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="名称" label-width="40px">
                                    <el-input v-model="searName" placeholder="请输入名称"></el-input>                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search()">查询</el-button>
                                <el-button type="primary" icon="search" @click="manageBaseInfo(true)">新增</el-button>
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
            <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="codeTypeName" label="类型" width="100" header-align="center">
                </el-table-column>
                <el-table-column label="名称" width="200" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageBaseInfo(false, scope.row)">{{ scope.row.codeName }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="codeCode" label="编码" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="codeSeq" label="排序" width="80" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="codeDesc" label="备注" width="auto" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isenable == 1" class="sky-green">有效</span>
                        <span v-else-if="scope.row.isenable == 0" class="sky-red">无效</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 基础信息管理框 -->
        <el-dialog title="基础信息管理" :visible.sync="manageInfoVisible" width="35%">
            <el-form :model="manageBaseInfoData" label-width="80px">
                <el-form-item label="编码：" class="required-label">
                    <el-input v-if="isAdd" v-model="manageBaseInfoData.codeCode" placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A" maxlength="20"></el-input>
                    <el-input v-if="!isAdd" v-model="manageBaseInfoData.codeCode" disabled placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="名称：" class="required-label">
                    <el-input v-model="manageBaseInfoData.codeName" placeholder="国家简拼 + '-' + 机芯 + 机型 + '-' +4位数字 例：CH-U5-8R92T-0001" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="类型：" class="required-label">
                    <el-select v-model="manageBaseInfoData.codeTypeName" v-if="isAdd" placeholder="请选择类型">
                        <el-option
                        v-for="item in infoType"
                        :key="item.codeCode"
                        :label="item.codeName"
                        :value="item.codeCode">
                        </el-option>
                    </el-select>
                    <el-select v-model="manageBaseInfoData.codeType" v-if="!isAdd" disabled placeholder="请选择类型">
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="manageBaseInfoData.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="manageBaseInfoData.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="manageBaseInfoData.codeSeq" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input
                        type="textarea"
                        maxlength="100"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageBaseInfoData.codeDesc">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageInfoVisible = false">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addBaseInfo()">提 交</el-button>
                <el-button v-if="!isAdd" type="primary" @click="updateInfo()">提 交</el-button>
                <el-button v-if="!isAdd" type="danger" @click="deleteBaseInfo()">删 除</el-button>
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
                searchVisible: false,
                manageInfoVisible: false,
                delVisible: false,
                isAdd: true,
                country: '',
                searName: '',
                infoType: [],
                searchInfoType: '',
                baseInfoStatus: [],
                manageBaseInfoData: {
                    codeCode: '',
                    codeName: '',
                    codeType: '',
                    isenable: 1,
                    codeSeq: '',
                    codeDesc: '',
                    codeTypeName: 'base_type'
                },
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                idx: -1
            }
        },
        created() {
            this.getData();
        },
        mounted () {
            this.restaurants = this.loadAll();
            this.getSelectData('base_type')
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
            // 一页显示多少条
            handleSizeChange (val) {
                this.pageQuery.pageSize = val
                this.getData()
            },
            // 获取基础数据
            getData() {
                let self = this
                let dataUrl = '/api/baseinfo/queryParameterList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize                
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
            // 信息查询
            search () {
                let self = this
                let dataUrl = '/api/baseinfo/queryParameterList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize + '&codeType=' + this.searchInfoType                
                if (this.searchInfoType != '') {
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
                } else {
                    self.getData()
                }
            },
            // 打开基础信息管理窗口
            manageBaseInfo (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增
                    self.manageBaseInfoData.isenable = 1
                    self.manageBaseInfoData.codeTypeName = 'base_type'
                    for (let key in self.manageBaseInfoData) { // 新增清空数据列表
                        if (key != 'isenable' && key != 'codeTypeName') {
                            delete self.manageBaseInfoData[key]
                        }
                    }
                    self.isAdd = view
                } else { // 修改
                    let params = {codeId: data.codeId}
                    crud.skyworthGet({ // 通过id获取当前信息
                        url: '/api/baseinfo/fingParameterById',
                        param: params,
                        success: function (data) {
                            self.manageBaseInfoData = data
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
                this.manageInfoVisible = true
            },
            // 新增基础信息
            addBaseInfo () {
                let self = this
                let parmams = this.manageBaseInfoData
                crud.skyworthComplexSave({
                    url: '/api/baseinfo/addParameterCode',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageInfoVisible = false
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
            // 修改
            updateInfo () {
                let self = this
                let parmams = this.manageBaseInfoData
                crud.skyworthComplexUpdate({
                    url: '/api/baseinfo/updateParameterCode',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageInfoVisible = false
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
            // 删除信息
            deleteBaseInfo () {
                let self = this
                crud.skyworthDelete({
                    url: '/api/baseinfo/deleteParameterCode' + '?codeId=' + self.manageBaseInfoData.codeId,
                    param: '',
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageInfoVisible = false
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
                    url: '/api/queryBaseType',
                    param: {codeType: type},
                    success: function (data) {
                        self.infoType = data
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
