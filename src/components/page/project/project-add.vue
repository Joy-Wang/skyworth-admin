<template>
    <!-- 新增方案 -->
    <div class="project-home"> 
        <div class="container">
            <div class="handle-box">
                <el-button type="success" @click="1">保 存</el-button>
                <el-button type="primary" @click="1">提 交</el-button>
                <el-button type="danger" @click="1">删 除</el-button>
            </div>
            <!-- 基础信息折叠模块 -->
            <div class="fold-box"><span @click="infoShow = !infoShow"><i :class=" infoShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom' "></i> 基础信息</span></div>
            <el-collapse-transition>
            <div class="handle-box" style="margin: 0" v-show="infoShow">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="方案编码">
                                <el-input v-model="projectForm.code" placeholder="请填写方案编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="方案名称">
                                <el-input v-model="projectForm.name" placeholder="请填写方案名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="国家">
                                <el-input v-model="projectForm.country" placeholder="请填写国家"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="语言">
                                <el-input v-model="projectForm.language" placeholder="请填写语言"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="机型">
                                <el-input v-model="projectForm.type1" placeholder="请填写机型"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="机芯">
                                <el-input v-model="projectForm.type2" placeholder="请填写机芯"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="关联客户">
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
                                        <div class="name">{{ item.value }}</div>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="优先级">
                                <el-input v-model="projectForm.level" placeholder="请填写优先级"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="版本">
                                <el-input v-model="projectForm.version" placeholder="请填写版本"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="18">
                            <el-form-item label="备注">
                                <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="textarea">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            </el-collapse-transition>

            <!-- 主题明细折叠模块 -->
            <div class="fold-box"><span @click="themeShow = !themeShow"><i :class=" themeShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom' "></i> 主题明细</span></div>
            <el-collapse-transition>
                <div class="drag-box" v-show="themeShow">
                    <el-form ref="form" label-width="80px">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="类型">
                                    <el-select v-model="themeType" placeholder="请选择类型">
                                        <el-option
                                        v-for="item in themeMode"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" icon="search" @click="reset">还 原</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div>
                        <p v-for="item in todo">
                            {{item.id}} , {{item.content}}
                        </p>
                    </div>
                    <div class="drag-box-item">
                        <div class="item-title">m1</div>
                        <draggable v-model="todo" @remove="removeHandle" :options="dragOptions">
                            <transition-group tag="div" id="todo" class="item-ul">
                                <div v-for="(item,index) in todo" class="drag-list image-box" :key="index">
                                    <i class="el-icon-close" @click="clearProjectItem(index)">{{index}}</i>
                                    <div class="temp-box">
                                        <i class="el-icon-circle-plus" @click="manageProject(index)"></i>
                                        {{item.id}}
                                        <p>{{item.dif}}</p>
                                    </div>
                                    <img :src="item.content"/>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="drag-box-item">
                        <div class="item-title">m2</div>
                        <draggable v-model="doing" @remove="removeHandle" @clone="clone" @start='start' @end='end' @choose='choose' :options="dragOptions">
                            <transition-group tag="div" id="doing" class="item-ul">
                                <div v-for="(item,index) in doing" class="drag-list" :key="index">
                                    {{item.id}}
                                    <p>{{item.dif}}</p>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </el-collapse-transition>
        </div>

        <!-- 素材管理框 -->
        <el-dialog title="素材管理" :visible.sync="manageProjectVisible" width="80%">
            <el-table :data="projecData" border style="width: 100%" ref="multipleTable">
                <el-table-column label="选择" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="radioAdd" class="no-label" @change="radioChange(scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="80" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="图标" width="150" header-align="center">
                    <template slot-scope="scope">
                        <div class="project-logo">
                            <img :src="scope.row.src" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="version" label="版本" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="size" label="大小" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="downloadNum" label="下载量" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="notes" label="备注" header-align="center" width="auto">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageProjectVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveProjectEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import $ from 'jquery'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                projectForm: {
                    name: '',
                    code: '',
                    country: '',
                    language: '',
                    type1: '',
                    type2: '',
                    level: ''
                },
                radioAdd: '',
                textarea: '',
                projecData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                manageProjectVisible: false,
                delVisible: false,
                infoShow: true,
                themeShow: true,
                themeType: '',
                form: {
                    name: '',
                    num: '',
                    type1: '',
                    type2: '',
                    country: '',
                    theme: '',
                    notes: '',
                    version: ''
                },
                radio: '1', 
                state1: '',
                radioRowInfo: {},
                modeEditIndex: '',
                imageSrc: '',
                saveDoing: [],
                saveTodo: [],
                themeMode: [
                    {
                        value: '1',
                        label: '横向'
                    },
                    {
                        value: '2',
                        label: '竖向'
                    }
                ],
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
                    ghostClass: 'ghost-style',
                    clone: true,
                    disabled: false
                },
                todo: [
                    {
                        id: 'a1',
                        content: ''
                    },
                    {
                        id: 'a1',
                        content: ''
                    }
                ],
                doing: [
                    {
                        id: 'a2',
                        dif: '',
                        content: ''
                    },
                    {
                        id: 'a3',
                        content: ''
                    },
                    {
                        id: 'b1',
                        content: ''
                    },
                    {
                        id: 'b2',
                        content: ''
                    },
                    {
                        id: 'b3',
                        content: ''
                    },
                    {
                        id: 'b4',
                        content: ''
                    },
                    {
                        id: 'b5',
                        content: ''
                    },
                    {
                        id: 'b6',
                        content: ''
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
                    this.tableData = res.data.projectList;
                    this.projecData = res.data.projecData
                })
            },
            reset () {

            },
            // 从一个区域拖拽到另一个区域完成时的钩子
            removeHandle (event) {
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
                if ( event.from.id == 'doing' ) {   // 从模板区域拖拽至操作区域
                    this.doing = this.saveDoing     // 赋值原数组对象，保证模板区域不会变
                    this.saveTodo = this.todo   // 将操作区域保存下来
                    console.log(this.saveDoing, this.saveTodo)
                }
                if ( event.from.id == 'todo' ) {    // 从操作区域拖拽至模板区域
                    this.todo = this.saveTodo   // 还原操作区域
                    this.doing = this.saveDoing     // 还原模板区域
                }
            },
            clone (event) {
                // console.log(event);
                // if (event.from.id == 'doing' && event.to.id == 'doing') { // 阻止模板区移动
                //     this.dragOptions.disabled = true
                //     console.log(this.dragOptions)
                // }
            },
            start (event) { // 移动开始时的钩子
                // this.saveTodo = this.todo   // 保存操作区域
                // this.doing.splice(event.oldIndex, 0,this.doing[event.oldIndex])
                this.doing[event.oldIndex].dif = new Date().getTime()
                this.saveDoing = this.doing     // 保存模板区域
            },
            end (event) { // 移动结束后的钩子
            },
            choose () { // 选择时
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
            // 素材管理
            manageProject (index) {
                this.manageProjectVisible = true;
                this.modeEditIndex = index // 保存当前模板的索引值
            },
            // 模板选中事件
            radioChange (data) {
                let self = this
                this.radioRowInfo = data // 选中的当前行的信息赋值给空数组
                this.todo[self.modeEditIndex].content = data.src // 选中素材后赋值给content显示
                console.log(this.todo[self.modeEditIndex])
            },
            // 选择
            saveProjectEdit () {
                this.manageProjectVisible = false
                // $('#modelImage_' + self.modeEditIndex).css('background-image', 'url(' + self.radioRowInfo.src + ')')
            },
            // 清除模板
            clearProjectItem (id) {
                // $('#modelImage_' + id).remove()
                this.todo.splice(id, 1)
                // this.todo.splice($.inArray(self.todo[id], self.todo), 1)
                console.log(id, this.todo)
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

<style scoped lang='scss'>
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
        background-color: #fff;
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
        border: 1px dashed #939496be;
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
        .temp-box{
            text-align: center;
            i{
                display: block;
            }
        }
    }
    .drag-list:hover {
        border: 1px dashed #20a0ff;
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
    .fold-box{
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        background-color: #c8ccd1;
        font-size: 14px;
        font-weight: 600;
        color: #404142;
        span{
            display: inline-block;
            cursor: pointer;
            padding-left: 10px;
        }
    }
    .project-logo{
        text-align: center;
        padding: 2px 0;
        img{
            display: block;
            max-width: 80px;
            margin: 0 auto;
        }
    }
    .image-box{
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .image-box .temp-box{
        margin-top: 50%;
    }
    .image-box .el-icon-close{
        float: right;
    }
    .image-box img{
        width: 100%;
    }
</style>
