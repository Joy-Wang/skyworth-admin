<template>
    <!-- 修改方案 -->
    <div class="project-home"> 
        <div class="container">
            <div class="handle-box">
                <el-button type="" @click="cancleAdd()">取 消</el-button>
                <el-button type="danger" v-if="canEdit" @click="deleteProject()">删 除</el-button>
                <el-button type="success" v-if="canEdit" @click="saveProject()">保 存</el-button>
                <el-button type="primary" v-if="canEdit" @click="updateProject()">修 改</el-button>
            </div>
            <!-- 基础信息折叠模块 -->
            <div class="fold-box"><span @click="infoShow = !infoShow"><i :class=" infoShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom' "></i> 基础信息</span></div>
            <el-collapse-transition>
            <div class="handle-box" style="margin: 0" v-show="infoShow">
                <el-form ref="form" :model="projectBaseInfo" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="方案编码" class="required-label">
                                <el-input v-model="projectBaseInfo.toseCode" disabled placeholder="方案编码自动生成" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="方案名称" class="required-label">
                                <el-input v-model="projectBaseInfo.toseName" :disabled="canEdit ? false : true" placeholder="请填写方案名称" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="机型" class="required-label">
                                <el-select v-model="projectBaseInfo.toseEquipmentType" :disabled="canEdit ? false : true" placeholder="请选择机型">
                                    <el-option
                                    v-for="item in equipType"
                                    :key="item.codeCode"
                                    :label="item.codeName"
                                    :value="item.codeCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="机芯" class="required-label">
                                <el-select v-model="projectBaseInfo.toseEquipmentCore" :disabled="canEdit ? false : true" placeholder="请选择机芯">
                                    <el-option
                                    v-for="item in equipCore"
                                    :key="item.codeCode"
                                    :label="item.codeName"
                                    :value="item.codeCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="国家" class="required-label">
                                <el-select v-model="projectBaseInfo.toseEquipmentCountry" :disabled="canEdit ? false : true" @change="selectCountry" placeholder="请选择国家">
                                    <el-option
                                    v-for="item in country"
                                    :key="item.codeCode"
                                    :label="item.codeName"
                                    :value="item.codeCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="语言">
                                <el-select v-model="projectBaseInfo.toseLanguage" :disabled="canEdit ? false : true" placeholder="请选择语言">
                                    <el-option
                                    v-for="item in language"
                                    :key="item.codeCode"
                                    :label="item.codeName"
                                    :value="item.codeCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="关联客户">
                                <el-autocomplete
                                :disabled="canEdit ? false : true"
                                popper-class="my-autocomplete"
                                v-model="projectBaseInfo.toseUnionCust"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入名称"
                                @select="handleSelect">
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
                        <el-col :span="6">
                            <el-form-item label="优先级">
                                <el-input v-model="projectBaseInfo.toseLevel" :disabled="canEdit ? false : true" placeholder="请填写优先级" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="版本">
                                <el-input v-model="projectBaseInfo.toseVersion" :disabled="canEdit ? false : true" placeholder="请填写版本" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="状态：" class="required-label">
                            <el-radio v-model="projectBaseInfo.isenable" :disabled="canEdit ? false : true" :label="1">生效</el-radio>
                            <el-radio v-model="projectBaseInfo.isenable" :disabled="canEdit ? false : true" :label="0">失效</el-radio>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="18">
                            <el-form-item label="备注">
                                <el-input
                                type="textarea"
                                :maxlength="200"
                                :autosize="{ minRows: 3, maxRows: 4}"
                                :disabled="canEdit ? false : true"
                                placeholder="请输入内容"
                                v-model="projectBaseInfo.toseRemark">
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
                                    <el-select v-model="themeType" :disabled="canEdit ? false : true" placeholder="请选择类型">
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
                                <el-button type="primary" icon="search" :disabled="canEdit ? false : true" @click="reset">还 原</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="drag-box-item">
                        <div class="item-title">主题</div>
                        <draggable v-model="todo" @remove="removeHandle" :options="dragOptions" @end='todoEnd' class="item-ul-box">
                            <transition-group tag="div" id="todo" class="item-ul">
                                <div v-for="(item,index) in todo" class="drag-list image-box" :class="item.class" :key="index" :style="{backgroundImage: 'url(' + item.content + ')'}">
                                    <i class="el-icon-circle-close" @click="clearProjectItem(index)"></i>
                                    <div class="temp-box">
                                        <i class="el-icon-circle-plus" @click="manageProject(index)"></i>
                                        {{item.size}}
                                    </div>
                                </div>
                            </transition-group>
                        </draggable>
                        <div class="drag-item-flag" v-if="!canEdit"></div>
                    </div>
                    <div class="drag-box-item">
                        <div class="item-title">模块</div>
                        <draggable v-model="doing" @remove="removeHandle" @clone="clone" @start='start' @end='end' @choose='choose' :options="dragOptions">
                            <transition-group tag="div" id="doing" class="item-ul">
                                <div v-for="(item,index) in doing" class="drag-list" :class="item.class" :key="index">
                                    {{item.size}}
                                </div>
                            </transition-group>
                        </draggable>
                        <div class="drag-item-flag" v-if="!canEdit"></div>
                    </div>
                </div>
            </el-collapse-transition>
        </div>

        <!-- 素材管理框 -->
        <el-dialog title="素材管理" :visible.sync="manageProjectVisible" width="80%" top='10vh' class="project-dialog" :close-on-click-modal='false'>
            <!-- 分页 -->
            <div>
                <div class="block">
                    <el-pagination class="page-box"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageQuery.pageNum"
                    :page-sizes="[10, 20, 30]"
                    :page-size="pageQuery.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageQuery.total">
                    </el-pagination>
                </div>
            </div>
            <el-table :data="projecData" border style="width: 100%" ref="multipleTable">
                <el-table-column label="选择" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="radioAdd" class="no-label" @change="radioChange(scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="tomdId" label="ID" width="80" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="状态" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '有效' : '无效' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="图标" width="150" header-align="center">
                    <template slot-scope="scope">
                        <div class="project-logo">
                            <img :src="scope.row.tomdPosterUrl" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="tomdName" label="名称" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="tomdVersion" label="版本" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="tomdSizeName" label="大小" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="tomdClick" label="下载量" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="tomdRemark" label="备注" header-align="center" width="auto">
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
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data() {
            return {
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                projectBaseInfo: {
                    toseCode: '',
                    toseName: '',
                    toseEquipmentCore: '',
                    toseEquipmentType: '',
                    toseEquipmentCountry: '',
                    toseLanguage: '',
                    toseLevel: '',
                    toseVersion: '',
                    toseUnionCust: '',
                    toseRemark: '',
                    toseStatus: '',
                    isenable: 1,
                    tomdId: '',
                    schemeDetail: [
                        {
                            tosdModelId: 0, // 自定义模块ID
                            tosdModelOrder: 0, // 模块序号
                            tosdRefType: 0, // 子模块序号，只有一个就为1
                            tosdRefId: 0, // 子模块素材ID
                            tosdToseId: 0 // 方案ID
                        }
                    ]
                },
                equipCore: [], // 机芯
                equipType: [], // 机型
                country: [], // 国家
                language: [], // 语言
                projecData: {
                    tomdType: '1',
                    tomdTypeName: '图片',
                    tomdName: '',
                    tomdSize: '1',
                    tomdSizeName: '1x1',
                    tomdPosterUrl: '',
                    tomdClickType: '1',
                    tomdClickTypeName: '启动应用',
                    tomdClick: '',
                    tomdVersion: '',
                    tomdRemark: '',
                    isenable: 1
                },
                baseSeverUrl: process.env.API_BASE_URL,
                toseId: '',
                radioAdd: '',
                multipleSelection: [],
                manageProjectVisible: false,
                infoShow: true,
                themeShow: true,
                doingItem: {
                    id: '',
                    content: '',
                    class: ''
                },
                projectBaseInfoNull: [],
                themeType: '',
                radio: '1', 
                localTomdPosterUrl: '',
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
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style',
                    clone: true,
                    disabled: false
                },
                todo: [],
                doing: [
                    {
                        tosdModelId: 1, // 自定义模块ID
                        tosdModelOrder: 0, // 模块序号
                        tosdRefType: 1, // 子模块序号，只有一个就为1
                        tosdRefId: 0, // 子模块素材ID
                        tosdToseId: 0, // 方案ID
                        size: '1x1',
                        content: '',
                        class: 'size1-1'
                    },
                    {
                        tosdModelId: 2, 
                        tosdModelOrder: 0, 
                        tosdRefType: 1, 
                        tosdRefId: 0, 
                        tosdToseId: 0, 
                        size: '2x1',
                        content: '',
                        class: 'size2-1'
                    }
                ],
                typeFileter: [
                    {
                        tosdModelId: 1,
                        class: 'size1-1'
                    },
                    {
                        tosdModelId: 2,
                        class: 'size2-1'
                    }
                ],
                resList: [],
                canEdit: false, // 根据状态判断是否可以修改方案
                idx: -1
            }
        },
        components:{
            draggable
        },
        created() {
            let self = this
            this.toseId = this.getLocalStorage('toseId')
            this.getSelectData('country')
            this.getSelectData('language')
            this.getSelectData('equip_type')
            this.getSelectData('equip_core')
            this.projectBaseInfoNull = this.projectBaseInfo
            this.todo = []
        },
        mounted() {
            this.GetSchemeCustSug()
            this.findSchemeById(this.toseId)
            this.getProjectData()
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
        watch: {
            '$route' (to, from) {
                let self = this
                this.projectBaseInfo = this.projectBaseInfoNull
                if (to.name === 'projectEdit') {
                    let id = self.getLocalStorage('toseId')
                    self.todo = []
                    self.findSchemeById(id)
                }
            }
        },
        methods: {
            // 保存
            saveProject () {
            },
            // 修改
            updateProject () {
                let self = this
                this.projectBaseInfo.schemeDetail = this.todo
                let parmams = this.projectBaseInfo
                crud.skyworthComplexUpdate({
                    url: '/api/scheme/updateScheme',
                    param: parmams,
                    success: function (data) {
                        // if (data.code == '05') {
                        //     self.$message({
                        //         message: data.msg,
                        //         type: 'error',
                        //         center: true
                        //     })
                        //     eventBus.$emit('todo', '')
                        //     eventBus.$emit('projectGetList', '')
                        // }
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        // self.$router.push({name: 'project'})
                        eventBus.$emit('todo', '')
                        // eventBus.$emit('projectGetList', '')
                        self.$store.dispatch('actionProjectGetList')
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
            // 根据id搜索数据
            findSchemeById (id) {
                let self = this
                let dataUrl = '/api/scheme/findSchemeById?toseId=' + id
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        self.projectBaseInfo = data.data
                        if (data.data.toseStatus == 2) {
                            self.canEdit = true
                        } else {
                            self.canEdit = false
                        }
                        if (!data.data.toseUnionCustName && data.data.toseUnionCust != '') {
                            let obj = {}
                            obj = self.resList.find((item) => {
                                return item.toseUnionCust == data.data.toseUnionCust
                            })
                            // self.projectBaseInfo.toseUnionCust = obj.toseUnionCustName
                        }
                        self.setModel(data.data)
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
            // 格式化模块
            setModel (data) {
                let self = this
                let schemeDetail = data.schemeDetail
                let baseUrl = self.baseSeverUrl
                if (schemeDetail[0].tosdModelId != 0) {
                    for (let i = 0; i < schemeDetail.length; i ++) {
                        let obj = {};
                        obj = self.typeFileter.find((item)=>{
                            return item.tosdModelId == schemeDetail[i].tosdModelId;
                        })
                        schemeDetail[i].class = obj.class
                        schemeDetail[i].content = baseUrl + schemeDetail[i].tosdRefUrlList[0]
                    }
                    console.log(schemeDetail)
                    self.todo = schemeDetail
                }
            },
            // 取消
            cancleAdd () {
                // this.$router.push({name: 'project'})
                eventBus.$emit('todo', '')
            },
            // 删除
            deleteProject () {
                let self = this
                this.$confirm('您确定删除吗？')
                .then(_ => {
                    crud.skyworthDelete({
                        url: '/api/scheme/deleteScheme?toseId=' + this.toseId,
                        param: '',
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            eventBus.$emit('todo', '')
                            self.$store.dispatch('actionProjectGetList')
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                        }
                    })
                })
                .catch(_ => {})
            },
            // 获取下拉列表数据
            getSelectData (type) {
                let self = this
                crud.skyworthGet({
                    url: '/api/public/queryBaseType',
                    param: {codeType: type},
                    success: function (data) {
                        if (type == 'country') {
                            self.country = data.data
                        } else if (type == 'equip_core') {
                            self.equipCore = data.data
                        } else if (type == 'equip_type') {
                            self.equipType = data.data
                        } else if (type == 'language') {
                            self.language = data.data
                        }
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
            // 选择国家
            selectCountry (val) {
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getProjectData();
            },
            handleSizeChange() {

            },
            // 获取弹窗数据
            getProjectData() {
                let self = this
                let dataUrl = '/api/material/queryMaterialList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        self.setImg(data.data)
                        self.pageQuery.total = data.data.total
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
            // 格式化图片
            setImg (data) {
                let self = this
                let dataList = data.list
                for (let i = 0; i < dataList.length; i ++) {
                    if (dataList[i].tomdPosterUrl == '') {
                        dataList[i].tomdPosterUrl = './static/img/img.png'
                    } else {
                        dataList[i].tomdPosterUrl = self.baseSeverUrl + dataList[i].tomdPosterUrl
                    }
                }
                self.projecData = dataList
            },
            reset () {

            },
            // 从一个区域拖拽到另一个区域完成时的钩子
            removeHandle (event) {
                let self = this
                // this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
                if ( event.from.id == 'doing' ) {   // 从模板区域拖拽至操作区域

                }
                if ( event.from.id == 'todo' ) {    // 从操作区域拖拽至模板区域
                    self.todo = self.saveTodo   // 还原操作区域
                    self.doing = self.saveDoing     // 还原模板区域
                }
            },
            clone (event) {
            },
            start (event) { // 移动开始时的钩子
                this.saveTodo = this.todo   // 还原操作区域
                this.saveDoing = this.doing     // 还原模板区域
                let doingItem = {
                    tosdModelId: 0, 
                    tosdModelOrder: 0, 
                    tosdRefType: 0, 
                    tosdRefId: 0, 
                    tosdToseId: 0, 
                    size: '',
                    content: '',
                    class: ''
                }
                doingItem.tosdModelId = this.doing[event.oldIndex].tosdModelId
                doingItem.tosdRefType = this.doing[event.oldIndex].tosdRefType
                doingItem.size = this.doing[event.oldIndex].size
                doingItem.class = this.doing[event.oldIndex].class
                this.setSessionStorage('doingItem', JSON.stringify(doingItem))
            },
            end (event) { // 移动结束后的钩子
                this.doing.splice(event.oldIndex, 0, JSON.parse(this.getSessionStorage('doingItem')))
                this.removeSessionStorage('doingItem')
                this.todo[event.newIndex].tosdModelOrder = event.newIndex
            },
            todoEnd (event) {
                let self = this
                for (let i =0; i<self.todo.length; i++) {
                    self.todo[i].tosdModelOrder = i
                }
            },
            choose () { // 选择时
            },
            // 模糊搜索客户数据
            GetSchemeCustSug () {
                let self = this
                crud.skyworthGet({
                    url: '/api/scheme/GetSchemeCustSug',
                    param: '',
                    success: function (data) {
                        self.restaurants = data.data
                        self.resList = data.data
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
                return (restaurant.toseUnionCustName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
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
                this.localTomdPosterUrl = data.tomdPosterUrl // 选中素材后赋值给content显示
            },
            // 选择
            saveProjectEdit () {
                this.todo[this.modeEditIndex].content = this.localTomdPosterUrl
                this.todo[this.modeEditIndex].tosdRefId = this.radioRowInfo.tomdId
                this.manageProjectVisible = false
            },
            // 清除模板
            clearProjectItem (id) {
                // $('#modelImage_' + id).remove()
                this.todo.splice(id, 1)
            },
            handleSelect(item) {
                this.projectBaseInfo.toseUnionCust = item.toseUnionCustName
            },
            handleIconClick(ev) {
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
    .page-box{
        text-align: right;
        margin-bottom: 10px;
    }
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
        position: relative;
        .drag-item-flag{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            background-color: rgba(226,231,242,0.3);
            cursor: not-allowed
        }
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul-box{
        width: 100%;
        overflow-x: scroll;
    }
    .item-ul-box .item-ul{
        width: 2000px;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 150px;
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
        height: 100px;
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
    .project-h4{
        height: 50px;
        line-height: 50px;
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
        margin-top: 40px;
    }
    .image-box .el-icon-circle-close{
        float: right;
    }
    .image-box .el-icon-circle-plus{
    }
    .image-box img{
        width: 100%;
    }
    .size1-1{
        width: 100px;
        height: 100px;
    }
    .size1-2{
        width: 100px;
        height: 200px;
    }
    .size2-1{
        width: 200px;
        height: 100px;
    }
    .size2-2{
        width: 200px;
        height: 200px;
    }
</style>
