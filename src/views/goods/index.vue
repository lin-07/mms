<template>
    <div>
        <el-form ref="searchForm" :model="searchMap" :inline="true" style="margin-top:20px" size="mini">
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px" clearable></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="searchMap.code" placeholder="商品编码" style="width: 200px" clearable></el-input>
            </el-form-item>
           <el-form-item prop="supplierName">
               <!-- readonly 设置只读
                @click.native 绑定组件的原生事件
                -->
                <el-input readonly @click.native="dialogSupplierVisible = true" v-model="searchMap.supplierName" placeholder="选择供应商" style="width: 200px" clearable></el-input>
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
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="code" label="商品编码"></el-table-column>
            <el-table-column prop="spec" label="商品规格"></el-table-column>
            <el-table-column prop="retailPrice" label="零售价" width="110"></el-table-column>
            <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
            <el-table-column prop="storageNum" label="库存数量"></el-table-column>
            <el-table-column prop="supplierName" label="供应商"></el-table-column>
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
        <!-- 供应商对话框 -->
        <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
            <supplier :isDialog="true" @option-choose="optionChoose"></supplier>
        </el-dialog>

        <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="400px">
            <el-form ref="pojoForm" :rules="rules" :model="pojo" label-width="100px" label-position="right" size="mini">
                <el-form-item label="商品名称" prop="name"> 
                    <el-input v-model="pojo.name" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="商品编码" prop="code"> 
                    <el-input v-model="pojo.code" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="商品规格" prop="spec"> 
                    <el-input v-model="pojo.spec" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="零售价" prop="retailPrice"> 
                    <el-input v-model="pojo.retailPrice" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="进货价" prop="purchasePrice"> 
                    <el-input v-model="pojo.purchasePrice" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="库存数量" prop="storageNum"> 
                    <el-input v-model="pojo.storageNum" clearable  style="width: 220px;"/> 
                </el-form-item> 
                <el-form-item label="供应商" prop="supplierName"> 
                    <el-input readonly @click.native="editOptionSupplier" placeholder="选择供应商"  v-model="pojo.supplierName" clearable  style="width: 220px;"/> 
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
import Supplier from '@/views/supplier'
export default {
    components:{
        Supplier
    },
    data(){
        return {
            currentPage:1,
            pageSize:10,
            total:0,
            list:[],
            searchMap:{
                name:'',
                code:'',
                supplierName:'',
                supplierId:''
            },
            dialogSupplierVisible:false,
            dialogFormVisible:false,
            current:'',
            pojo:{
                id:null,
                name:'',
                code:'',
                spec:'',
                retailPrice:'',
                purchasePrice:'',
                storageNum:'',
                supplierName:'',
                supplierId:''
            },
            rules:{
                name:[
                    {required:true,message:'商品名称不能为空',trigger:'blur'}
                ],
                code:[
                    {required:true,message:'商品编码不能为空',trigger:'blur'}
                ],
                retailPrice:[
                    {required:true,message:'零售价不能为空',trigger:'blur'}
                ]
            },
            isEdit:false
        }
    },
    created(){
        this.fetchData()
    },
    methods:{
        editOptionSupplier(){
            this.dialogSupplierVisible = true
            this.isEdit = true
        },
        addData(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    //提交数据
                    api.addGoods(this.pojo).then(res => {
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
        updateData(formName){
            api.updateGoods(this.pojo).then(res => {
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
        handleEdit(id) {
            this.handleAdd()
            api.getGoodsById({'id':id}).then(res => {
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
        handleDele(id) {
            this.$confirm('确认删除这条记录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                api.depeteGoodsById({'id':id}).then(res => {
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
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        optionChoose(currentRow){
            // console.log(currentRow)
            if(this.isEdit){
                this.pojo.supplierName = currentRow.name
                this.pojo.supplierId = currentRow.id
            }else{
                this.searchMap.supplierName = currentRow.name
                this.searchMap.supplierId = currentRow.id
            }
            this.isEdit = false
            this.dialogSupplierVisible = false
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
            api.searchGoodsList({'currentPage':this.currentPage,'pageSize':this.pageSize,'searchMap':this.searchMap}).then(res => {
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
    }
}
</script>