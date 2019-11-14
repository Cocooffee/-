const Koa = require('koa');

const app = new Koa();

const bodyparser = require('koa-bodyparser');

const router = require('koa-router')();//引入路由的包

const query = require('./db/query');//公共方法

app.use(bodyparser())  //bodyparser一定要放在路由挂载之前


app.use(router.routes()); //使用路由中间件

app.use(router.allowedMethods());  //使用路由中间件


router.get('/api/userlist',async (ctx,next) => {  //查找接口
    let data = await query('select * from paging')
    ctx.body = data
    console.log(data)
})


router.get('/api/userlist1',async (ctx,next) => {  //查找接口唯一的接口
    var {id}=ctx.query
    let data = await query('select * from paging where id=?',[id])
    ctx.body = data
    console.log(data)
})

router.post('/api/new',async ctx=>{
    let {userOk,aaa,idcard,password}=ctx.request.body //从参数出来

    if( userOk && password && idcard&&aaa){ //判断是否带来的参数
        let user=await query('select * from paging where idcard=?',[idcard])  //先查找是否有 有就显示存在

        if(user.length){ //判断长度是否为0 0是没有
            ctx.body={
                code:0,
                msg:"此人已经存在"
            }
        }else{
            try{
                await query('insert into paging (userOk,aaa,idcard,password) values (?,?,?,?)',[userOk,aaa,idcard,password])  // insert into 添加 传递的参数
                ctx.body={ //传给ctx.body
                    code:1,
                    msg:"添加成功"
                }
            }catch(e){
                ctx.body={
                    code:0,
                    msg:e
                }
            }
        }
    }else{ //参数不全就打印出来
        ctx.body={
            code:2,
            msg:"参数缺失"
        }
    }
})


router.get('/api/del',async ctx => {   //删除接口

    let {id} = ctx.query; //结构出来传来的ID
    console.log('www',id)
    if(id || id === 0){ //判断Id是否存在或者是否为0
        try{
            await query('delete from paging where id=?',[id])
            ctx.body = {
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'参数缺失'
        }
    }
})


router.post('/api/emit',async ctx=>{ //查找接口
    let {id,userOk,aaa,idcard,password}=ctx.request.body  //带来的参数
    console.log(id,userOk,password,idcard)

    if( id&& userOk && password && idcard){  //判断参数是否存在
        try{
            await query('update paging set userOk=?,aaa=?,idcard=?,password=? where id=?',[userOk,aaa,idcard,password,id]) //update方法！
            ctx.body={
                code:1,
                msg:'成功'
            } 
        }catch(e){
            ctx.body={
                code:0,
                msg:e
            }
         
        }
    }else{
        ctx.body={
            code:2,
            msg:"参数缺失"
        }
    }
})


router.get('/api/list', async ctx=>{
    try{
        let total=await query('select count(*) from paging')
            console.log(total)
        let {pagenum=1,limit=2} =ctx.query
        let startIndex =(pagenum-1)*limit
        let data=await query(`select * from paging limit ${startIndex},${limit}`);  //分页 sql语法
        
        ctx.body={
            code:1,
            data,
            total:total[0]['count(*)']
        }
    }catch{

    }
})



app.listen(process.env.PORT || 3000,() => {
    console.log("服务启动成功")
})