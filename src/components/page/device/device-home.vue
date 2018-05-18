<template>
    <!-- 设备 -->
    <div class="device-home">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="search">设备查询</el-button>
                <el-button type="primary" icon="search" @click="manageDevice">设备管理</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="name" label="名称" width="120">
                </el-table-column>
                <el-table-column prop="num" label="编码" width="150">
                </el-table-column>
                <el-table-column prop="type1" label="机型" width="150">
                </el-table-column>
                <el-table-column prop="type2" label="机型" width="150">
                </el-table-column>
                <el-table-column prop="country" label="使用国家" width="150">
                </el-table-column>
                <el-table-column prop="theme" label="主题" width="150">
                </el-table-column>
                <el-table-column prop="notes" label="备注" :formatter="formatter">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 设备查询框 -->
        <el-dialog title="设备查询" :visible.sync="searchVisible" width="30%">
            <el-form ref="form" :model="form" label-width="30%">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label="机型">
                    <el-select v-model="form.type1" clearable placeholder="请选择机型">
                        <el-option
                        v-for="item in DeviceType1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机芯">
                    <el-select v-model="form.type2" clearable placeholder="请选择机芯">
                        <el-option
                        v-for="item in DeviceType2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用国家">
                    <el-select v-model="form.country" clearable placeholder="请选择国家">
                        <el-option
                        v-for="item in DeviceCountry"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主题">
                    <el-input v-model="form.theme"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="searchVisible = false">取 消</el-button>
                <el-button type="primary" @click="searchVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 设备管理框 -->
        <el-dialog title="设备管理" :visible.sync="manageDeviceVisible" width="50%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编码">
                            <el-input v-model="form.num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8"></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="机型">
                            <el-select v-model="form.type1" clearable placeholder="请选择机型">
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
                            <el-select v-model="form.type2" clearable placeholder="请选择机芯">
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
                            <el-select v-model="form.country" clearable placeholder="请选择国家">
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
                <el-form-item label="备注">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.notes">
                    </el-input>
                </el-form-item>
                <el-form-item label="主题">
                    <el-input v-model="form.theme"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageDeviceVisible = false">取 消</el-button>
                <el-button type="danger" @click="manageDeviceVisible = false">删 除</el-button>
                <el-button type="primary" @click="manageDeviceVisible = false">确 定</el-button>
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
                form: {
                    name: '',
                    num: '',
                    type1: '',
                    type2: '',
                    country: '',
                    theme: '',
                    notes: ''
                },
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
            // 设备查询框
            search () {
                this.searchVisible = true;
            },
            // 设备新增
            manageDevice () {
                this.manageDeviceVisible = true;
            },
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

<style scoped>
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
</style>
