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
                                    <el-select v-model="type" placeholder="请选择类型">
                                        <el-option
                                        v-for="item in FileType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="标题名称" label-width="80px">
                                    <el-input v-model="searName" placeholder="请输入名称"></el-input>                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="search">查询</el-button>
                                <el-button type="primary" icon="search" @click="manageFile()">新增</el-button>
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
                <el-table-column prop="tomd_type" label="素材类型" width="150" header-align="center">
                </el-table-column>
                <el-table-column label="标题名称" width="150" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageFile({add: false, data: scope.row})">{{ scope.row.tomd_name }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="tomd_poster_url" label="图片" width="150" header-align="center">
                </el-table-column>
                <el-table-column prop="tomd_remark" label="描述" width="auto" header-align="center">
                </el-table-column>
            </el-table>
            <div v-if="0">
                <div class="content-title">支持拖拽</div>
                <div class="plugins-tips">
                    Element UI自带上传组件。
                    访问地址：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a>
                </div>
                <el-upload
                    class="upload-demo"
                    drag
                    action="/api/posts/"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                <div class="content-title">支持裁剪</div>
                <div class="plugins-tips">
                    vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                    访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>
                </div>
                <div class="crop-demo">
                    <img :src="cropImg" class="pre-img">
                    <div class="crop-demo-btn">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                    </div>
                </div>
            
                <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelCrop">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
        
        <!-- 素材管理框 -->
        <el-dialog title="基础信息管理" :visible.sync="manageFileVisible" width="40%">
            <el-form label-width="100px">
                <el-form-item label="标题名称">
                    <el-input v-model="manageBaseInfoData.code_code" placeholder="请输入标题名称"></el-input>
                </el-form-item>
                <el-form-item label="素材类型">
                    <el-select v-model="manageBaseInfoData.code_type" placeholder="请选择类型">
                        <el-option
                        v-for="item in DeviceType1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="布局大小">
                    <el-select v-model="manageBaseInfoData.code_type" placeholder="请选择大小">
                        <el-option
                        v-for="item in DeviceType1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="海报">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="true"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :max-count="-1"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :auto-upload="false"
                        :file-list="fileList2"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="海报预览">
                    <div class="avatar-box">
                        <img :src="imageUrl" class="avatar">
                    </div>
                </el-form-item>
                <el-form-item label="点击事件类型">
                    <el-select v-model="manageBaseInfoData.code_type" placeholder="请选择类型">
                        <el-option
                        v-for="item in DeviceType1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="点击事件内容">
                    <el-input v-model="manageBaseInfoData.code_seq"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageBaseInfoData.code_desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageFileVisible = false">取 消</el-button>
                <el-button type="danger" @click="manageFileVisible = false">删 除</el-button>
                <el-button type="primary" @click="manageFileVisible = false">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        data: function(){
            return {
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                manageFileVisible: false,
                url: './static/vuetable.json',
                imageUrl: '',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                manageBaseInfoData: {
                    code_code: '',
                    code_name: '',
                    code_type: '',
                    code_status: '',
                    code_seq: '',
                    code_desc: ''
                },
                type: '',
                FileType: [{
                    value: '1',
                    label: '图片'
                },{
                    value: '2',
                    label: '应用'
                },{
                    value: '3',
                    label: '视频'
                }]
            }
        },
        components: {
            VueCropper
        },
        methods:{
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
                    this.tableData = res.data.fileData;
                })
            },
            // 打开管理框
            manageFile () {
                this.manageFileVisible = true
            },
            // 上传
            handleRemove(file, fileList) {
                this.imageUrl = URL.createObjectURL(fileList.raw);
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                console.log(file)
            },
            // 备注
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        },
        created() {
            this.getData();
            this.cropImg = this.defaultSrc;
        },
        mounted () {
            this.restaurants = this.loadAll();
        },
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
        height: 100px;
        border: 1px solid #666;
        img{
            width: 100%;
            display: block;
        }
    }
</style>