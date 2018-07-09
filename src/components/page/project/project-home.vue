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
                                    <el-input v-model="searchCode" placeholder="请输入编码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="名称">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="searchName"
                                    clearable
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入名称"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.toseName }}</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="客户">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="searchCust"
                                    :fetch-suggestions="querySearchCust"
                                    placeholder="请输入客户"
                                    @select="handleSelectCust">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.toseUnionCustName }}</div>
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
                <el-table-column label="编码" width="150" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" :style="scope.row.rightFlag ? 'fontWeight: bold' : ''" @click="manageProject(scope.row.toseId)">{{ scope.row.toseCode }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="toseName" label="名称" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="toseUnionCustName" label="客户" header-align="center">
                </el-table-column>
                <el-table-column prop="toseVersion" label="版本" width="100" header-align="center">
                </el-table-column>
                <el-table-column prop="toseLevel" label="优先级" width="80" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isenable == 1" class="sky-green">有效</span>
                        <span v-else-if="scope.row.isenable == 0" class="sky-red">无效</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据状态" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.toseStatus == 1" class="sky-yellow" :style="scope.row.rightFlag ? 'fontWeight: bold' : ''">{{scope.row.toseStatusName}}</span>
                        <span v-if="scope.row.toseStatus == 2" class="sky-blue" :style="scope.row.rightFlag ? 'fontWeight: bold' : ''">{{scope.row.toseStatusName}}</span>
                        <span v-if="scope.row.toseStatus == 3" class="sky-green" :style="scope.row.rightFlag ? 'fontWeight: bold' : ''">{{scope.row.toseStatusName}}</span>
                        <span v-if="scope.row.toseStatus == 4" class="sky-red" :style="scope.row.rightFlag ? 'fontWeight: bold' : ''">{{scope.row.toseStatusName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核操作" width="150" header-align="center" align="center" fixed="right">
                    <template slot-scope="scope" v-if="scope.row.rightFlag">
                        <el-button
                        size="mini"
                        type="success"
                        @click="workflowReview(scope.row.toseId, true)">通过</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="workflowReview(scope.row.toseId, false)">退回</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                projectEditData: {
                    toseName: '',
                    toseCode: '',
                    toseUnionCustName: '',
                    toseLevel: '',
                    isenable: '',
                    toseVersion: ''
                },
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                fontBold: {
                    fontWeight: 'bold'
                },
                searchCode: '',
                searchName: '',
                searchCust: '',
                idx: -1
            }
        },
        created() {
            let self = this
            this.getData();
            eventBus.$on('projectGetList', () => {
                self.getData()
            })
        },
        mounted () {
            this.GetSchemeNameSug()
            this.GetSchemeCustSug()
        },
        beforeDestroy () {
            eventBus.$off('projectGetList')
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
            // 获取主题数据
            getData() {
                let self = this
                let dataUrl = '/api/scheme/querySchemeList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
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
            // 模糊搜索方案名称数据
            GetSchemeNameSug () {
                let self = this
                crud.skyworthGet({
                    url: '/api/scheme/GetSchemeNameSug',
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
            // 模糊搜索客户数据
            GetSchemeCustSug () {
                let self = this
                crud.skyworthGet({
                    url: '/api/scheme/GetSchemeCustSug',
                    param: '',
                    success: function (data) {
                        self.restaurantsCust = data
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
            // 查询
            search () {
                let self = this
                let params = {toseCode: self.searchCode, toseName: self.searchName, toseUnionCustName: self.searchCust}
                if (self.toseCode == '' && self.searchName == '' && self.searchCust == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: '/api/scheme/querySchemeList',
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
            // 修改
            manageProject (id) {
                this.$router.push({
                    name: 'projectEdit'
                })
                this.setLocalStorage('toseId', id)
            },
            // 模糊搜索
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearchCust(queryString, cb) {
                var restaurantsCust = this.restaurantsCust;
                var results = queryString ? restaurantsCust.filter(this.createFilter(queryString)) : restaurantsCust;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            // 清楚筛选
            createFilter(queryString) {
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                this.searchName = item.toseName
                this.searchNameCode = item.toseCode
            },
            handleSelectCust(item) {
                this.searchCust = item.toseUnionCustName
            },
            handleIconClick(ev) {
            },
            // 新增方案
            addProject () {
                this.$router.push({name: 'projectAdd'});
            },
            // 单据审核
            workflowReview (toseId, type) {
                let self = this
                let msg = type ? '确定审核通过吗？' : '确定退回该审核吗？'
                this.$confirm(msg).then(_ => {
                    let params = {mid: toseId, result: type, wfld: 'schemeProcess'}
                    return
                    crud.skyworthComplexSave({
                        url: '/api/activiti/workflowReview',
                        param: params,
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            self.getData()
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                        }
                    })
                }).catch(_ => {})
            },
            // 备注
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
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
