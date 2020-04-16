<template>
  <div class="app-container">
    <el-form ref="productInfoForm" :model="productInfo" label-width="120px" :rules="rules">

      <!--商品分类-->
      <el-form-item label="商品分类" prop="categoryId">
        <!--一级分类-->
        <el-select
          v-model="categoryFirstId"
          placeholder="请选择"
          @change="categoryOneChanged"
        >
          <el-option
            v-for="category in productCategoryList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryId"
          />
        </el-select>
        <!--二级分类-->
        <el-select
          v-if="productCategorySecondList.length!=0"
          v-model="categorySecondId"
          placeholder="请选择"
          @change="categorySecondChanged"
        >
          <el-option
            v-for="category in productCategorySecondList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryId"
          />
        </el-select>
        <!--三级分类-->
        <el-select
          v-if="productCategoryThirdList.length!=0"
          v-model="categoryThirdId"
          placeholder="请选择"
          @change="categoryThirdChanged"
        >
          <el-option
            v-for="category in productCategoryThirdList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品品牌" prop="brandId">
        <el-select v-model="productInfo.brandId" placeholder="选择商品品牌">
          <el-option v-for="brand in productBrandList" :key="brand.id" :label="brand.brandName" :value="brand.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="商品名字" prop="productName">
        <el-input v-model="productInfo.productName" />
      </el-form-item>

      <el-form-item label="商品图片" prop="productImg">
        <el-upload
          class="upload-demo"
          action="/admapi/file"
          :on-success="handleSuccess"
          :headers="headers"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input v-model="productInfo.price" />
      </el-form-item>
      <el-form-item label="商品原价" prop="originPrice">
        <el-input v-model="productInfo.originPrice" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="productInfo.stock" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="productInfo.sort" />
      </el-form-item>
      <el-form-item label="商品介绍" prop="intro">
        <tinymce v-model="productInfo.intro" :height="300" />
      </el-form-item>
      <el-form-item label="商品服务" prop="services">
        <el-input v-model="productInfo.services" />
      </el-form-item>

      <el-form-item label="商品服务">
        <template>
          <el-checkbox-group v-model="serviceIds">
            <el-checkbox
              v-for="service in productServiceList"
              :key="service.id"
              :lable="service.id"
              @change="handleServiceChange"
            >{{ service.serviceName }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>

      <el-form-item label="SKU列表" prop="skuList">
        <el-input v-model="productInfo.skuList" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>

<script>
import productBrandApi from '@/api/product-brand'
import productCategoryApi from '@/api/product-category'
import productServiceApi from '@/api/product-service'
import productInfoApi from '@/api/product-info'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

export default {
  components: { Tinymce },
  data() {
    return {
      productInfo: {// 商品详情对象
        categoryId: 0,
        brandId: 0,
        shopId: 1, // 默认
        productName: '',
        productImg: '',
        price: 0.00,
        originPrice: 0.00,
        stock: 0,
        sales: 0, // 默认
        sort: 0,
        intro: '',
        services: '',
        skuList: []
      },
      productBrandList: [], // 商品品牌列表
      productServiceList: [], // 商品服务列表
      productCategoryList: [], // 商品分类列表
      productCategorySecondList: [], // 商品二级分类列表
      productCategoryThirdList: [], // 商品三级分类列表
      categoryFirstId: 0, // 一级分类id
      categorySecondId: 0, // 二级分类id
      categoryThirdId: 0, // 三级分类id
      serviceIds: [], // 服务id数组
      headers: { 'authToken': getToken() },
      // 校验规则
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }]
      }

    }
  },
  created() {
    productBrandApi.getList().then(respone => { // 获取商品品牌列表
      if (respone.code === 0) {
        this.productBrandList = respone.data
      }
    })
    productCategoryApi.getList().then(response => { // 获取商品分类列表
      if (response.code === 0) {
        this.productCategoryList = response.data
      }
    })
    productServiceApi.getList().then(response => { // 获取商品服务列表
      if (response.code === 0) {
        this.productServiceList = response.data
      }
    })
  },
  methods: {
    onSubmit() { // 提交添加
      productInfoApi.addProductInfo(this.productInfo).then(response => {

      })
    },
    onCancel() {
      this.$router.push({ path: '/product-info/list' })
    },
    // 一级分类选项变化回调方法
    categoryOneChanged(value) {
      // 清除三级分类列表
      this.productCategoryThirdList = []
      for (let i = 0; i < this.productCategoryList.length; i++) {
        if (this.productCategoryList[i].categoryId === value) {
          this.productCategorySecondList = this.productCategoryList[i].children
          this.productInfo.categoryId = this.categoryFirstId
        }
      }
    },
    // 二级分类选项变化回调方法
    categorySecondChanged(value) {
      for (let i = 0; i < this.productCategorySecondList.length; i++) {
        if (this.productCategorySecondList[i].categoryId === value) {
          this.productCategoryThirdList = this.productCategorySecondList[i].children
          this.productInfo.categoryId = this.categorySecondId
        }
      }
    },
    // 三级分类选项变化回调方法
    categoryThirdChanged(value) {
      this.productInfo.categoryId = this.categoryThirdId
    },
    // 图片上传成功回调
    handleSuccess(file) {
      if (file.code === 0) {
        this.productInfo.productImg = this.productInfo.productImg + file.data.url + ','
      }
    },
    handleServiceChange(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
</style>
