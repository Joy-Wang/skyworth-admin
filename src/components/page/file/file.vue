<template>
    <!-- 素材 -->
    <div class="file">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="素材类型" label-width="80px">
                                    <el-select v-model="searchType" clearable placeholder="请选择类型">
                                        <el-option
                                        v-for="item in materialType"
                                        :key="item.codeCode"
                                        :label="item.codeName"
                                        :value="item.codeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="标题名称" label-width="80px">
                                    <el-input v-model="searchName" placeholder="请输入名称"></el-input>                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search()">查询</el-button>
                                <el-button type="primary" icon="search" @click="findMaterialById(true)">新增</el-button>
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
                <el-table-column prop="tomdTypeName" label="素材类型" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="标题名称" width="150" header-align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a class="click-name" @click="findMaterialById(false, scope.row)">{{ scope.row.tomdName }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="图片" width="100" header-align="center">
                    <template slot-scope="scope">
                        <img class="file-table-img" :src="scope.row.tomdPosterUrl" />
                    </template>
                </el-table-column>
                <el-table-column prop="tomdSizeName" label="布局" width="100" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="tomdRemark" label="描述" width="auto" header-align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tomdVersion" label="版本" width="100" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                    <el-table-column label="状态" width="80" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '有效' : '无效' }}</span>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        
        <!-- 素材管理框 -->
        <el-dialog :title=" isAdd ? '新增素材' : '修改素材'" :visible.sync="manageFileVisible" width="40%" top='10vh' @close='closeManage()' class="file-dialog" :close-on-click-modal='false'>
            <el-form label-width="110px">
                <el-form-item label="标题名称" class="required-label">
                    <el-input v-model="manageBaseInfoData.tomdName" placeholder="请输入标题名称"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="素材类型" class="required-label">
                            <el-select v-model="manageBaseInfoData.tomdTypeName" placeholder="请选择类型" @change="chooseTomdType">
                                <el-option
                                v-for="item in materialType"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="布局大小" class="required-label">
                            <el-select v-model="manageBaseInfoData.tomdSizeName" placeholder="请选择大小" @change="chooseTomdSize">
                                <el-option
                                v-for="item in materialSize"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="海报">
                    <el-upload
                        ref='upload'
                        class="upload-demo file-upload"
                        :action="uploadUrl()"
                        :on-change="handleChange"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="1"
                        :auto-upload="true"
                        :on-exceed="handleExceed"
                        accept="image/png, image/jpeg"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" :class="lessthanMaxSize ? '' : 'sky-red'">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="海报预览">
                    <div class="avatar-box">
                        <img :src="localImageUrl" class="avatar">
                    </div>
                </el-form-item>
                <el-form-item label="点击事件类型" class="required-label">
                    <el-select v-model="manageBaseInfoData.tomdClickTypeName" placeholder="请选择类型" @change="chooseTomdClickType">
                        <el-option
                        v-for="item in materialClick"
                        :key="item.codeCode"
                        :label="item.codeName"
                        :value="item.codeCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="点击事件内容">
                    <el-input v-model="manageBaseInfoData.tomdClick"></el-input>
                </el-form-item>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="manageBaseInfoData.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="manageBaseInfoData.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="manageBaseInfoData.tomdVersion"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageBaseInfoData.tomdRemark">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelManage()">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addMaterial()">提 交</el-button>
                <el-button v-if="!isAdd" type="primary" @click="updateMaterial()">提 交</el-button>
                <el-button v-if="!isAdd" type="danger" @click="deleteMaterial()">删 除</el-button>
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
                manageBaseInfoData: {
                    tomdType: '1',
                    tomdTypeName: '',
                    tomdName: '',
                    tomdSize: '',
                    tomdSizeName: '',
                    tomdPosterUrl: '',
                    tomdClickType: '',
                    tomdClickTypeName: '',
                    tomdClick: '',
                    tomdVersion: '',
                    tomdRemark: '',
                    isenable: 1
                },
                baseSeverUrl: this.baseSeverUrl(),
                searchName: '',
                materialType: [],
                materialSize: [],
                materialClick: [],
                searchType: '',
                manageFileVisible: false,
                isAdd: true,
                lessthanMaxSize: true,
                imageUrl: '',
                localImageUrl: '',
                fileList: [],
                defaultSrc: './static/img/img.jpg',
                imgSrc: '',
                cropImg: ''
            }
        },
        created() {
            this.getData();
            this.cropImg = this.defaultSrc;
        },
        mounted () {
            this.getSelectData('material_type')
            this.getSelectData('material_size')
            this.getSelectData('material_click')
        },
        components: {
            VueCropper
        },
        methods:{
            // 分页导航
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getData();
            },
            handleSizeChange(val) {
                this.pageQuery.pageSize = val
                this.getData();
            },
            // 获取数据
            getData() {
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
            // 获取下拉列表数据
            getSelectData (type) {
                let self = this
                crud.skyworthGet({
                    url: '/api/public/queryBaseType',
                    param: {codeType: type},
                    success: function (data) {
                        if (type == 'material_type') {
                            self.materialType = data.data
                        } else if (type == 'material_size') {
                            self.materialSize = data.data
                        } else if (type == 'material_click') {
                            self.materialClick = data.data
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
                let params = {tomdType: self.searchType, tomdName: self.searchName}
                if (self.searchType == '' && self.searchName == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: '/api/material/queryMaterialList',
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
                    if (dataList[i].tomdPosterUrl == '') {
                        dataList[i].tomdPosterUrl = './static/img/img.png'
                    } else {
                        dataList[i].tomdPosterUrl = self.baseSeverUrl + dataList[i].tomdPosterUrl
                    }
                }
                self.tableData = dataList
            },
            // 打开管理窗口
            findMaterialById (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增tomdTypeName
                    self.getSelectData('material_type')
                    self.getSelectData('material_size')
                    self.getSelectData('material_click')
                    if (self.materialClick != '') {
                        self.manageBaseInfoData.tomdClickType = self.materialClick[0].codeCode
                        self.manageBaseInfoData.tomdClickTypeName = self.materialClick[0].codeName
                    }
                    if (self.materialSize != '') {
                        self.manageBaseInfoData.tomdSize = self.materialSize[0].codeCode
                        self.manageBaseInfoData.tomdSizeName = self.materialSize[0].codeName
                    }
                    if (self.materialType != '') {
                        self.manageBaseInfoData.tomdType = self.materialType[0].codeCode
                        self.manageBaseInfoData.tomdTypeName = self.materialType[0].codeName
                    }
                    self.manageBaseInfoData.isenable = 1
                    self.isAdd = view
                } else { // 修改
                    let params = {tomdId: data.tomdId}
                    crud.skyworthGet({ // 通过id获取当前用户信息
                        url: '/api/material/findMaterialById',
                        param: params,
                        success: function (data) {
                            if (data.tomdPosterUrl != '') {
                               self.localImageUrl = self.baseSeverUrl + data.data.tomdPosterUrl
                            }
                            data.data.tomdTypeName = self.chooseCodeName('tomdType', data.data.tomdType)
                            data.data.tomdSizeName = self.chooseCodeName('tomdSize', data.data.tomdSize)
                            data.data.tomdClickTypeName = self.chooseCodeName('tomdClickType', data.data.tomdClickType)
                            self.manageBaseInfoData = data.data
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
                this.manageFileVisible = true
            },
            // 关闭
            closeManage () {
                this.cancelManage()
            },
            // 新增素材
            addMaterial () {
                let self = this
                if (!this.manageBaseInfoData.tomdName) {
                    self.$message({
                        message: '请填写素材名称',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageBaseInfoData.tomdType) {
                    self.$message({
                        message: '素材类型不能为空，请前往平台管理-基础数据管理新增素菜类型',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageBaseInfoData.tomdSize) {
                    self.$message({
                        message: '布局大小不能为空，请前往平台管理-基础数据管理新增布局大小',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageBaseInfoData.tomdClickType) {
                    self.$message({
                        message: '点击事件类型不能为空，请前往平台管理-基础数据管理新增点击事件类型',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                this.manageBaseInfoData.tomdPosterUrl = this.imageUrl
                let parmams = this.manageBaseInfoData
                crud.skyworthComplexSave({
                    url: '/api/material/addMaterial',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageFileVisible = false
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
            updateMaterial () {
                let self = this
                let parmams = this.manageBaseInfoData
                crud.skyworthComplexUpdate({
                    url: '/api/material/updateMaterial',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageFileVisible = false
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
            deleteMaterial () {
                let self = this
                this.$confirm('您确定删除吗？')
                .then(_ => {
                    crud.skyworthDelete({
                        url: '/api/material/deleteMaterial?tomdId=' + self.manageBaseInfoData.tomdId,
                        param: '',
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            self.getData()
                            self.manageFileVisible = false
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
            // 取消
            cancelManage () {
                let self = this
                this.manageFileVisible = false
                for (let key in self.manageBaseInfoData) { // 清空数据列表
                    if (key != 'tomdType' && key != 'tomdTypeName' && key != 'tomdSize' && key != 'tomdSizeName' && key != 'tomdClickType' && key != 'tomdClickTypeName' && key != 'isenable') {
                        delete self.manageBaseInfoData[key]
                    }
                }
                self.localImageUrl = ''
                self.fileList = []
                self.lessthanMaxSize = true
            },
            // 上传
            uploadUrl () {
                let url = '/api/public/uploadFile'
                return url
            },
            handleChange(file, fileList) { // 文件状态改变时
                // this.imageUrl = file.url
            },
            handleRemove(file, fileList) { // 文件列表移除文件时
                this.localImageUrl = ''
            },
            handlePreview(file) { // 点击文件列表中已上传的文件时
            },
            handleAvatarSuccess(res, file) { // 上传成功时
                this.localImageUrl = URL.createObjectURL(file.raw);
                this.imageUrl = res.data
                this.lessthanMaxSize = true
            },
            beforeAvatarUpload(file) { // 上传文件之前
                let imageSize = file.size / 1024 < 500
                if (!imageSize) {
                    this.lessthanMaxSize = false
                }
                return imageSize
            },
            beforeRemove(file){ // 移除之前
            },
            handleExceed() { // 文件数量超出限制时

            },
            chooseTomdType (val) {
                this.manageBaseInfoData.tomdType = val
            },
            chooseTomdSize (val) {
                this.manageBaseInfoData.tomdSize = val
            },
            chooseTomdClickType (val) {
                this.manageBaseInfoData.tomdClickType = val
            },
            // 筛选codeName
            chooseCodeName (type, value) {
                let self = this
                let obj = {};
                if (type == 'tomdType') {
                    obj = self.materialType.find((item)=>{
                        return item.codeCode == value;
                    });
                } else if (type == 'tomdSize') {
                    obj = self.materialSize.find((item)=>{
                        return item.codeCode == value;
                    });
                } else if (type == 'tomdClickType') {
                    obj = self.materialClick.find((item)=>{
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
        // width: 200px;
        // min-height: 50px;
        width: 150px;
        height: 150px;
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