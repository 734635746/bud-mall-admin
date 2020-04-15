<template>
  <div class="app-container">
    <el-form ref="productInfoForm" :model="productInfo" :rules="formRules" label-width="120px">
      <el-form-item label="分类Id" prop="categoryId">
        <el-input v-model="productInfo.categoryId" />
      </el-form-item>
      <el-form-item label="品牌Id" prop="brandId">
        <el-input v-model="productInfo.brandId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productInfo: {// 商品详情对象
        categoryId: 0,
        brandId: 0,
        shopId: 0,
        productName: '',
        productImg: '',
        price: '',
        originPrice: '',
        stock: '',
        sales: '',
        sort: '',
        intro: '',
        services: '',
        skuList: []
      }
    }
  },
  methods: {
    onSubmit() {

    },
    onCancel() {
      this.$router.push({ path: '/product-info/list' })
    }
  }
}
</script>
