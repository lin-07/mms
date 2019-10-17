<template>
    <div>
        <el-form ref="searchForm" :model="searchMap" :inline="true" style="margin-top:20px" size="mini">
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item prop="linkman" v-if="!isDialog">
                <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item prop="mobile" v-if="!isDialog">
                <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData">查询</el-button>
                <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
                <el-button @click="resetForm('searchForm')" v-if="!isDialog">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- :highlight-current-row="true" 激活单选行
        @current-change="choose" 当点击某一行会触发函数，并且这个函数会接收两个参数，currentRow,oldRow
         -->
        <el-table :header-cell-style="{color:'#333'}" @current-change="choose" :highlight-current-row="true" :data="list" height="380" border style="width: 100%" size="mini">
            <el-table-column label="选择" width="50">
                <template slot-scope="scope">
                <el-radio v-model="current" :label="scope.row.id"><i></i></el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="供应商名称"></el-table-column>
            <el-table-column prop="linkman" label="联系人"></el-table-column>
            <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
            <el-table-column prop="remark" label="备注" v-if="!isDialog"></el-table-column>
            <el-table-column label="操作" width="150" v-if="!isDialog">
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
            :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
            :total="total">
        </el-pagination>
        <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" width="400px"  v-if="!isDialog">
            <el-form ref="pojoForm" :rules="rules" :model="pojo" label-width="100px" label-position="right" size="mini">
                <el-form-item label="供应商名称" prop="name"> 
                    <el-input v-model="pojo.name" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="联系人" prop="linkman"> 
                    <el-input v-model="pojo.linkman" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="联系电话" prop="mobile"> 
                    <el-input v-model="pojo.mobile" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="备注" prop="remark"> 
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="pojo.remark" clearable style="width: 220px;"/> 
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
import api from "@/api";
export default {
    props:{
        isDialog:Boolean
    },
    data(){
        return {
            list:[],
            total:0,
            currentPage:1,
            pageSize:10,
            current:'',
            dialogFormVisible:false,
            searchMap:{
                name:'',
                linkman:'',
                mobile:''
            },
            pojo:{
                id:null,
                name:'',
                linkman:'',
                mobile:'',
                remark:''
            },
            rules:{
                name:[
                    {required:true,message:'供应商名称不能为空',trigger:'blur'}
                ],
                linkman:[
                    {required:true,message:'联系人不能为空',trigger:'blur'}
                ]
            }
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            api.searchSupplierList({'currentPage':this.currentPage,'pageSize':this.pageSize,'searchMap':this.searchMap}).then(res => {
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
        },
        choose(item) {
            if (!item) {
                this.current = "";
                return;
            }
            this.current = item.id;
            this.$emit('option-choose',item)
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.fetchData()
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.fetchData()
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
        cancel(){
            this.dialogFormVisible = false
        },
        addData(formName){
            this.$refs[formName].validate(valid => {
                    if(valid){
                        //提交数据
                        api.addSupplier(this.pojo).then(res => {
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
                    }else{
                        return false
                    }
                })
        },
        handleEdit(id) {
            this.handleAdd()
            api.getSupplierById({'id':id}).then(res => {
                if(res.status === 0){
                    console.log(res)
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
        updateData(formName){
            api.updateSupplier(this.pojo).then(res => {
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
        handleDele(id) {
            this.$confirm('确认删除这条记录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                api.depeteSupplierById({'id':id}).then(res => {
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
    }
}
</script>