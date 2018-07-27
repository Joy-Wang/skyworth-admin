<template>
    <!-- 设备新增 -->
    <div class="device-add">
        <div class="container">
            <div class="handle-box">
                <el-button type="" @click="cancelManage()">取 消</el-button>
                <el-button type="primary" @click="addDevice()">提 交</el-button>
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
                            <el-select v-model="manageDeviceData.toeiEquipmentType" @change="selectChange()" placeholder="请选择机型">
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
                            <el-select v-model="manageDeviceData.toeiEquipmentCore" @change="selectChange()" placeholder="请选择机芯">
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
                            <el-select v-model="manageDeviceData.toeiEquipmentCountry" @change="selectChange()" placeholder="请选择国家">
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
                        <!-- <a class="link-device" v-if="gotoDefaultTheme" @click="gotoTheme('default')">前往默认主题</a>
                        <a class="link-device link-device-disable" v-else>前往默认主题</a> -->
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
                        <!-- <a class="link-device" v-if="gotoUsingTheme" @click="gotoTheme('using')">前往该主题</a>
                        <a class="link-device link-device-disable" v-else>前往该主题</a> -->
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
                    toeiId: '',
                    toeiAdvertisement: '' // 开机广告ID
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
        },
        mounted () {
            this.manageDeviceData.isenable = 1
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
            deviceAddClose () {
                return this.$store.state.deviceAddClose
            }
        },
        watch: {
            '$route' (to, from) {
                let self = this
                if (to.name === 'deviceAdd') {
                    self.selectChange()
                }
            },
            deviceAddClose: function (newVal, oldVal) {
                if (!newVal) {
                    this.getSelectData('country')
                    this.getSelectData('equip_type')
                    this.getSelectData('equip_core')
                console.log(newVal)
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
                            if (data.data != '') self.manageDeviceData.toeiEquipmentCountry = data.data[0].codeCode
                        } else if (type == 'equip_core') {
                            self.equipCore = data.data
                            if (data.data != '') self.manageDeviceData.toeiEquipmentCore = data.data[0].codeCode
                        } else if (type == 'equip_type') {
                            self.equipType = data.data
                            if (data.data != '') self.manageDeviceData.toeiEquipmentType = data.data[0].codeCode
                        }
                        self.selectChange()
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
                if (this.radioRowInfo) {
                    this.adName = this.radioRowInfo.toatName
                    this.manageDeviceData.toeiAdvertisement = this.radioRowInfo.toatId
                }
                this.manageAdVisible = false
            },
            // 新增
            addDevice () {
                let self = this
                if (!this.manageDeviceData.toeiEquipmentCode) {
                    this.$message({
                        message: '请填写编码',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageDeviceData.toeiEquipmentName) {
                    this.$message({
                        message: '请填写名称',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if(!this.manageDeviceData.toeiEquipmentType) {
                    this.$message({
                        message: '机型不能为空，请先前往平台管理-基础数据管理新增机型',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageDeviceData.toeiEquipmentCore) {
                    this.$message({
                        message: '机芯不能为空，请先前往平台管理-基础数据管理新增机芯',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                if (!this.manageDeviceData.toeiEquipmentCountry) {
                    this.$message({
                        message: '使用国家不能为空，请先前往平台管理-基础数据管理新增国家',
                        type: 'warning',
                        center: true
                    })
                    return false
                }
                let parmams = this.manageDeviceData
                crud.skyworthComplexSave({
                    url: '/api/equip/addEquip',
                    param: parmams,
                    success: function (data) {
                        if (data.code == '0001') {
                            self.$message({
                                message: data.msg,
                                type: 'success',
                                center: true
                            })
                            self.cancelManage()
                        } else if (data.code == '0408') {
                            self.$message({
                                message: data.msg,
                                type: 'warning',
                                center: true
                            })
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
            // 取消
            cancelManage () {
                let self = this
                this.gotoDefaultTheme = false
                this.gotoUsingTheme = false
                for (let key in self.manageDeviceData) { // 清空数据列表
                    if (key != 'isenable') {
                        self.manageDeviceData[key] = ''
                    }
                }
                this.$store.dispatch('actionCloseDeviceAdd')
            },
            // 下拉框选项值改变
            selectChange () {
                let self = this
                if (this.manageDeviceData.toeiEquipmentType != '' && this.manageDeviceData.toeiEquipmentCore != '' && this.manageDeviceData.toeiEquipmentCountry != '') {
                    let params = {
                        toeiEquipmentCore: self.manageDeviceData.toeiEquipmentCore,
                        toeiEquipmentType: self.manageDeviceData.toeiEquipmentType,
                        toeiEquipmentCountry: self.manageDeviceData.toeiEquipmentCountry
                    }
                    // 获取默认主题
                    crud.skyworthGet({
                        url: '/api/equip/getDefaultScheme',
                        param: params,
                        success: function (data) {
                            if (data.data.data) {
                                self.manageDeviceData.toeiDefaultSchemeName = data.data.data.toseName
                                self.manageDeviceData.toeiDefaultScheme = data.data.data.toseId
                                self.gotoDefaultTheme = true
                            } else {
                                self.manageDeviceData.toeiDefaultSchemeName = ''
                                self.manageDeviceData.toeiDefaultScheme = ''
                                self.gotoDefaultTheme = false
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
                    // 获取当前主题模糊搜索数据
                    self.restaurantsUseingScheme.length = 0
                    crud.skyworthGet({
                        url: '/api/equip/getSchemeList',
                        param: params,
                        success: function (data) {
                            if (data.data.data) {
                                let nullArr = {toseId: '', toseName: ''}
                                nullArr.toseId = data.data.data.toseId
                                nullArr.toseName = data.data.data.toseName
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
            // 模糊搜索
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
                if (type == 'default') {
                    self.setLocalStorage('toseId', self.manageDeviceData.toeiDefaultScheme)
                } else {
                    self.setLocalStorage('toseId', self.manageDeviceData.toeiUseingScheme)
                }
                this.$router.push({
                    name: 'projectEdit'
                })
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
