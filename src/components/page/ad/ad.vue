<template>
    <!-- 广告管理 -->
    <div class="ad">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="广告名称" label-width="80px">
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
                <el-table-column label="名称" width="150" header-align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a class="click-name" @click="queryApplicationById(false, scope.row)">{{ scope.row.toatName }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="视频" width="150" header-align="center">
                    <template slot-scope="scope">
                        <video :src="scope.row.toatUrl" controls preload="auto" class="file-table-video"></video>
                    </template>
                </el-table-column>
                <el-table-column prop="toatDuration" label="时长" width="100" header-align="center" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="toatRemark" label="备注" width="auto" header-align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="有效性" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '有效' : '无效' }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <!-- 广告管理框 -->
        <el-dialog :title=" isAdd ? '新增广告' : '修改广告'" :visible.sync="manageAdVisible" width="50%" top='10vh' @close='closeManage()' class="app-dialog" :close-on-click-modal='false'>
            <el-form label-width="90px">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="名称" class="required-label">
                            <el-input v-model="manageAdInfo.toatName" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="上传视频" class="required-label">
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
                        <div slot="tip" class="el-upload__tip" :class="isApk ? '' : 'sky-red'">支持mp4、avi、ogg、flv、wmv、rmvb视频格式，视频大小不得超过100M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="预览">
                    <div class="avatar-box">
                        <video :src="videoUrl" controls preload="auto" id="videoPlayer"></video>
                    </div>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="时长">
                            <el-input v-model="manageAdInfo.toatDuration" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="格式">
                            <el-input v-model="manageAdInfo.toatFormat" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="有效性" class="required-label">
                    <el-radio v-model="manageAdInfo.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="manageAdInfo.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageAdInfo.toatRemark">
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
                manageAdInfo:{
                    toatId: '',
                    toatName: '',
                    toatUrl: '',
                    toatDuration: '',
                    toatFormat: '',
                    toatRemark: '',
                    isenable: 1
                },
                toanUrl: '',
                isApk: true,
                baseSeverUrl: this.baseSeverUrl(),
                searchName: '',
                manageAdVisible: false,
                isAdd: true,
                imageUrl: '',
                localImageUrl: '',
                fileList: [],
                fileListApp: [],
                videoUrl: ''
            }
        },
        created() {
            this.getData()
        },
        mounted () {
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
                let dataUrl = '/api/advertisement/queryAdvertisementList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        self.setVideo(data.data)
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
            // 搜索
            search () {
                let self = this
                let params = {toatName: self.searchName}
                if (self.searchName == '') {
                    self.getData()
                } else {
                    let dataUrl = '/api/advertisement/queryAdvertisementList?pageNum=' + self.pageQuery.pageNum + '&pageSize=' + self.pageQuery.pageSize
                    crud.skyworthGet({
                        url: dataUrl,
                        param: params,
                        success: function (data) {
                            self.setVideo(data.data)
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
            // 格式化视频
            setVideo (data) {
                let self = this
                let dataList = data.list
                for (let i = 0; i < dataList.length; i ++) {
                    if (dataList[i].toatUrl == null || dataList[i].toatUrl == '') {
                        dataList[i].toatUrl = '../../../../static/img/img.png'
                    } else {
                        dataList[i].toatUrl = self.baseSeverUrl + dataList[i].toatUrl
                    }
                }
                self.tableData = dataList
            },
            // 打开管理窗口
            queryApplicationById (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增
                    self.isAdd = view
                } else { // 修改
                    let params = {toatId: data.toatId}
                    crud.skyworthGet({ // 通过id获取当前用户信息
                        url: '/api/advertisement/queryAdvertisementById',
                        param: params,
                        success: function (data) {
                            self.manageAdInfo = data.data
                            self.videoUrl = self.baseSeverUrl + data.data.toatUrl
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
                this.manageAdVisible = true
            },
            // 关闭
            closeManage () {
                this.cancelManage()
            },
            // 新增app
            addApplication () {
                let self = this
                if (!this.manageAdInfo.toatName) {
                    self.$message({
                        message: '请填写名称',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageAdInfo.toatDuration) {
                    self.$message({
                        message: '请上传广告视频',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                let params = this.manageAdInfo
                crud.skyworthComplexSave({
                    url: '/api/advertisement/addAdvertisement',
                    param: params,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.cancelManage()
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
                let params = this.manageAdInfo
                crud.skyworthComplexUpdate({
                    url: '/api/advertisement/updateAdvertisement',
                    param: params,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.cancelManage()
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
                        url: '/api/advertisement/deleteAdvertisement?toatId=' + self.manageAdInfo.toatId,
                        param: '',
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            self.getData()
                            self.cancelManage()
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
                this.manageAdVisible = false
                this.manageAdInfo.toatName = ''
                this.$refs.uploadApp.clearFiles()
                this.videoUrl = ''
                this.localImageUrl = ''
                this.manageAdInfo.toatDuration = ''
                this.manageAdInfo.toatFormat = ''
                this.manageAdInfo.toatRemark = ''
                this.manageAdInfo.isenable = 1
                this.manageAdInfo.toatUrl = ''
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
                this.manageAdInfo.toatUrl = res.data
                this.manageAdInfo.toatFormat = file.raw.type
                this.isApk = true
                this.videoUrl = file.url
                // 格式化时间
                setTimeout(() => {
                    let durationTime = document.getElementById('videoPlayer').duration
                    let videoHours = Math.floor(durationTime / 3600)
                    let videoHoursYu = durationTime % 3600
                    let videoMinutes = Math.floor(videoHoursYu / 60)
                    let videoSeconds = parseInt(videoHoursYu % 60)
                    let videoTime = ''
                    if (videoHours < 10) {
                        videoTime = '0' + videoHours
                    } else {
                        videoTime = '' + videoHours
                    }
                    if (videoMinutes < 10) {
                        videoTime = videoTime + ':0' + videoMinutes
                    } else {
                        videoTime = videoTime + ':' + videoMinutes
                    }
                    if (videoSeconds < 10) {
                        videoTime = videoTime + ':0' + videoSeconds
                    } else {
                        videoTime = videoTime + ':' + videoSeconds
                    }
                    this.manageAdInfo.toatDuration = videoTime
                }, 800)
            },
            beforeAvatarUploadApp(file) {
                console.log(file)
                let self = this
                let fileName = file.name.split('.')
                let appSize = file.size / 1024 / 1024 < 100
                if (['video/mp4','video/ogg','video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
                    self.isApk = false
                    return false
                }
                if (!appSize) {
                    self.isApk = false
                    return false
                }
                return appSize
            },
            beforeRemoveApp(file){
            },
            handleExceedApp() {

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
        width: 100%;
        min-height: 200px;
        padding: 5px;
        border: 1px solid #cdd1dd;
        img{
            width: 100%;
            display: block;
        }
        video{
            width: 100%;
        }
    }
    .file-table-video{
        width: 100%;
    }
</style>