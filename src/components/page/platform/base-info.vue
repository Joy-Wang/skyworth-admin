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
                                    <el-select v-model="country" placeholder="请选择类型">
                                        <el-option
                                        v-for="item in DeviceCountry"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
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
                                <el-button type="primary" icon="search" @click="search">查询</el-button>
                                <el-button type="primary" icon="search" @click="manageDevice()">新增</el-button>
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
                <el-table-column prop="code_type" label="类型" width="100" header-align="center">
                </el-table-column>
                <el-table-column label="名称" width="200" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageDevice({add: false, data: scope.row})">{{ scope.row.code_name }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="code_code" label="编码" width="80" header-align="center">
                </el-table-column>
                <el-table-column prop="code_seq" label="排序" width="80" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="code_desc" label="备注" width="auto" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.code_status == 1" class="sky-green">有效</span>
                        <span v-else-if="scope.row.code_status == 2" class="sky-red">无效</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 基础信息管理框 -->
        <el-dialog title="基础信息管理" :visible.sync="manageDeviceVisible" width="35%">
            <el-form label-width="80px">
                <el-form-item label="编码">
                    <el-input v-if="isAdd" v-model="manageBaseInfoData.code_code" placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A"></el-input>
                    <el-input v-if="!isAdd" v-model="manageBaseInfoData.code_code" disabled placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="manageBaseInfoData.code_name" placeholder="国家简拼 + '-' + 机芯 + 机型 + '-' +4位数字 例：CH-U5-8R92T-0001"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="manageBaseInfoData.code_type" v-if="isAdd" placeholder="请选择类型">
                        <el-option
                        v-for="item in DeviceType1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="manageBaseInfoData.code_type" v-if="!isAdd" disabled placeholder="请选择类型">
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="manageBaseInfoData.code_status" placeholder="请选择状态">
                        <el-option
                        v-for="item in baseInfoStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="manageBaseInfoData.code_seq"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageBaseInfoData.code_desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageDeviceVisible = false">取 消</el-button>
                <el-button type="danger" @click="manageDeviceVisible = false">删 除</el-button>
                <el-button type="primary" @click="manageDeviceVisible = false">提 交</el-button>
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
                manageDeviceVisible: false,
                delVisible: false,
                isAdd: true,
                country: '',
                searName: '',
                manageBaseInfoData: {
                    code_code: '',
                    code_name: '',
                    code_type: '',
                    code_status: '',
                    code_seq: '',
                    code_desc: ''
                },
                state1: '',
                state2: '',
                state3: '',
                DeviceType1: [ // 机型
                    {
                        value: '1',
                        label: 'U1'
                    }, 
                    {
                        value: '2',
                        label: 'U2'
                    }, 
                    {
                        value: '3',
                        label: 'U3'
                    }, 
                    {
                        value: '4',
                        label: 'U4'
                    }, 
                    {
                        value: '5',
                        label: 'U5'
                    }
                ],
                baseInfoStatus: [ // 状态
                    {
                        value: '1',
                        label: '启用'
                    }, 
                    {
                        value: '2',
                        label: '禁用'
                    }
                ],
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
                    this.tableData = res.data.baseInfoList;
                })
            },
            // 设备查询
            search () {
    
            },
            // 设备新增/设备管理
            manageDevice ({add = true, data = ''} = {}) {
                // if (!data) data = '' 
                this.isAdd = add;
                this.manageDeviceVisible = true;
                this.manageBaseInfoData = data
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
