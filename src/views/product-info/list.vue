<template>
  <div class="app-container">

    <!--条件查询-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-input v-model="searchObj.productName" placeholder="商品名称" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="loadList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>

    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95" prop="id" />
      <el-table-column label="所属分类" prop="categoryName" />
      <el-table-column label="所属品牌" prop="brandName" />
      <el-table-column label="商品名称" prop="productName" />
      <el-table-column label="商品图片" width="110" align="center">
        <template slot-scope="scope">
          <span><img class="avatar" :src="scope.row.productImg"></span>
        </template>
      </el-table-column>
      <el-table-column label="价格 / 原价" prop="price" />
      <el-table-column label="销量" prop="sales" />
      <el-table-column label="库存" prop="stock" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="edit(scope.$index)">编辑</el-button>
          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            cancel-button-type="info"
            confirm-button-type="danger"
            title="确定删除此商品吗？"
            @onConfirm="del(scope.$index)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      :pager-count="7"
      background
      style="margin-top:20px; padding:50px 0; text-align:center"
      layout="total, prev, pager, next, jumper"
      @current-change="loadList"
    />
  </div>
</template>

<script>
import productInfoApi from '@/api/product-info'

export default {
  data() {
    return {
      list: [], // 商品列表
      loading: false,
      pagination: {
        page: 1, // 页码
        size: 10, // 每页记录数
        total: 0 // 总记录数
      },
      searchObj: { productName: '' }
    }
  },
  created() {
    this.loadList()
  },
  methods: {

    loadList(page = 1) {
      this.pagination.page = page
      this.loading = true
      productInfoApi.getList(this.pagination.page, this.pagination.size, this.searchObj)
        .then(response => {
          const data = response.data
          this.pagination.total = data.total
          this.list = data.records
          this.loading = false
        }).catch(err => {
          this.$message.error(err)
          this.loading = false
        })
    },
    onSubmit() {

    },
    onCancel() {
      this.$router.push({ path: '/product-info/list' })
    },
    resetData() { // 清空
      this.searchObj = { productName: '' }
      this.loadList()
    },
    edit(index) { // 编辑商品
      const data = this.list[index]
      this.$router.push({ path: '/product-info/edit/' + data.id })
    },
    del(index) { // 删除商品
      const data = this.list[index]
      productInfoApi.deleteProductInfo(data.id).then(response => {
        this.$message.success('删除成功')
        this.loadList()
      })
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
