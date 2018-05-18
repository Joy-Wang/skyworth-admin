<template>
    <!-- 方案 -->
    <div class="project-home"> 
        <div class="container">
            <div class="handle-box">
                <el-button type="success" @click="1">保 存</el-button>
                <el-button type="primary" @click="1">提 交</el-button>
                <el-button type="danger" @click="1">删 除</el-button>
            </div>
            <div class="handle-box" style="margin: 0">
                <el-form ref="form" :model="projectForm" label-width="73px">
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="方案名称">
                                <el-input v-model="projectForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="方案编码">
                                <el-input v-model="projectForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="country" label="国家" width="120">
                </el-table-column>
                <el-table-column prop="language" label="语言" width="150">
                </el-table-column>
                <el-table-column prop="type1" label="机型" width="150">
                </el-table-column>
                <el-table-column prop="type2" label="机型" width="150">
                </el-table-column>
                <el-table-column prop="type2" label="备注" :formatter="formatter">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
            <div class="handle-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="关联客户">
                                <el-select v-model="form.type1" clearable placeholder="请选择客户">
                                    <el-option
                                    v-for="item in client"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="优先级">
                                <el-select v-model="form.type2" clearable placeholder="请选择优先级">
                                    <el-option
                                    v-for="item in rank"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="版本">
                                <el-select v-model="form.country" clearable placeholder="请选择版本">
                                    <el-option
                                    v-for="item in version"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="textarea">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div>
                <div class="drag-box">
                    <div class="drag-box-item">
                        <div class="item-title">todo</div>
                        <draggable v-model="todo" @remove="removeHandle" :options="dragOptions">
                            <transition-group tag="div" id="todo" class="item-ul">
                                <div v-for="(item,index) in todo" class="drag-list" :key="index">
                                    {{item.content}}
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="drag-box-item">
                        <div class="item-title">doing</div>
                        <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                            <transition-group tag="div" id="doing" class="item-ul">
                                <div v-for="(item,index) in doing" class="drag-list" :key="index">
                                    {{item.content}}
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
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
                    <el-input v-model="form.type1"></el-input>
                </el-form-item>
                <el-form-item label="机芯">
                    <el-input v-model="form.type2"></el-input>
                </el-form-item>
                <el-form-item label="使用国家">
                    <el-input v-model="form.country"></el-input>
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
    import draggable from 'vuedraggable'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                projectForm: {
                    name: '',
                    code: ''
                },
                textarea: '',
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
                client: [
                    {
                        value: '1',
                        label: '印度'
                    },
                    {
                        value: '2',
                        label: '泰国'
                    },
                    {
                        value: '3',
                        label: '韩国'
                    },
                    {
                        value: '4',
                        label: '美国'
                    }
                ],
                rank: [
                    {
                        value: '100',
                        label: '100'
                    },
                    {
                        value: '1000',
                        label: '1000'
                    },
                    {
                        value: '5000',
                        label: '5000'
                    },
                    {
                        value: '10000',
                        label: '10000'
                    },
                    {
                        value: '50000',
                        label: '50000'
                    },
                    {
                        value: '9999999',
                        label: '9999999'
                    }
                ],
                version: [
                    {
                        value: '1',
                        label: '1.0'
                    },
                    {
                        value: '1.1',
                        label: '1.1'
                    },
                    {
                        value: '2.0',
                        label: '2.0'
                    }
                ],
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [
                    {
                        content: 'a1'
                    },
                    {
                        content: 'a2'
                    },
                    {
                        content: 'a3'
                    }
                ],
                doing: [
                    {
                        content: 'b1'
                    },
                    {
                        content: 'b2'
                    },
                    {
                        content: 'b3'
                    },
                    {
                        content: 'b4'
                    },
                    {
                        content: 'b5'
                    },
                    {
                        content: 'b6'
                    }
                ],
                idx: -1
            }
        },
        components:{
            draggable
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
                    this.tableData = res.data.projectList;
                })
            },
            // 拖拽钩子
            removeHandle(event){
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
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
    .drag-box{
        /* display: flex; */
        user-select: none;
    }
    .drag-box-item {
        /* flex: 1; */
        width: 100%;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 200px;
        overflow-x: scroll;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 0 5px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
        width: 100px;
        height: 150px;
        float: left;
        display: inline-block;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>
