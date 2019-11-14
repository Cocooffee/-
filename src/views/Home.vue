<template>
  <div class="home">
   <el-container class="wrap">
  <el-header>Header</el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>
      <el-button type="primary" @click="dialogFormVisible=true">添加</el-button>
      <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="信息"
      prop="userOk">
    </el-table-column>
    <el-table-column
      label="备注"
      prop="aaa">
    </el-table-column>
      <el-table-column
      label="联系"
      prop="password">
    </el-table-column>
      <el-table-column
      label="时间"
      prop="idcard">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">delete</el-button>
      </template>
    </el-table-column>
  </el-table>


<div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage2"
      :page-sizes="[1, 3, 5, 8]"
      :page-size="limit"
      layout="sizes, prev, pager, next"
      :total="total">
    </el-pagination>
</div>

    </el-main>
</el-container>

</el-container>

<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="信息" :label-width="formLabelWidth">
      <el-input v-model="form.userOk" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input v-model="form.aaa" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="联系" :label-width="formLabelWidth">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
       <el-form-item label="时间" :label-width="formLabelWidth">
      <el-input v-model="form.idcard" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="okGo()" >确 定</el-button>
  </div>
</el-dialog>


<el-dialog title="收货地址" :visible.sync="dialogFormVisible1">
  <el-form :model="form">
    <el-form-item label="信息" :label-width="formLabelWidth">
      <el-input v-model="form1.userOk" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input v-model="form1.aaa" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="联系" :label-width="formLabelWidth">
      <el-input v-model="form1.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="时间" :label-width="formLabelWidth">
      <el-input v-model="form1.idcard" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="okGo1()">确 定</el-button>
  </div>
</el-dialog>

  </div>
  
</template>

<script>

export default {
  name: 'home',

  data(){
    return{
       tableData:[],
       pagenum:1,
       limit:3,
       total:0,
      dialogFormVisible: false,
      dialogFormVisible1:false,
        form: {
          userOk: '',
          aaa: '',
          password: '',
          idcard: '',
        },

        form1: {
          userOk: '1',
          aaa: '',
          password: '',
          idcard: '',
         },

        formLabelWidth: '120px',
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
    }
  },
   created(){
     this.getPage()
    },
   methods: {
     getPage(){
         this.$http.get('/api/list',{params:{pagenum:this.pagenum,limit:this.limit}}).then(res=>{
        if(res.data.code===1){

          this.tableData=res.data.data
          this.total=res.data.total
        }
        console.log(this.tableData)
      })
     },

      handleEdit(index, row) {

       this.dialogFormVisible1=true
     
      const id=row.id
      console.log(id)
      console.log(this.form1.userOk)
      this.$http.post('/api/emit',{userOk:this.form1.userOk,aaa:this.form1.aaa,password:this.form1.password,idcard:this.form1.idcard,id:id}).then(res=>{
        console.log('11',res)
      })
      },



      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('/api/del',{params:{id:row.id}}).then(res=>{
            if(res.data.code===1){
                this.getPage()
                this.$message({
            type: 'success',
            message: '删除成功!'
          });
           this.getPage()
            }else{
               this.$message({
            type: 'info',
            message: res.data.msg
          });   
            }
          })
        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      },

      okGo(){
        this.$http.post('/api/new',{...this.form}).then(res=>{
          console.log(res)
          if(res.data.code===1){
            this.$message({
            type: 'success',
            message: '添加成功!'
            
          });
           this.dialogFormVisible=false
          this.getPage()
          this.qingc()
          }
        })
      },
      qingc(){
        this.form={
            userOk: '',
          aaa: '',
          password: '',
          idcard: '',
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.limit=val
        this.getPage()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum=val
        this.getPage()
      }
    }
  
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
  }
  .el-container{
    height: 100%;
    overflow: hidden;
  }

</style>
