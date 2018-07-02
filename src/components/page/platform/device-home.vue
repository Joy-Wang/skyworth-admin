<template>
    <!-- 设备 -->
    <div class="device-home">
        <div class="container">
            <div>
                <div>
                    <el-form ref="form">
                        <el-row :gutter="20">
                            <el-col :span="7">
                                <el-form-item label="名称 / 编码" label-width="80px">
                                    <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="searchName"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入名称"
                                    @select="handleSelect">
                                        <i
                                            class="el-icon-edit el-input__icon"
                                            slot="suffix"
                                            @click="handleIconClick">
                                        </i>
                                        <template slot-scope="{ item }">
                                            <div class="name">{{ item.tourName }}</div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="国家" label-width="40px">
                                    <el-select v-model="UCountry" clearable placeholder="请选择国家">
                                        <el-option
                                        v-for="item in country"
                                        :key="item.codeCode"
                                        :label="item.codeName"
                                        :value="item.codeCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" icon="search" @click="searchDevice()">查询</el-button>
                                <el-button type="primary" icon="search" @click="manageDevice(true)">新增</el-button>
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
                        :page-size="pageQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageQuery.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <!-- table -->
            <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="toeiEquipmentName" label="名称" width="150" header-align="center">
                </el-table-column>
                <el-table-column label="编码" width="150" header-align="center">
                    <template slot-scope="scope">
                        <a class="click-name" @click="manageDevice(false, scope.row)">{{ scope.row.toeiEquipmentCode }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="toeiEquipmentCountryName" label="使用国家" width="80" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="toeiDefaultSchemeName" label="默认主题" width="100" header-align="center">
                </el-table-column>
                <el-table-column prop="toeiUseingSchemeName" label="当前主题" width="100" header-align="center">
                </el-table-column>
                <el-table-column prop="toeiRemark" label="备注" width="auto" header-align="center">
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.isenable == '1' ? 'sky-green' : 'sky-red'">{{ scope.row.isenable ? '有效' : '无效' }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 设备管理框 -->
        <el-dialog :title=" isAdd ? '设备新增' : '设备修改'" :visible.sync="manageDeviceVisible" width="50%" top="10vh" @close="cancelManage()" class="device-dialog" :close-on-click-modal='false'>
            <el-form :model="manageDeviceData" label-width="100px">
                <el-form-item label="编码：" class="required-label">
                    <el-input v-model="manageDeviceData.toeiEquipmentCode" placeholder="国家简拼 + '-' + 机芯 + 机型 + '-' +4位数字 例：CH-U5-8R92T-0001" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="名称：" class="required-label">
                    <el-input v-model="manageDeviceData.toeiEquipmentName" placeholder="国家 + '-' + 品牌名称 例：中国-创维Q5A" maxlength="30"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="机型：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentType" :disabled="isAdd ? false : true" @change="isAdd ? selectChange() : ''" placeholder="请选择机型">
                                <el-option
                                v-for="item in equipType"
                                :key="item.codeCode"
                                :label="item.codeName"
                                :value="item.codeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="机芯：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentCore" :disabled="isAdd ? false : true" @change="isAdd ? selectChange() : ''" placeholder="请选择机芯">
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
                    <el-col :span="12">
                        <el-form-item label="使用国家：" class="required-label">
                            <el-select v-model="manageDeviceData.toeiEquipmentCountry" :disabled="isAdd ? false : true" @change="isAdd ? selectChange() : ''" placeholder="请选择国家">
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
                    <el-col :span="12">
                        <el-form-item label="默认主题：">
                            <el-input v-model="manageDeviceData.toeiDefaultSchemeName" disabled placeholder="请选择主题"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <a class="link-device" @click="gotoTheme('default')">前往默认主题</a>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="当前主题：">
                            <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="manageDeviceData.toeiUseingSchemeName"
                            :fetch-suggestions="querySearch"
                            placeholder="请选择主题"
                            @select="handleSelect">
                                <i
                                    class="el-icon-edit el-input__icon"
                                    slot="suffix"
                                    @click="handleIconClick">
                                </i>
                                <template slot-scope="{ item }">
                                    <div class="name">{{ item.tourName }}</div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <a class="link-device" @click="gotoTheme('using')">前往该主题</a>
                    </el-col>
                </el-row>
                <el-form-item label="状态：" class="required-label">
                    <el-radio v-model="manageDeviceData.isenable" :label="1">生效</el-radio>
                    <el-radio v-model="manageDeviceData.isenable" :label="0">失效</el-radio>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input 
                        type="textarea"
                        maxlength="50"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="manageDeviceData.toeiRemark">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="" @click="cancelManage()">取 消</el-button>
                <el-button v-if="isAdd" type="primary" @click="addDevice()">提 交</el-button>
                <el-button v-if="!isAdd" type="primary" @click="updateInfo()">提 交</el-button>
                <el-button v-if="!isAdd" type="danger" @click="deleteDevice()">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
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
                pageQuery: { // 分页
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                idx: -1
            }
        },
        created() {
            this.getSelectData('country')
        },
        mounted () {
            this.querySearchData()
            this.getSelectData('equip_type')
            this.getSelectData('equip_core')
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
            // 分页导航-当前页
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val;
                this.getData();
            },
            // 每页条目数
            handleSizeChange (val) {
                this.pageQuery.pageSize = val;
                this.getData();
            },
            // 获取列表数据
            getData() {
                let self = this
                let dataUrl = '/api/equip/queryEquipList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize                
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        let dataList = data.list
                        for (let i = 0; i < dataList.length; i++) {
                            let obj = {}
                            obj = self.country.find((item) => {
                                return item.codeCode == dataList[i].toeiEquipmentCountry
                            })
                            dataList[i].toeiEquipmentCountryName = obj.codeName
                        }
                        self.tableData = dataList
                        self.pageQuery.total = data.total
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
                            self.country = data
                            self.getData()
                        } else if (type == 'equip_core') {
                            self.equipCore = data
                        } else if (type == 'equip_type') {
                            self.equipType = data
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
            searchDevice () {
                let self = this
                let params = {toeiEquipmentCode: self.searchCode, toeiEquipmentCountry: self.UCountry}
                console.log(self.UCountry)
                if (this.searchName == '' && this.UCountry == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: '/api/equip/queryEquipList',
                        param: params,
                        success: function (data) {
                            self.tableData = data.list
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
            // 打开设备管理窗口
            manageDevice (view, data) {
                let self = this
                data ? data : ''
                if ( view ) { // 新增
                    self.manageDeviceData.isenable = 1
                    self.manageDeviceData.toeiEquipmentType = '8R92T'
                    self.manageDeviceData.toeiEquipmentCore = 'U5'
                    self.manageDeviceData.toeiEquipmentCountry = 'India'
                    self.selectChange()
                    self.querySearchThemeData()
                    self.isAdd = view
                } else { // 修改
                    let params = {toeiId: data.toeiId}
                    crud.skyworthGet({ // 通过id获取当前设备信息
                        url: '/api/equip/findEquipById',
                        param: params,
                        success: function (data) {
                            self.manageDeviceData = data
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
                this.manageDeviceVisible = true
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
                        self.getData()
                        self.manageDeviceVisible = false
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
            // 新增
            addDevice () {
                let self = this
                let parmams = this.manageDeviceData
                crud.skyworthComplexSave({
                    url: '/api/equip/addEquip',
                    param: parmams,
                    success: function (data) {
                        self.$message({
                            message: data.msg,
                            type: 'success',
                            center: true
                        })
                        self.getData()
                        self.manageDeviceVisible = false
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
                            self.getData()
                            self.manageDeviceVisible = false
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
                this.manageDeviceVisible = false
                for (let key in self.manageDeviceData) { // 清空数据列表
                    if (key != 'isenable') {
                        self.manageDeviceData[key] = ''
                    }
                }
            },
            // 下拉框选项值改变，获取默认主题
            selectChange () {
                let self = this
                if (this.manageDeviceData.toeiEquipmentType != '' && this.manageDeviceData.toeiEquipmentCore != '' && this.manageDeviceData.toeiEquipmentCountry != '') {
                    let parmams = {
                        toeiEquipmentCore: self.manageDeviceData.toeiEquipmentCore,
                        toeiEquipmentType: self.manageDeviceData.toeiEquipmentType,
                        toeiEquipmentCountry: self.manageDeviceData.toeiEquipmentCountry
                    }
                    crud.skyworthGet({
                        url: '/api/equip/getDefaultScheme',
                        param: parmams,
                        success: function (data) {
                            self.manageDeviceData.toeiDefaultSchemeName = data.toseName
                            self.manageDeviceData.toeiDefaultScheme = data.toseId
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
            // 名称模糊搜索数据来源
            querySearchData() {
                let self = this
                crud.skyworthGet({
                    url: '/api/equip/queryEquipByKey',
                    param: '',
                    success: function (data) {
                        self.restaurants = data
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
            // 主题模糊搜索数据来源
            querySearchThemeData() {
                let self = this
                if (this.manageDeviceData.toeiEquipmentType != '' && this.manageDeviceData.toeiEquipmentCore != '' && this.manageDeviceData.toeiEquipmentCountry != '') {
                    let parmams = {
                        toeiEquipmentCore: self.manageDeviceData.toeiEquipmentCore,
                        toeiEquipmentType: self.manageDeviceData.toeiEquipmentType,
                        toeiEquipmentCountry: self.manageDeviceData.toeiEquipmentCountry
                    }
                    crud.skyworthGet({
                        url: '/api/equip/getSchemeList',
                        param: parmams,
                        success: function (data) {
                            self.manageDeviceData.toeiUseingSchemeName = data.toseName
                            self.manageDeviceData.toeiUseingScheme = data.toseId
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
            handleSelect(item) {
                this.searchName = item.tourName
                this.searchCode = item.tourAccount
            },
            handleIconClick(ev) {
                console.log(ev)
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
</style>
