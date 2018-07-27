<template>
    <!-- 素材 - app -->
    <div class="app">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="应用类型" label-width="80px">
                                    <el-select v-model="searchType" clearable placeholder="请选择类型">
                                        <el-option
                                        v-for="item in appType"
                                        :key="item.codeCode"
                                        :label="item.codeName"
                                        :value="item.codeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="应用名称" label-width="80px">
                                    <el-input v-model="searchName" placeholder="请输入名称"></el-input>                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search()">查询</el-button>
                                <el-button type="primary" icon="search" @click="queryApplicationById(true)">新增</el-button>
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
                        :page-size="pageQuery.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageQuery.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <!-- table -->
            <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable">
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '上架' : '下架' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="图标" width="80" header-align="center">
                    <template slot-scope="scope">
                        <img class="file-table-img" :src="scope.row.toanIcon" />
                    </template>
                </el-table-column>
                <el-table-column label="应用名称" width="150" header-align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a class="click-name" @click="queryApplicationById(false, scope.row)">{{ scope.row.toanName }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="toanTypeName" label="分类" width="80" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="toanVersion" label="版本" width="80" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="toanSize" label="应用大小(M)" width="90" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="toanLoadTotals" label="下载总量" width="80" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="toanRemark" label="描述" width="auto" header-align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="审核状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.toanStatus == 1" class="sky-yellow">待审核</span>
                        <span v-else-if="scope.row.toanStatus == 2" class="sky-blue">审核中</span>
                        <span v-else-if="scope.row.toanStatus == 3" class="sky-green">审核完成</span>
                        <span v-else-if="scope.row.toanStatus == 4" class="sky-red">审核不通过</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <!-- 素材管理框 -->
        <el-dialog :title=" isAdd ? '新增应用' : '修改应用'" :visible.sync="manageAppVisible" width="50%" top='10vh' @close='closeManage()' class="app-dialog" :close-on-click-modal='false'>
            <el-form label-width="90px">
                <el-row style="margin-bottom: 18px;">
                    <el-col :span="8">
                        <el-upload
                        ref='uploadIcon'
                        class="file-upload-head"
                        :action="uploadUrl()"
                        :on-change="handleChange"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :auto-upload="true"
                        :on-exceed="handleExceed"
                        :file-list="fileListIcon"
                        accept="image/png, image/jpeg"
                        :show-file-list='false'>上传图标
                        <img :src="localImageUrl" v-if="localImageUrl != ''">
                        </el-upload>
                    </el-col>
                    <el-col :span="16">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="应用名称" class="required-label">
                                    <el-input v-model="manageAppInfo.toanName" placeholder="请输入应用名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="应用类型" class="required-label">
                                    <el-select v-model="manageAppInfo.toanType" placeholder="请选择类型">
                                        <el-option
                                        v-for="item in appType"
                                        :key="item.codeCode"
                                        :label="item.codeName"
                                        :value="item.codeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-form-item label="上传APP" class="required-label">
                    <el-upload
                        ref="uploadApp"
                        class="upload-demo file-upload"
                        :action="uploadUrl()"
                        :on-change="handleChangeApp"
                        :on-success="handleAvatarSuccessApp"
                        :before-upload="beforeAvatarUploadApp"
                        :on-preview="handlePreviewApp"
                        :on-remove="handleRemoveApp"
                        :before-remove="beforeRemoveApp"
                        :limit="1"
                        :auto-upload="true"
                        :on-exceed="handleExceedApp"
                        :file-list="fileListApp">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" :class="isApk ? '' : 'sky-red'">只能上传apk文件，且不超过100M</div>
                    </el-upload>
                </el-form-item>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="海报">
                            <el-row>
                                <el-col :span="8" style="width:32%;">
                                    <el-upload
                                    ref="uploadH1"
                                    class="file-upload-h1"
                                    :action="uploadUrl()"
                                    :on-change="handleChangeH1"
                                    :on-success="handleAvatarSuccessH1"
                                    :before-upload="beforeAvatarUploadH1"
                                    :on-preview="handlePreviewH1"
                                    :on-remove="handleRemoveH1"
                                    :before-remove="beforeRemoveH1"
                                    :limit="1"
                                    :auto-upload="true"
                                    :on-exceed="handleExceedH1"
                                    accept="image/png, image/jpeg"
                                    :show-file-list='false'>上传海报1
                                    <img :src="localImageUrlH1" v-if="localImageUrlH1 != ''">
                                    </el-upload>
                                </el-col>
                                <el-col :span="8" style="width: 32%; margin: 0 2%;">
                                    <el-upload
                                    ref="uploadH2"
                                    class="file-upload-h1"
                                    :action="uploadUrl()"
                                    :on-change="handleChangeH1"
                                    :on-success="handleAvatarSuccessH2"
                                    :before-upload="beforeAvatarUploadH1"
                                    :on-preview="handlePreviewH2"
                                    :on-remove="handleRemoveH1"
                                    :before-remove="beforeRemoveH1"
                                    :limit="1"
                                    :auto-upload="true"
                                    :on-exceed="handleExceedH1"
                                    accept="image/png, image/jpeg"
                                    :show-file-list='false'>上传海报2
                                    <img :src="localImageUrlH2" v-if="localImageUrlH2 != ''">
                                    </el-upload>
                                </el-col>
                                <el-col :span="8" style="width: 32%;">
                                    <el-upload
                                    ref="uploadH3"
                                    class="file-upload-h1"
                                    :action="uploadUrl()"
                                    :on-change="handleChangeH1"
                                    :on-success="handleAvatarSuccessH3"
                                    :before-upload="beforeAvatarUploadH1"
                                    :on-preview="handlePreviewH3"
                                    :on-remove="handleRemoveH1"
                                    :before-remove="beforeRemoveH1"
                                    :limit="1"
                                    :auto-upload="true"
                                    :on-exceed="handleExceedH1"
                                    accept="image/png, image/jpeg"
                                    :show-file-list='false'>上传海报3
                                    <img :src="localImageUrlH3" v-if="localImageUrlH3 != ''">
                                    </el-upload>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="机芯" class="required-label">
                            <el-select v-model="manageAppInfo.toanEquipmentCore" placeholder="请选择机芯">
                                <el-option
                                v-for="item in equipCore"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="机型" class="required-label">
                            <el-select v-model="manageAppInfo.toanEquipmentType" placeholder="请选择机型">
                                <el-option
                                v-for="item in equipType"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="国家" class="required-label">
                            <el-select v-model="manageAppInfo.toanEquipmentCountry" placeholder="请选择国家">
                                <el-option
                                v-for="item in country"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="语言" class="required-label">
                            <el-select v-model="manageAppInfo.toanLanguage" placeholder="请选择语言">
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
                    <el-col :span="8">
                        <el-form-item label="开发商">
                            <el-input v-model="manageAppInfo.toanDeveloper"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="应用大小" class="required-label">
                            <!-- <div>{{manageAppInfo.toanSize}}</div> -->
                            <el-input v-model="manageAppInfo.toanSize" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄分级">
                            <el-input v-model="manageAppInfo.toanAgeGrading" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="版本">
                            <el-input v-model="manageAppInfo.toanVersion"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="评分">
                            <!-- <div>{{manageAppInfo.toanScore}}</div> -->
                            <el-input v-model="manageAppInfo.toanScore"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下载总量">
                            <!-- <div>{{manageAppInfo.toanLoadTotals}}</div> -->
                            <el-input v-model="manageAppInfo.toanLoadTotals" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="manageAppInfo.isenable" :label="1">上架</el-radio>
                    <el-radio v-model="manageAppInfo.isenable" :label="0">下架</el-radio>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageAppInfo.toanRemark">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelManage()">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addApplication()">提 交</el-button>
                <el-button v-if="!isAdd" type="primary" @click="updateApplication()">提 交</el-button>
                <el-button v-if="!isAdd" type="danger" @click="deleteApplication()">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import $ from 'jquery'
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data: function(){
            return {
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                tableData: [],
                manageAppInfo:{
                    toanId: '',
                    toanType: '',
                    toanIcon: '',
                    toanName: '',
                    toanPosterFirst: '',
                    toanPosterSecond: '',
                    toanPosterThird: '',
                    toanEquipmentCore: '',
                    toanEquipmentType: '',
                    toanEquipmentCountry: '',
                    toanLanguage: '',
                    toanDeveloper: '',
                    toanSize: 0,
                    toanAgeGrading: '',
                    toanVersion: '',
                    toanScore: '',
                    toanLoadTotals: 0,
                    toanRemark: '',
                    toanUrl: '',
                    toanStatus: 1,
                    isenable: 1,
                    applicationLoad: [{
                        toalLoadNum: 0,
                        toalMonth: 0,
                        toalWeek: 0,
                        toalYear: 0
                    }]
                },
                equipCore: [], // 机芯
                equipType: [], // 机型
                country: [], // 国家
                language: [], // 语言
                appType: [], // APP类型
                toanUrl: '',
                isApk: true,
                baseSeverUrl: this.baseSeverUrl(),
                searchName: '',
                searchType: '',
                manageAppVisible: false,
                isAdd: true,
                imageUrl: '',
                localImageUrl: '',
                imageUrlH1: '',
                localImageUrlH1: '',
                imageUrlH2: '',
                localImageUrlH2: '',
                imageUrlH3: '',
                localImageUrlH3: '',
                fileList: [],
                fileListApp: [],
                fileListIcon: []
            }
        },
        created() {
            this.getData()
        },
        mounted () {
            this.getSelectData('app_type')
            this.getSelectData('country')
            this.getSelectData('language')
            this.getSelectData('equip_type')
            this.getSelectData('equip_core')
        },
        components: {
            VueCropper
        },
        methods:{
            // 分页导航
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getData()
            },
            handleSizeChange(val) {
                this.pageQuery.pageSize = val
                this.getData()
            },
            // 获取数据
            getData() {
                let self = this
                let dataUrl = '/api/app/queryApplicationList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
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
                        } else if (type == 'app_type') {
                            self.appType = data.data
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
            // 搜索
            search () {
                let self = this
                let params = {toanType: self.searchType, toanName: self.searchName}
                if (self.searchType == '' && self.searchName == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: '/api/app/queryApplicationList',
                        param: params,
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
                }
            },
            // 格式化图片
            setImg (data) {
                let self = this
                let dataList = data.list
                for (let i = 0; i < dataList.length; i ++) {
                    if (dataList[i].toanIcon == null || dataList[i].toanIcon == '') {
                        dataList[i].toanIcon = '../../../../static/img/img.png'
                    } else {
                        dataList[i].toanIcon = self.baseSeverUrl + dataList[i].toanIcon
                    }
                }
                self.tableData = dataList
            },
            editSetImg (data) {
                let self = this
                let baseUrl = this.baseSeverUrl
                if (data.toanIcon != '' && data.toanIcon != null) self.localImageUrl = baseUrl + data.toanIcon
                if (data.toanPosterFirst != '' && data.toanPosterFirst != null) self.localImageUrlH1 = baseUrl + data.toanPosterFirst
                if (data.toanPosterSecond != '' && data.toanPosterSecond != null) self.localImageUrlH2 = baseUrl + data.toanPosterSecond
                if (data.toanPosterThird != '' && data.toanPosterThird != null) self.localImageUrlH3 = baseUrl + data.toanPosterThird
                self.manageAppInfo = data
            },
            // 打开管理窗口
            queryApplicationById (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增
                    if (self.appType != '') {
                        self.manageAppInfo.toanType = self.appType[0].codeCode
                    }
                    if (self.equipCore != '') {
                        self.manageAppInfo.toanEquipmentCore = self.equipCore[0].codeCode
                    }
                    if (self.equipType != '') {
                        self.manageAppInfo.toanEquipmentType = self.equipType[0].codeCode
                    }
                    if (self.country != '') {
                        self.manageAppInfo.toanEquipmentCountry = self.country[0].codeCode
                    }
                    if (self.language != '') {
                        self.manageAppInfo.toanLanguage = self.language[0].codeCode
                    }
                    self.manageAppInfo.isenable = 1
                    self.isAdd = view
                } else { // 修改
                    let params = {toanId: data.toanId}
                    crud.skyworthGet({ // 通过id获取当前用户信息
                        url: '/api/app/queryApplicationById',
                        param: params,
                        success: function (data) {
                            if (data.data.toanIcon != '') {
                               self.manageAppInfo.toanIcon = self.baseSeverUrl + data.data.toanIcon
                            }
                            data.data.toanType = data.data.toanType.toString()
                            self.editSetImg(data.data)
                            // data.toanTypeName = self.chooseCodeName('toanType', data.toanType)
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
                this.manageAppVisible = true
            },
            // 关闭
            closeManage () {
                this.cancelManage()
            },
            // 新增app
            addApplication () {
                let self = this
                if (!this.manageAppInfo.toanName) {
                    self.$message({
                        message: '请填写应用名称',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanType) {
                    self.$message({
                        message: '应用类型不能为空，请前往平台管理-基础数据管理新增应用类型',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanUrl) {
                    self.$message({
                        message: '请上传APP',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanEquipmentCore) {
                    self.$message({
                        message: '机芯不能为空，请前往平台管理-基础数据管理新增机芯',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanEquipmentType) {
                    self.$message({
                        message: '机型不能为空，请前往平台管理-基础数据管理新增机型',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanEquipmentCountry) {
                    self.$message({
                        message: '国家不能为空，请前往平台管理-基础数据管理新增国家',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAppInfo.toanLanguage) {
                    self.$message({
                        message: '语言不能为空，请前往平台管理-基础数据管理新增语言',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                this.manageAppInfo.toanIcon = this.imageUrl
                let parmams = this.manageAppInfo
                crud.skyworthComplexSave({
                    url: '/api/app/addApplication',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageAppVisible = false
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
            updateApplication () {
                let self = this
                let params = this.manageAppInfo
                crud.skyworthComplexUpdate({
                    url: '/api/app/updateApplication',
                    param: params,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageAppVisible = false
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
            // 删除
            deleteApplication () {
                let self = this
                this.$confirm('您确定删除吗？')
                .then(_ => {
                    crud.skyworthDelete({
                        url: '/api/app/deleteApplication?toanId=' + self.manageAppInfo.toanId,
                        param: '',
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            self.getData()
                            self.manageAppVisible = false
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
                .catch(_ => {});
            },
            // 取消
            cancelManage () {
                let self = this
                this.manageAppVisible = false
                for (let key in self.manageAppInfo) { // 清空数据列表
                    if (key != 'toanType' && key != 'toanEquipmentCore' && key != 'toanEquipmentType' && key != 'toanEquipmentCountry' && key != 'toanLanguage' && key != 'isenable') {
                        delete self.manageAppInfo[key]
                    }
                }
                self.localImageUrl = ''
                self.localImageUrlH1 = ''
                self.localImageUrlH2 = ''
                self.localImageUrlH3 = ''
                this.$refs.uploadApp.clearFiles()
                this.isApk = true
            },
            // 上传APP
            uploadUrl () {
                let url = '/api/public/uploadFile'
                return url
            },
            handleChangeApp(file, fileList) {
                // this.imageUrl = file.url
            },
            handleRemoveApp(file, fileList) {
                // this.localImageUrl = ''
            },
            handlePreviewApp(file) {
            },
            handleAvatarSuccessApp(res, file) {
                this.manageAppInfo.toanUrl = res.data
                this.manageAppInfo.toanSize = parseInt(file.size / 1024 / 1024)
                this.isApk = true
            },
            beforeAvatarUploadApp(file) {
                let self = this
                let fileName = file.name.split('.')
                let fileNameLength = fileName.length
                let appType1 = fileName[fileNameLength - 1] === 'exe'
                let appType2 = fileName[fileNameLength - 1] === 'apk'
                let appSize = file.size / 1024 / 1024 < 100
                if (!appType1 && !appType2) {
                    self.isApk = false
                }
                if (!appSize) {
                    self.isApk = false
                }
                return appType1 || appType2 && appSize
            },
            beforeRemoveApp(file){
            },
            handleExceedApp() {

            },
            // 上传图标
            handleChange(file, fileList) {
            },
            handleRemove(file, fileList) {
                this.localImageUrl = ''
            },
            handlePreview(file) {
            },
            handleAvatarSuccess(res, file) {
                this.localImageUrl = URL.createObjectURL(file.raw);
                this.imageUrl = res.data
                this.manageAppInfo.toan = res.data
                this.$refs.uploadIcon.clearFiles()
            },
            beforeAvatarUpload(file) {
            },
            beforeRemove(file){
            },
            handleExceed() {

            },
            // 上传海报1
            handleChangeH1(file, fileList) {
                // this.imageUrl = file.url
            },
            handleRemoveH1(file, fileList) {
                this.localImageUrlH1 = ''
            },
            handlePreviewH1(file) {
            },
            handleAvatarSuccessH1(res, file) {
                this.localImageUrlH1 = URL.createObjectURL(file.raw);
                this.imageUrlH1 = res.data
                this.manageAppInfo.toanPosterFirst = res.data
                this.$refs.uploadH1.clearFiles()
            },
            beforeAvatarUploadH1(file) {
            },
            beforeRemoveH1(file){
            },
            handleExceedH1() {
            },
            handlePreviewH2(file) {
            },
            handleAvatarSuccessH2(res, file) {
                this.localImageUrlH2 = URL.createObjectURL(file.raw);
                this.imageUrlH2 = res.data
                this.manageAppInfo.toanPosterSecond = res.data
                this.$refs.uploadH2.clearFiles()
            },
            handlePreviewH3(file) {
            },
            handleAvatarSuccessH3(res, file) {
                this.localImageUrlH3 = URL.createObjectURL(file.raw);
                this.imageUrlH3 = res.data
                this.manageAppInfo.toanPosterThird = res.data
                this.$refs.uploadH3.clearFiles()
            },
            // 筛选codeName
            chooseCodeName (type, value) {
                let self = this
                let obj = {};
                if (type == 'toanType') {
                    obj = self.appType.find((item)=>{
                        return item.codeCode == value;
                    });
                }
                return obj.codeName
            },
            // 备注
            imageuploaded(res) {
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .page-box{
        text-align: right;
        margin-bottom: 10px;
    }
    .avatar-box{
        width: 100px;
        min-height: 50px;
        padding: 5px;
        border: 1px solid #cdd1dd;
        img{
            width: 100%;
            display: block;
        }
    }
    .file-table-img{
        width: 100%;
        display: block;
    }
</style>