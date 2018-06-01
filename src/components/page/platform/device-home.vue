<template>
    <!-- 设备 -->
    <div class="device-home">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="名称 / 编码" label-width="80px">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="state1"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入名称"
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
                                <el-form-item label="国家" label-width="40px">
                                    <el-select v-model="country" clearable placeholder="请选择国家">
                                        <el-option
                                        v-for="item in DeviceCountry"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search">查询</el-button>
                                <el-button type="primary" icon="search" @click="manageDevice(true)">新增</el-button>
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
                <el-table-column prop="toei_equipment_name" label="名称" width="150" header-align="center">
                </el-table-column>
                <el-table-column label="编码" width="150" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageDevice(false, scope.row)">{{ scope.row.toei_equipment_code }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="toei_equipment_country" label="使用国家" width="100" header-align="center">
                </el-table-column>
                <el-table-column prop="toei_default_scheme" label="默认主题" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="toei_useing_scheme" label="当前主题" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="toei_remark" label="备注" width="auto" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '通过'" class="sky-green">{{ scope.row.status }}</span>
                        <span v-else-if="scope.row.status == '未通过'" class="sky-red">{{ scope.row.status }}</span>
                        <span v-else-if="scope.row.status == '待审核'" class="sky-yellow">{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 设备管理框 -->
        <el-dialog title="设备管理" :visible.sync="manageDeviceVisible" width="50%">
            <el-form label-width="80px">
                <el-form-item label="编码">
                    <el-input v-if="isAdd" v-model="manageDeviceData.toei_equipment_code" placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A"></el-input>
                    <el-input v-if="!isAdd" v-model="manageDeviceData.toei_equipment_code" disabled placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="manageDeviceData.toei_equipment_name" placeholder="国家简拼 + '-' + 机芯 + 机型 + '-' +4位数字 例：CH-U5-8R92T-0001"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="机型">
                            <el-select v-model="manageDeviceData.toei_equipment_type" placeholder="请选择机型">
                                <el-option
                                v-for="item in DeviceType1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机芯">
                            <el-select v-model="manageDeviceData.toei_equipment_core" placeholder="请选择机芯">
                                <el-option
                                v-for="item in DeviceType2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用国家">
                            <el-select v-model="manageDeviceData.toei_equipment_country" placeholder="请选择国家">
                                <el-option
                                v-for="item in DeviceCountry"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="默认主题">
                    <el-input v-model="manageDeviceData.toei_default_scheme"></el-input>
                </el-form-item>
                <el-form-item label="当前主题">
                    <el-input v-model="manageDeviceData.toei_useing_scheme"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageDeviceData.toei_remark">
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
                manageDeviceData: {
                    toei_equipment_name: '',
                    toei_equipment_code: '',
                    toei_equipment_type: '',
                    toei_equipment_core: '',
                    toei_equipment_country: '',
                    toei_default_scheme: '',
                    toei_useing_scheme: '',
                    status: '',
                    toei_remark: ''
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
                DeviceType2: [ // 机芯
                    {
                        value: '1',
                        label: 'U7583'
                    }, 
                    {
                        value: '2',
                        label: '67SHI'
                    }, 
                    {
                        value: '3',
                        label: 'BANHA'
                    }, 
                    {
                        value: '4',
                        label: 'SJK34'
                    }, 
                    {
                        value: '5',
                        label: 'VMLKSH'
                    }
                ],
                DeviceCountry: [ // 国家
                    {
                        value: '1',
                        label: '印度'
                    }, 
                    {
                        value: '2',
                        label: '埃及'
                    }, 
                    {
                        value: '3',
                        label: '阿富汗'
                    }, 
                    {
                        value: '4',
                        label: '南非'
                    }, 
                    {
                        value: '5',
                        label: '巴基斯坦'
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
                    this.tableData = res.data.deviceList;
                })
            },
            // 设备查询
            search () {
    
            },
            // 设备新增/设备管理
            manageDevice (add, data) {
                if (!data) data = '' 
                this.isAdd = add
                this.manageDeviceVisible = true;
                this.manageDeviceData = data
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
