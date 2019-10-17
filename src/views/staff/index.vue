<template>
    <div>
        <el-form ref="searchForm" :model="searchMap" :inline="true" style="margin-top:20px" size="mini">
            <el-form-item prop="username">
                <el-input v-model="searchMap.username" placeholder="账号" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="姓名" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData">查询</el-button>
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :header-cell-style="{color:'#333'}" @current-change="choose" :highlight-current-row="true" :data="list" height="380" border style="width: 100%" size="mini">
            <el-table-column label="选择" width="50">
                <template slot-scope="scope">
                <el-radio v-model="current" :label="scope.row.id"><i></i></el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="110"></el-table-column>
            <el-table-column prop="salary" label="薪酬"></el-table-column>
            <el-table-column prop="entryDate" label="入职时间"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDele(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="400px">
            <el-form ref="pojoForm" :rules="rules" :model="pojo" label-width="100px" label-position="right" size="mini">
                <el-form-item label="账号" prop="username"> 
                    <el-input v-model="pojo.username" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="姓名" prop="name"> 
                    <el-input v-model="pojo.name" clearable style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="姓名" prop="age"> 
                    <el-input v-model="pojo.age" clearable style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="姓名" prop="mobile"> 
                    <el-input v-model="pojo.mobile" clearable style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="姓名" prop="salary"> 
                    <el-input v-model="pojo.salary" clearable style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="入职时间" prop="entryDate" style="width: 220px;">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="pojo.entryDate" type="date" placeholder="请点击选择"/> 
                </el-form-item>
                <el-form-item style="margin-left:30px">
                    <el-button type="primary" size="mini" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">保存</el-button>
                    <el-button type="primary" size="mini" @click="cancel()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api'
export default {
    data(){
        return {
            list: [],
            current: "",
            total:0,
            currentPage:1,
            pageSize:10,
            current:'',
            searchMap:{
                username:'',
                name:''
            },
            pojo:{
                id:null,
                username:'',
                name:'',
                age:'',
                mobile:'',
                salary:'',
                entryDate:''
            },
            dialogFormVisible:false,
            rules:{
                username:[
                    {required:true,message:'账号不能为空',trigger:'blur'}
                ],
                name:[
                    {required:true,message:'姓名不能为空',trigger:'blur'}
                ],
            }
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        handleEdit(id) {
            this.handleAdd()
            api.getEmpById({'id':id}).then(res => {
                if(res.status === 0){
                    this.pojo = res.data
                    this.dialogFormVisible = true
                }else{
                    this.$message({
                        type:'warning',
                        message:res.message
                    })
                }
            })
        },
        handleDele(id) {
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.depeteEmpById({'id':id}).then(res => {
                    if(res.status === 0){
                        console.log(res)
                        this.fetchData()
                    }else{
                        this.$message({
                            type:'warning',
                            message:res.message
                        })
                    }
                })
            })
        },
        updateData(formName){
            api.updateEmp(this.pojo).then(res => {
                if(res.status === 0){
                    console.log(res)
                    this.fetchData()
                    this.dialogFormVisible = false
                }else{
                    this.$message({
                        message:res.message,
                        type:'warning'
                    })
                }
            })
        },
        addData(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    //提交数据
                    api.addEmp(this.pojo).then(res => {
                        if(res.status === 0){
                            console.log(res)
                            this.fetchData()
                            this.dialogFormVisible = false
                            this.$message({
                                type:'warning',
                                message:'新增成功，初始密码为123456'
                            })
                        }else{
                            this.$message({
                                message:res.message,
                                type:'warning'
                            })
                        }
                    })
                }else{
                    return false
                }
            })
        },
        cancel(){
            this.dialogFormVisible = false
        },
        handleAdd(){
            this.pojo.id = null
            this.dialogFormVisible = true
            this.$nextTick(() => { 
                // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行 
                // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调 用resetFields方法，重置表单和清除样式 
                this.$refs['pojoForm'].resetFields()
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.fetchData()
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.fetchData()
        },
        choose(item) {
            if (!item) {
                this.current = "";
                return;
            }
            this.current = item.id;
        },
        fetchData() {
            api.searchEmpList({'currentPage':this.currentPage,'pageSize':this.pageSize,'searchMap':this.searchMap}).then(res => {
                if(res.status === 0){
                    this.total = res.data.total
                    this.list = res.data.rows
                }else{
                    this.$message({
                        type:'warning',
                        message:res.message
                    })
                }
            })
        }
    },
}
</script>