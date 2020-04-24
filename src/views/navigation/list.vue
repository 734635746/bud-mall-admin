<template>
  <div class="app-container">

    <el-form :inline="true" class="demo-form-inline" style="margin-bottom:20px">
      <el-button type="primary" icon="el-icon-plus" @click="categoryDialogVisible=true">添加分类导航</el-button>
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" width="95" prop="id" />
      <el-table-column label="导航标题" prop="title" />
      <el-table-column label="导航类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==0" type="primary">分类导航</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="导航图片" width="110" align="center">
        <template slot-scope="scope">
          <span><img class="avatar" :src="scope.row.image"></span>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" prop="content" />

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button slot="reference" type="primary" icon="el-icon-edit" size="small" @click="edit(scope.$index)">编辑</el-button>
          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            cancel-button-type="info"
            confirm-button-type="danger"
            title="确定删除这一数据吗？"
            @onConfirm="del(scope.$index)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--添加商品横幅文本框-->
    <el-dialog :visible.sync="categoryDialogVisible" title="添加/修改分类导航">
      <el-form :model="categoryNavigation" label-width="120px">
        <el-form-item label="导航标题">
          <el-input v-model="categoryNavigation.title" />
        </el-form-item>

        <el-form-item label="导航图片">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/admapi/file"
            :headers="headers"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="分类">
          <div class="block">
            <el-cascader
              v-model="categoryNavigation.categoryId"
              :options="categoryList"
              :props="{ expandTrigger: 'hover' ,label:'categoryName', value:'categoryId',emitPath:false}"
            />
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{categoryDialogVisible = false}">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateCategoryNavigation()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import navigationApi from '@/api/navigation'
import { getToken } from '@/utils/auth'
import productCategoryApi from '@/api/product-category'

const defaultCategoryNavigation = {
  index: -1,
  id: 0,
  title: '',
  image: '',
  categoryId: 0
}

export default {
  data() {
    return {
      list: [], // 导航列表
      loading: false,
      headers: { 'authToken': getToken() },
      categoryList: [], // 分类列表
      categoryDialogVisible: false,
      categoryNavigation: {
        index: -1,
        id: 0,
        title: '',
        image: '',
        categoryId: 0
      }
    }
  },
  watch: {
    categoryDialogVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新banner数据
        this.categoryNavigation = { ...defaultCategoryNavigation }
        // 清除文件上传控件的文件列表
        this.$refs.upload.clearFiles()
        this.loadList()
      }
    }
  },
  created() {
    this.loadList()
    productCategoryApi.getList().then(response => { // 获取商品分类列表
      this.categoryList = this.getTreeData(response.data)
    })
  },
  methods: {
    loadList() { // 拉取列表
      navigationApi.getList().then(response => {
        this.list = response.data
      })
    },
    del(index) { // 删除横幅数据
      const data = this.list[index]
      navigationApi.remove(data.id).then(response => {
        this.$message.success('删除成功')
        this.loadList()
      })
    },
    edit(index) { // 修改分类导航
      const data = this.list[index]
      if (data.type === 0) { // 修改分类
        var navigation = JSON.parse(JSON.stringify(data))
        var categoryId = data.content.substring(data.content.lastIndexOf('=') + 1)
        this.categoryNavigation = navigation
        this.categoryNavigation.index = index
        this.categoryNavigation.categoryId = parseInt(categoryId)
        this.categoryDialogVisible = true
      }
    },
    saveOrUpdateCategoryNavigation() { // 编辑或修改分类导航
      if (this.categoryNavigation.index === -1) {
        navigationApi.saveCategoryNavigation(this.categoryNavigation).then(response => {
          this.$message.success('添加成功')
          this.categoryDialogVisible = false
        })
      } else {
        navigationApi.updateCategoryNavigation(this.categoryNavigation).then(response => {
          this.$message.success('修改成功')
          this.categoryDialogVisible = false
        })
      }
    },
    handleExceed() { // 超出文件上传个数
      this.$message.info('最多只能上传一个文件,您可以选择删除之前的文件')
    },
    submitUpload() { // 上传文件
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) {
      this.$message.success('文件上传成功')
      this.categoryNavigation.image = response.data.url
    },
    fileUploadError() {
      this.$message.error('文件上传失败')
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar {
    width: 100px;
    height: auto;
  }
</style>
