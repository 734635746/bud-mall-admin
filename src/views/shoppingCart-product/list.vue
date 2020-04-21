<template>
  <div class="app-container">
    <!--条件查询-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="mobile" placeholder="用户手机号" />
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
      <el-table-column label="用户ID" width="95" prop="userId" />
      <el-table-column label="店铺名称" prop="shopName" />
      <el-table-column label="商品名称" prop="productName" />
      <el-table-column label="商品SKU名称" prop="skuName" />
      <el-table-column label="商品图片" width="110" align="center">
        <template slot-scope="scope">
          <span><img class="avatar" :src="scope.row.productImg"></span>
        </template>
      </el-table-column>
      <el-table-column label="商品单价" prop="productPrice" />
      <el-table-column label="商品数量" prop="productAmount" />
      <el-table-column label="是否选中">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSelected==1" type="success">是</el-tag>
          <el-tag v-if="scope.row.isSelected==0" type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">

          <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.$index)">删除</el-button> -->

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

  </div>
</template>

<script>
import shoppingCartProductApi from '@/api/shoppingCart-product'

export default {
  data() {
    return {
      mobile: '',
      list: [],
      loading: false
    }
  },
  methods: {
    loadList() {
      shoppingCartProductApi.getList(this.mobile).then(response => {
        this.list = response.data
      })
    },
    resetData() {
      this.mobile = ''
      this.list = []
    },
    del(index) { // 删除购物车商品信息
      const data = this.list[index]
      shoppingCartProductApi.remove(data.id).then(response => {
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
