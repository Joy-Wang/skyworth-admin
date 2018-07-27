<template>
    <!-- 流量监控与推荐 -->
    <div class="flow-monitoring">
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
            <el-row class="table-minHeight">
                <el-col :span="12">
                    <el-table :data="tableData" border stripe style="width: 100%" ref="multipleTable" :row-key="getRowKeys" @select='select' @select-all='selectAll' @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :reserve-selection="true" width="50" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="50" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column label="应用名称" header-align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a>{{ scope.row.toanName }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="toanTypeName" label="分类" width="80" header-align="center" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="toanLoadTotals" label="下载总量" width="80" header-align="center" align="center" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <div id="pieBox">
                        <div id="pieEchartContainer" style="width:500px; height:500px"></div>
                    </div>
                </el-col>
            </el-row>
            <div class="type-box"><a :class="isMonth ? 'activeT' : ''" @click="changeType(true)" title="月下载量">月</a> / <a :class="isMonth ? '' : 'activeT'" @click="changeType(false)" title="周下载量">周</a></div>
            <el-row>
                <el-col :span="24">
                    <div id="lineBox">
                        <div id="lineEchartContainer" style="width:800px; height:500px"></div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import echarts from "echarts"
    import $ from 'jquery'
    import * as crud from '../../../../static/js/skyworth-crud'
    export default {
        components: {
        },
        data: () => ({
            pageQuery: { // 分页
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            searchType: '',
            searchName: '',
            appType: [],
            tableData: [],
            dataPie: [],
            multipleSelection: [],
            multipleSelectionId: [], // 保存已选ID
            select_order_number: '',
            select_orderId: [],
            firstTime: true, // 标识第一次进入
            pieBox: null,
            pieEchartContainer: null,
            pieChart: null,
            lineBox: null,
            lineEchartContainer: null,
            lineChart: null,
            selectionTotal: 0,
            isMonth: true,
            weekList: [],
            monthAndWeekSaveType: true,
            getRowKeys(row) {
                return row.toanId
            }
        }),
        created () {
            this.getData()
            this.getSelectData()
            this.SetEchartsData()
        },
        mounted() {
            let self = this
            this.weekList = this.setWeek()
            setTimeout(function () {
                for (let i = 0; i < self.tableData.length; i++) {
                    self.$refs.multipleTable.toggleRowSelection(self.tableData[i])
                }
            }, 50)
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.pageQuery.pageNum = val
                this.getData()
            },
            handleSizeChange(val) {
                this.pageQuery.pageSize = val
                this.getData()
            },
            // 获取下拉列表数据
            getSelectData (type) {
                let self = this
                crud.skyworthGet({
                    url: '/api/public/queryBaseType',
                    param: {codeType: 'app_type'},
                    success: function (data) {
                        self.appType = data.data
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
            // 获取数据
            getData() {
                let self = this
                let dataUrl = '/api/app/queryApplicationList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
                crud.skyworthGet({
                    url: dataUrl,
                    param: '',
                    success: function (data) {
                        self.tableData = data.data.list
                        self.pageQuery.total = data.data.total
                        self.selectionTotal = data.data.total > 10 ? 10 : data.data.total // 保存多选框第一次选择的数量
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
            // 选择时
            select(selection, row) {
            },
            selectAll(selection) {
            },
            // 选择项改变
            handleSelectionChange(selection) {
                let self = this
                this.multipleSelection = selection

                this.multipleSelectionId = selection.map((item) => { // 获取已选择的ID
                    return item.toanId
                })
                if (self.firstTime && selection.length == self.selectionTotal) { // 第一次
                    let selectNull = selection.length == 0 ? true : false
                    self.queryAppLoadDetails(self.monthAndWeekSaveType, true, selectNull)
                    setTimeout(function(){
                        window.onresize = function () {
                            self.echartsResize(self.pieBox, self.pieEchartContainer, self.pieChart)
                            self.echartsResize(self.lineBox, self.lineEchartContainer, self.lineChart)
                        }
                    }, 500)
                    self.firstTime = false
                } else if (!self.firstTime) { // 非第一次
                    let selectNull = selection.length == 0 ? true : false
                    self.queryAppLoadDetails(self.monthAndWeekSaveType, true, selectNull)
                }
            },
            SetEchartsData(data) {
                let self = this
                // 饼状图
                
                crud.skyworthGet({
                    url: '/api/app/queryAppTypePercentList',
                    param: '',
                    success: function (data) {
                        let pieBox = $('#pieBox')
                        let pieEchartContainer = $('#pieEchartContainer')
                        pieEchartContainer.css('width', pieBox.width())
                        pieEchartContainer.css('height', pieBox.height())
                        let pieChart = echarts.init(document.getElementById('pieEchartContainer'), 'infographic')
                        self.pieBox = pieBox
                        self.pieEchartContainer = pieEchartContainer
                        self.pieChart = pieChart

                        let dataPie = []
                        for (let i = 0; i < data.data.length; i++) {
                            let nullPei = {}
                            nullPei.name = data.data[i].toanTypeName
                            nullPei.value = data.data[i].loadNum
                            dataPie.push(nullPei)
                        }
                        let option ={
                            name: '访问来源',
                            title: { text: '下载总量饼状图' },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{b} : {c} ({d}%)"
                            },
                            type: 'pie',
                            radius: '55%',
                            series: [{
                                name: '点击量',
                                type: 'pie',
                                selectedMode: 'single',
                                data: dataPie
                            }]
                        }
                        pieChart.setOption(option, true)
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
            // 根据ID获取点击量信息
            queryAppLoadDetails(dateType, isCheck, selectNull) {
                let self = this
                // 折线图
                let lineBox = $('#lineBox')
                let lineEchartContainer = $('#lineEchartContainer')
                lineEchartContainer.css('width', lineBox.width())
                lineEchartContainer.css('height', lineBox.height())
                let lineChart = echarts.init(document.getElementById('lineEchartContainer'), 'dark')
                this.lineBox = lineBox
                this.lineEchartContainer = lineEchartContainer
                this.lineChart = lineChart
                let titleText = this.isMonth ? '月下载量折线图' : '周下载量折线图'
                // lineChart.showLoading()
                let params = {idx: self.multipleSelectionId.join(',')}
                
                let option = {
                    title: { text: titleText },
                    tooltip: {
                        // trigger: 'axis'
                    },
                    calculable: true,
                    legend: {
                        data: []
                    },
                    xAxis: {
                        data: []
                    },
                    yAxis: {},
                    series: []
                }
                // 如果没有选中项，则清空图表
                if (selectNull) {
                    option.legend.data = []
                    option.xAxis.data = []
                    option.series = []
                    lineChart.clear()
                    lineChart.setOption(option, true)
                    return false
                }

                if (!isCheck) { // 表示不是通过多选框进入，通过月与周切换进入
                    if (dateType == self.monthAndWeekSaveType) { // 点击同一个月或周
                        return false
                    } else {
                        self.monthAndWeekSaveType = dateType
                    }
                }

                if (dateType) {
                    crud.skyworthGet({
                        url: '/api/app/queryAppLoadDetailsByMonth',
                        param: params,
                        success: function (data) {
                            let dataB = data.data
                            let nameList = []
                            let seriesList = []
                            let monthList = []
                            for (let i=0; i<dataB.length; i++) {
                                let nullSeries = {}
                                if (dataB[i].data.length > 6) {
                                    dataB[i].data.splice(0,dataB[i].data.length-6)
                                }
                                nullSeries.name = dataB[i].name
                                nullSeries.type = 'line'
                                nullSeries.smooth = true
                                nullSeries.data = (dataB[i].data.map((item) => {return item.tNum}))
                                seriesList.push(nullSeries)
                                nameList.push(dataB[i].name)
                            }
                            monthList.push(dataB[0].data.map((item) => {return item.tMonth}))
                            option.legend.data = nameList
                            option.xAxis.data = monthList[0]
                            option.series = seriesList
                            lineChart.clear()
                            lineChart.setOption(option, true)
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                            // lineChart.showLoading()
                        }
                    })
                } else {
                    crud.skyworthGet({
                        url: '/api/app/queryAppLoadDetailsByWeek',
                        param: params,
                        success: function (data) {
                            let dataB = data.data
                            let nameList = []
                            let seriesList = []
                            for (let i=0; i<dataB.length; i++) {
                                let nullSeries = {}
                                let oneData = dataB[i].data.map((item) => {return item.tWeek})
                                let nullData = []
                                for (let j=0; j<self.weekList.length; j++) {
                                    if (oneData.indexOf(self.weekList[j]) > -1) {
                                        let obj = {}
                                        obj = dataB[i].data.find((item) => {
                                        　　return item.tWeek == self.weekList[j]
                                        })
                                        nullData.push(obj.tNum)
                                    } else {
                                        nullData.push('0')
                                    }
                                }
                                nullSeries.name = dataB[i].name
                                nullSeries.type = 'line'
                                nullSeries.smooth = true
                                nullSeries.data = nullData
                                seriesList.push(nullSeries)
                                nameList.push(dataB[i].name)
                            }
                            option.legend.data = nameList
                            option.xAxis.data = self.weekList[0]
                            option.series = seriesList
                            lineChart.clear()
                            lineChart.setOption(option, true)
                        },
                        error: function (data) {
                            self.$message({
                                message: data.msg,
                                type: 'error',
                                center: true
                            })
                            // lineChart.showLoading()
                        }
                    })
                }
            },
            // 搜索
            search () {
                let self = this
                let dataUrl = '/api/app/queryApplicationList?pageNum=' + this.pageQuery.pageNum + '&pageSize=' + this.pageQuery.pageSize
                let params = {toanType: self.searchType, toanName: self.searchName}
                if (self.searchType == '' && self.searchName == '') {
                    self.getData()
                } else {
                    crud.skyworthGet({
                        url: dataUrl,
                        param: params,
                        success: function (data) {
                            self.tableData = data.data.list
                            self.pageQuery.total = data.data.total
                            self.selectionTotal = data.data.total > 10 ? 10 : data.data.total // 保存多选框第一次选择的数量
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
            // 切换月和周
            changeType(type) {
                this.isMonth = type
                this.queryAppLoadDetails(type)
            },
            setWeek () {
                let d1 = new Date()
                let d2 = new Date()
                d2.setMonth(0)
                d2.setDate(1)
                let rq = d1-d2
                let s1 = Math.ceil(rq/(24*60*60*1000))
                let sWeek = Math.ceil(s1/7)
                let week = []
                if (sWeek >= 6) {
                    for (let i=0; i < 6; i++) {
                        week.push((sWeek - i))
                    }
                }
                return week.reverse()
            },
            echartsResize (box, echartsContainer, echartsName) {
                echartsContainer.css('width', box.width())
                echartsContainer.css('height', box.height())
                echartsName.resize()
            }
        }
    }
</script>

<style scoped lang='scss'>
    .page-box{
        margin-bottom: 15px;
    }
    .type-box{
        width: 100%;
        height: 30px;
        line-height: 30px;
        margin-bottom: 20px;
        font-size: 1.0rem;
        a{
            cursor: pointer;
        }
        a.activeT{
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
    .table-minHeight{
        min-height: 475px;
    }
</style>