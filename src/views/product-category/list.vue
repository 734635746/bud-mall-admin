<template>
  <div class="app-container">

    <el-button type="text" @click="dialogFormVisible=true">添加一级商品分类</el-button>

    <el-tree
      ref="categoryTree"
      :data="categoryList"
      :props="defaultProps"
      class="filter-tree"
      default-expand-all
      node-key="id"
    >
      <span slot-scope="{ node , data}" class="custom-tree-node">

        <i class="el-icon-menu" />
        <span>{{ node.label }}</span>

        <span>
          <el-button
            v-if="node.level!=0"
            type="text"
            size="mini"
            @click="()=>{dialogFormVisible=true,category.parentId=data.categoryId}"
          >
            添加下级商品分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="()=>{dialogFormVisible=true,PaddingCategory(data)}"
          >
            修改
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="deleteProductCategory(data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--添加分类的文本框-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加/修改分类">
      <el-form :model="category" label-width="120px" :rules="formRules">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="category.categoryName" />
        </el-form-item>

        <el-form-item label="分类图标">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="admapi/file"
            :headers="headers"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取图标</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序权重">
          <el-input v-model="category.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{dialogFormVisible = false}">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateCategory()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import categoryApi from '@/api/product-category'
import { getToken } from '@/utils/auth'

const defaultCategory = {
  categoryId: '',
  parentId: '0',
  categoryName: '',
  icon: '',
  sort: 0
}

export default {

  data() {
    return {
      categoryList: [], // 分类列表
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      // 添加文本框显示状态
      dialogFormVisible: false,
      // 添加分类信息
      category: {
        categoryId: '', // 分类id，修改时有效
        parentId: '0', // 父级id，添加时有效
        categoryName: '',
        icon: '',
        sort: 0
      },
      headers: { 'authToken': getToken() },
      // 表单校验
      formRules: {
        categoryName: [{ required: true, trigger: 'blur', message: '分类名称不能为空' }]
      }
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新catagory数据
        this.category = { ...defaultCategory }
        // 清除文件上传控件的文件列表
        this.$refs.upload.clearFiles()
      }
    }
  },
  created() {
    // 创建页面的时候拉取远程数据
    this.fetchCategoryList()
  },
  methods: {
    fetchCategoryList() { // 获取分类数据
      categoryApi.getList().then(response => {
        if (response.code === 0) {
          this.categoryList = response.data
        }
      })
    },
    addOrUpdateCategory() { // 添加或者修改商品分类
      console.log(this.category)
      if (this.category.categoryId === '') { // 添加操作
        categoryApi.addProductCategory(this.category).then(response => {
          if (response.code === 0) {
            this.$message.success('添加成功')
            // 关闭选项框
            this.dialogFormVisible = false
            // 刷新页面
            this.fetchCategoryList()
          }
        })
      } else { // 修改操作
        categoryApi.updateProductCategory(this.category).then(response => {
          if (response.code === 0) {
            this.$message.success('修改成功')
            // 关闭选项框
            this.dialogFormVisible = false
            // 刷新页面
            this.fetchCategoryList()
          }
        })
      }
    },
    deleteProductCategory(data) { // 删除商品分类
      this.$confirm('确定删除该商品分类及其子分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return categoryApi.removeByCategoryId(data.categoryId)
      }).then(() => { // 上一个then成功则返回这里
        this.fetchCategoryList()// 刷新页面
        this.$message.success('删除成功')
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message.info('已取消删除')
        }
      })
    },
    PaddingCategory(data) { // 修改商品分类信息时，填充信息
      this.category = data
    },
    handleExceed() { // 超出文件上传个数
      this.$message.info('最多只能上传一个文件,您可以选择删除之前的文件')
    },
    submitUpload() { // 上传文件
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) {
      this.$message.success('文件上传成功')

      this.category.icon = response.data.url
    },
    fileUploadError() {
      this.$message.error('文件上传失败')
    }
  }
}
</script>
