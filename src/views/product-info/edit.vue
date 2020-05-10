<template>
  <div class="app-container">

    <el-form ref="productInfoForm" :model="productInfo" label-width="120px" :rules="rules">
      <!--商品分类-->
      <el-form-item label="商品分类" prop="categoryId">
        <div class="block">
          <el-cascader
            v-model="productInfo.categoryId"
            placeholder="请选择商品分类"
            :options="productCategoryList"
            :props="{ expandTrigger: 'hover' ,label:'categoryName', value:'id',emitPath:false}"
          />
        </div>
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
          action="admapi/file"
          :on-success="handleSuccess"
          :file-list="fileList"
          :headers="headers"
          :on-remove="handleRemove"
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
      <el-form-item label="销量" prop="sales">
        <el-input v-model="productInfo.sales" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="productInfo.sort" />
      </el-form-item>
      <el-form-item label="商品介绍" prop="intro">
        <tinymce v-model="productInfo.intro" :height="300" />
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
        <el-button type="primary" @click="dialogFormVisible=true">添加商品SKU</el-button>
        <!--SKU列表-->
        <template>
          <el-table v-if="productInfo.skuList.length!=0" :data="productInfo.skuList" style="width: 100%">
            <el-table-column label="SKU名称" width="180">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.skuName }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="价格" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.price }}</span>
              </template>
            </el-table-column>

            <el-table-column label="原价" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.originPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库存" width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.stock }}</span>
              </template>
            </el-table-column>

            <el-table-column label="SKU图片" width="180">
              <template slot-scope="scope">
                <span><img class="picture" :src="scope.row.picture"></span>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <!--添加SKU分类的文本框-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加/修改SKU">
      <el-form :model="sku" label-width="120px" :rules="skuRules">
        <el-form-item label="SKU名称" prop="skuName">
          <el-input v-model="sku.skuName" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="sku.price" />
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="sku.originPrice" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="sku.stock" />
        </el-form-item>
        <el-form-item label="SKU图片">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="admapi/file"
            :headers="headers"
            :limit="1"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选则图片</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{dialogFormVisible = false}">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSku()">确 定</el-button>
      </div>
    </el-dialog>

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
        id: 0,
        categoryId: 0,
        brandId: 0,
        shopId: 1, // 默认
        productName: '',
        productImg: '',
        price: 0.00,
        originPrice: 0.00,
        stock: 0,
        sales: 0,
        sort: 0,
        intro: '',
        services: '',
        skuList: []
      },
      sku: {// sku临时对象
        index: -1, // sku下标位置，修改时有效
        id: 0,
        productId: 0,
        skuName: '',
        price: 0,
        originPrice: 0,
        stock: 0,
        picture: ''
      },
      productBrandList: [], // 商品品牌列表
      productServiceList: [], // 商品服务列表
      productCategoryList: [], // 商品分类列表
      serviceIds: [], // 商品服务id
      dialogFormVisible: false,
      fileList: [], // 商品图片列表
      // 表单校验
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }]
      },
      // sku校验
      skuRules: {
        skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }]
      },
      headers: { authToken: getToken() }
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新catagory数据
        this.sku = {// sku临时对象
          index: -1,
          id: 0,
          productId: 0,
          skuName: '',
          price: 0,
          originPrice: 0,
          stock: 0,
          picture: ''
        }
        // 清除文件上传控件的文件列表
        this.$refs.upload.clearFiles()
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
        this.productCategoryList = this.getTreeData(response.data)
      }
    })
    productServiceApi.getList().then(response => { // 获取商品服务列表
      if (response.code === 0) {
        this.productServiceList = response.data
      }
    })
  },
  mounted() {
    const params = this.$route.params
    this.productInfo.id = params.id
    this.loadProductInfo()
  },
  methods: {
    loadProductInfo() { // 加载商品信息
      productInfoApi.getProductInfoById(this.productInfo.id).then(response => {
        if (response.code === 0) {
          this.productInfo = response.data
          // 处理上传组件的图片列表
          var imgArray = this.productInfo.productImg.split(',')
          for (let i = 0; i < imgArray.length; i++) {
            var imgUrl = imgArray[i]
            if (imgUrl !== '') {
              this.fileList.push({ url: imgUrl })
            }
          }
        }
      })
    },
    onSubmit() { // 提交修改
      console.log(this.productInfo.skuList)
      productInfoApi.updateProductCategory(this.productInfo.id, this.productInfo).then(respone => {
        if (respone.code === 0) {
          this.$message.success('修改成功')
          this.$router.push({ path: '/product-info/list' })
        }
      })
    },
    onCancel() {
      this.$router.push({ path: '/product-info/list' })
    },
    // 商品图片上传成功回调
    handleSuccess(file, fileList) {
      this.fileList.push({ url: file.data.url })
      this.productInfo.productImg = this.productInfo.productImg + file.data.url + ','
    },
    // 商品图片列表移除回调
    handleRemove(file) {
      console.log(file.url)
      // 处理上传组件的图片列表
      var imgArray = this.productInfo.productImg.split(',')
      // 新的图片url信息
      var newImg = ''
      for (let i = 0; i < imgArray.length; i++) {
        var imgUrl = imgArray[i]
        console.log('blob:' + imgUrl)
        if (imgUrl !== file.url && imgUrl !== '') {
          newImg = newImg + imgUrl + ','
        }
      }
      this.productInfo.productImg = newImg
    },
    handleServiceChange() {

    },
    addOrUpdateSku() { // 添加/修改SKU信息
      if (this.sku.index === -1) {
      // 添加SKU
        this.productInfo.skuList.push(this.sku)
        this.$message.success('添加成功')
      } else {
      // 修改SKU
        this.$set(this.productInfo.skuList, this.sku.index, this.sku)
        this.$message.success('修改成功')
      }
      // 关闭文本框
      this.dialogFormVisible = false
    },
    submitUpload() { // 上传SKU图片
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) { // SKU图片上传成功回调
      this.$message.success('文件上传成功')
      this.sku.picture = response.data.url
    },
    fileUploadError() {
      this.$message.error('文件上传失败')
    },
    handleEdit(index, row) { // 编辑SKU信息
      this.sku = this.productInfo.skuList[index]
      this.sku.index = index
      this.dialogFormVisible = true
    },
    handleDelete(index, row) { // 删除SKU信息
      this.productInfo.skuList.splice(index, 1)
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

<style scoped>
  .line {
    text-align: center;
  }
</style>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.picture {
    width: 100px;
    height: auto;
  }
</style>
