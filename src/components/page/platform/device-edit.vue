<template>
    <!-- 设备修改 -->
    <div class="device-edit">
        <div class="container">
            <div class="handle-box">
                <el-button type="" @click="cancelManage()">取 消</el-button>
                <el-button type="primary" @click="updateInfo()">保 存</el-button>
                <el-button type="danger" @click="deleteDevice()">删 除</el-button>
            </div>
            <el-form :model="manageDeviceData" label-width="100px">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="编码：" class="required-label">
                            <el-input v-model="manageDeviceData.toeiEquipmentCode" placeholder="国家简拼 + '-' + 机芯 + 机型 + '-' +4位数字 例：CH-U5-8R92T-0001" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="名称：" class="required-label">
                            <el-input v-model="manageDeviceData.toeiEquipmentName" placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="机型：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentType" disabled placeholder="请选择机型">
                                <el-option
                                v-for="item in equipType"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="机芯：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentCore" disabled placeholder="请选择机芯">
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
                    <el-col :span="8">
                        <el-form-item label="使用国家：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentCountry" disabled placeholder="请选择国家">
                                <el-option
                                v-for="item in country"
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
                        <el-form-item label="开机广告">
                            <el-input v-model="adName" disabled placeholder="无" :style="{maxWidth: '215px'}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <a class="link-device" @click="openAdList()">选择开机广告</a>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="默认主题：">
                            <el-input v-model="manageDeviceData.toeiDefaultSchemeName" disabled placeholder="无" :style="{maxWidth: '215px'}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <a class="link-device" :class="gotoDefaultTheme ? '' : 'link-device-disable'" @click="gotoDefaultTheme ? gotoTheme('default') : ''">前往默认主题</a>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="当前主题：">
                            <el-autocomplete
                            popper-class="device-autocomplete"
                            v-model="manageDeviceData.toeiUseingSchemeName"
                            :fetch-suggestions="querySearchUseingScheme"
                            placeholder="请选择主题"
                            @select="handleSelectUseingScheme">
                                <i
                                    class="el-icon-edit el-input__icon"
                                    slot="suffix"
                                    @click="handleIconClick">
                                </i>
                                <template slot-scope="{ item }">
                                    <div class="name">{{ item.toseName }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <a class="link-device" :class="gotoUsingTheme ? '' : 'link-device-disable'" @click="gotoUsingTheme ? gotoTheme('using') : ''">前往该主题</a>
                    </el-col>
                </el-row>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="manageDeviceData.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="manageDeviceData.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注：">
                            <el-input 
                                type="textarea"
                                maxlength="50"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="manageDeviceData.toeiRemark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 广告 -->
        <el-dialog title="选择广告" :visible.sync="manageAdVisible" width="80%" top='10vh' class="project-dialog" :close-on-click-modal='false'>
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
            <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable">
                <el-table-column label="选择" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-radio :label="scope.$index" v-model="radioAdd" class="no-label" @change="radioChange(scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="toatName" label="名称" width="150" header-align="center" show-overflow-tooltip>
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="manageAdVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseAd()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data() {
            return {
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                searchVisible: false,
                manageDeviceVisible: false,
                delVisible: false,
                isAdd: true,
                UCountry: '',
                restaurants: [],
                restaurantsUseingScheme: [],
                searchName: '',
                searchCode: '',
                equipCore: [], // 机芯
                equipType: [], // 机型
                country: [], // 国家
                defaultScheme: '',
                manageDeviceData: {
                    toeiEquipmentName: '',
                    toeiEquipmentCode: '',
                    toeiEquipmentType: '',
                    toeiEquipmentCore: '',
                    toeiEquipmentCountry: '',
                    toeiEquipmentCountryName: '',
                    toeiDefaultScheme: '',
                    toeiDefaultSchemeName: '',
                    toeiUseingScheme: '',
                    toeiUseingSchemeName: '',
                    isenable : 1,
                    toeiRemark: '',
                    toeiId: ''
                },
                gotoDefaultTheme: false,
                gotoUsingTheme: false,
                manageAdVisible: false,
                tableData: [],
                radioAdd: '',
                radioRowInfo: {},
                adName: '',
                baseSeverUrl: this.baseSeverUrl(),
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        created() {
            this.getSelectData('country')
            this.getSelectData('equip_type')
            this.getSelectData('equip_core')
            this.toeiId = this.getLocalStorage('toeiId')
            this.getDeviceInfo()
        },
        mounted () {
            this.getAdData()
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
            },
            deviceEditClose () {
                return this.$store.state.deviceEditClose
            }
        },
        watch: {
            deviceEditClose: function (newVal, oldVal) {
                if (!newVal) {
                    this.toeiId = this.getLocalStorage('toeiId')
                    this.getDeviceInfo()
                }
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getProjectData();
            },
            handleSizeChange() {

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
            // 通过id获取当前设备信息
            getDeviceInfo () {
                let self = this
                let params = {toeiId: this.toeiId}
                crud.skyworthGet({
                    url: '/api/equip/findEquipById',
                    param: params,
                    success: function (data) {
                        self.manageDeviceData = data.data
                        self.adName = data.data.toeiAdvertisementName
                        self.getSchemeList()
                        if (data.data.toeiDefaultScheme) self.gotoDefaultTheme = true
                        if (data.data.toeiUseingScheme) self.gotoUsingTheme = true
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
            // 获取广告数据
            getAdData() {
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
            // 打开广告列表
            openAdList () {
                this.manageAdVisible = true
            },
            // 模板选中事件
            radioChange (data) {
                let self = this
                this.radioRowInfo = data // 选中的当前行的信息赋值给空数组
            },
            // 确认选择广告
            chooseAd () {
                this.adName = this.radioRowInfo.toatName
                this.manageDeviceData.toeiAdvertisement = this.radioRowInfo.toatId
                this.manageAdVisible = false
            },
            // 修改
            updateInfo () {
                let self = this
                let parmams = this.manageDeviceData
                crud.skyworthComplexUpdate({
                    url: '/api/equip/updateEquip',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
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
            // 删除设备
            deleteDevice () {
                let self = this
                this.$confirm('您确定删除吗？')
                .then(_ => {
                    crud.skyworthDelete({
                        url: '/api/equip/deleteEquip' + '?toeiId=' + self.manageDeviceData.toeiId,
                        param: '',
                        success: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
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
                .catch(_ => {})
            },
            // 取消
            cancelManage () {
                let self = this
                this.gotoDefaultTheme = false
                this.gotoUsingTheme = false
                for (let key in self.manageDeviceData) { // 清空数据列表
                    self.manageDeviceData[key] = ''
                }
                this.$store.dispatch('actionCloseDeviceEdit')
            },
            // 获取当前主题模糊搜索数据
            getSchemeList () {
                let self = this
                if (this.manageDeviceData.toeiEquipmentType != '' && this.manageDeviceData.toeiEquipmentCore != '' && this.manageDeviceData.toeiEquipmentCountry != '') {
                    let params = {
                        toeiEquipmentCore: self.manageDeviceData.toeiEquipmentCore,
                        toeiEquipmentType: self.manageDeviceData.toeiEquipmentType,
                        toeiEquipmentCountry: self.manageDeviceData.toeiEquipmentCountry
                    }
                    self.restaurantsUseingScheme.length = 0
                    crud.skyworthGet({
                        url: '/api/equip/getSchemeList',
                        param: params,
                        success: function (data) {
                            if (data.data) {
                                let nullArr = {toseId: '', toseName: ''}
                                nullArr.toseId = data.data.toseId
                                nullArr.toseName = data.data.toseName
                                self.restaurantsUseingScheme.push(nullArr)
                            } else {
                                let nullArr = {}
                                self.restaurantsUseingScheme.push(nullArr)
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
                }
            },
            querySearchUseingScheme(queryString, cb) {
                var restaurantsUseingScheme = this.restaurantsUseingScheme
                var results = queryString ? restaurantsUseingScheme.filter(this.createFilterUseingScheme(queryString)) : restaurantsUseingScheme
                cb(results)
            },
            // 创建筛选
            createFilterUseingScheme(queryString) {
                return (restaurant) => {
                    if (restaurant.toseName.toLowerCase() == queryString.toLowerCase()) {
                        this.gotoUsingTheme = true
                    } else {
                        this.gotoUsingTheme = false
                    }
                    return (restaurant.toseName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleIconClick(ev) {
                console.log(ev)
            },
            handleSelectUseingScheme(item) {
                this.manageDeviceData.toeiUseingSchemeName = item.toseName
                this.manageDeviceData.toeiUseingScheme = item.toseId
                this.gotoUsingTheme = true
            },
            // 前往主题
            gotoTheme (type) {
                let self = this
                this.manageDeviceVisible = false
                if (type == 'default') {
                    self.setLocalStorage('toseId', self.manageDeviceData.toeiDefaultScheme)
                } else {
                    self.setLocalStorage('toseId', self.manageDeviceData.toeiUseingScheme)
                }
                this.$router.push({
                    name: 'projectEdit'
                })
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
            },
            handleSizeChange () {

            }
        }
    }

</script>

<style scoped lang="scss">
    .handle-box {
        margin-bottom: 20px;
        padding-left: 26px;
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
    .link-device{
        display: inline-block;
        line-height: 33px;
        margin-left: 20px;
        color: #409EFF;
        cursor: pointer;
        text-decoration: underline;
    }
    .link-device-disable{
        color: #dcdfe6;
    }
    .file-table-video{
        width: 100%;
    }
</style>
