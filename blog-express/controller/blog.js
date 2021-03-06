const { exec } = require('../db/mysql');
const {xss} = require('xss');

// 获取博客列表
const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`;
    // 返回的是promise
    return exec(sql);
}

// 获取博客的某一条信息
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`;
    return exec(sql).then(rows=>{
        return rows[0];
    });
    
}
// 新建一条博客
const newBlog = ((blogData = {}) => {
    const {content,author} = blogData;
    // const title = xss(blogData.title);
    const title = blogData.title;

    const createtime = +new Date();
    const sql = `
        insert into blogs (title,content,createtime,author)
        values ('${title}','${content}','${createtime}','${author}')
    `
    return exec(sql).then(insertData=>{
        console.log('insertData is ',insertData);
        return{
            id:insertData.insertId
        }
    })

    return {
        id: 3
    };
})
// 更新一条博客
const updateBlog = (id, blogData = {}) => {
    // console.log('update blog ', id, blogData);
    // return true
    const {title,content} = blogData;
    console.log('blogData: ',blogData);

    const sql = `
        update blogs set title='${title}',content='${content}' where id=${id}
    `;
    return exec(sql).then(updateData=>{
        console.log('updateData is ',updateData);
        if(updateData.affectedRows > 0){
            return true;
        }
        return false;
    });

}
// 删除博客
const delBolg = (id,author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`;
    return exec(sql).then(delData=>{
        if(delData.affectedRows > 0){
            return true;
        }
        return false;
    });
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBolg
}