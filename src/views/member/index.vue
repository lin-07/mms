<template>
  <div>
    <el-form ref="searchForm" :model="searchMap" :inline="true" style="margin-top:20px" size="mini">
        <el-form-item prop="cardNum">
            <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="会员名称" style="width: 200px" clearable></el-input>
        </el-form-item>
        <el-form-item prop="type">
            <el-select v-model="searchMap.type" placeholder="支付类型" style="width: 110px">
            <el-option v-for="e in payTypes" :key="e.type" :label="e.name" :value="e.type"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="birthday">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="出生日期" v-model="searchMap.birthday"></el-date-picker>
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
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="110"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
          <template slot-scope="scope">
              <span>{{ scope.row.paytype | paytypeFilter }}</span>
          </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180"></el-table-column>
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

    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="400px">
        <el-form ref="pojoForm" :rules="rules" :model="pojo" label-width="100px" label-position="right" size="mini">
            <el-form-item label="会员卡号" prop="cardNum"> 
                <el-input v-model="pojo.cardNum" clearable  style="width: 220px;"/> 
            </el-form-item> 
            <el-form-item label="会员姓名" prop="name"> 
                <el-input v-model="pojo.name" clearable style="width: 220px;"/> 
            </el-form-item> 
            <el-form-item label="会员生日" prop="brithday" style="width: 220px;">
                <el-date-picker value-format="yyyy-MM-dd" v-model="pojo.brithday" type="date" placeholder="请点击选择"/> 
            </el-form-item>
            <el-form-item label="手机号码" prop="phone"> 
                <el-input v-model="pojo.phone" clearable style="width: 220px;"/> 
            </el-form-item>
            <el-form-item label="开卡金额" prop="money"> 
                <el-input v-model="pojo.money" clearable style="width: 220px;"/> 
            </el-form-item>
            <el-form-item label="可用积分" prop="integral"> 
                <el-input v-model="pojo.integral" clearable style="width: 220px;"/> 
            </el-form-item>
            <el-form-item label="支付类型" prop="type"> 
                <el-select v-model="pojo.type" placeholder="支付类型" clearable style="width: 220px;">
                    <el-option v-for="e in payTypes" :key="e.type" :label="e.name" :value="e.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="会员地址" prop="address"> 
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="pojo.address" clearable style="width: 220px;"/> 
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
const payTypes = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      current: "",
      total:0,
      currentPage:1,
      pageSize:10,
      searchMap:{
          cardNum:'',
          name:'',
          type:'',
          birthday:''
      },
      payTypes,
      pojo:{
        id:null,
        cardNum:'',
        name:'',
        brithday:'',
        phone:'',
        money:'',
        integral:'',
        type:'',
        address:''
     },
     dialogFormVisible:false,
     rules:{
         cardNum:[
             {required:true,message:'卡号不能为空',trigger:'blur'}
         ],
         name:[
             {required:true,message:'姓名不能为空',trigger:'blur'}
         ],
         type:[
             {required: true, message: '支付类型不能为空', trigger: 'change'}
         ]
     }
    }
  },
  filters:{
      paytypeFilter(type){
          //过滤器中不能引用this实例，所以数组常量要定义在外面
          const payType = payTypes.find(obj => {
              return obj.type === type
          })
          return payType ? payType.name : null
      }
  },
  created() {
    this.fetchData();
  },
  methods: {
    addData(formName){
        this.$refs[formName].validate(valid => {
            if(valid){
                //提交数据
                api.addMember(this.pojo).then(res => {
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
        api.updateMember(this.pojo).then(res => {
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
    resetForm(formName){
         this.$refs[formName].resetFields();
    },
    choose(item) {
      if (!item) {
        this.current = "";
        return;
      }
      this.current = item.id;
    },
    handleEdit(id) {
        this.handleAdd()
        api.getMemberById({'id':id}).then(res => {
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
            api.depeteMemberById({'id':id}).then(res => {
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
    handleSizeChange(pageSize){
        this.pageSize = pageSize
        this.fetchData()
    },
    handleCurrentChange(currentPage){
        this.currentPage = currentPage
        this.fetchData()
    },
    fetchData() {
        api.searchMemberList({'currentPage':this.currentPage,'pageSize':this.pageSize,'searchMap':this.searchMap}).then(res => {
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
};
</script>