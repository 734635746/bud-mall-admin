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

      <el-form-item label="商品规格" prop="skuList">

        <el-select v-model="currentSpecId" placeholder="请选择商品规格">
          <el-option
            v-for="spec in productSpecList"
            ref="specOption"
            :key="spec.id"
            :label="spec.specName"
            :value="spec.id"
          />
        </el-select>

        <el-button type="success" @click="addSpec()">添加</el-button>

        <template v-if="skuSpecList.length!==0">
          <el-table
            :data="skuSpecList"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="specName" label="商品规格" align="center" />
            <el-table-column prop="specName" label="删除" align="center">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="small" @click="delSpec(scope.row.id)" />
              </template>
            </el-table-column>
          </el-table>
        </template>

        <template v-if="productInfo.skuList.length!==0">
          <el-divider content-position="center" class="skuDivier">商品规格列表</el-divider>
          <el-table
            :data="productInfo.skuList"
            stripe
            style="width: 100%"
          >
            <!--遍历规格列-->
            <el-table-column label="规格" align="center">
              <el-table-column
                v-for="item in skuSpecList"
                :key="item.specId"
                align="center"
                :label="item.specName"
              >
                <template slot-scope="scope">
                  <span>{{ getSpecValueName(scope.row.skuSpecValueList,item.id) }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column label="商品价格" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" />
              </template>
            </el-table-column>
            <el-table-column label="商品原价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.originPrice" />
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock" />
              </template>
            </el-table-column>
            <!-- <el-form-item label="SKU图片">

              <el-upload
                ref="upload"
                class="upload-demo"
                action="admapi/file"
                :headers="headers"
                :limit="1"
                :on-success="fileUploadSuccess"
                :on-error="fileUploadError"
              >
                <el-button slot="trigger" size="small" type="primary">选择图片</el-button>

              </el-upload>
            </el-form-item> -->

          </el-table>
        </template>

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
import productSpecApi from '@/api/product-spec'
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
      productBrandList: [], // 商品品牌列表
      productServiceList: [], // 商品服务列表
      productCategoryList: [], // 商品分类列表
      productSpecList: [], // 商品规格列表
      skuSpecList: [], // 当前商品的sku规格列表
      skuSpecIdList: [], // 当前商品的sku规格的id列表
      specMap: {}, // specId:spec对象
      specValueMap: {}, // specId:specValueList
      currentSpecId: '', // 当前选定的规格Id
      serviceIds: [], // 商品服务id
      fileList: [], // 商品图片列表
      // 表单校验
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }]
      },
      headers: { authToken: getToken() }
    }
  },
  watch: {
    // dialogFormVisible(val) {
    //   if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
    //     // 刷新catagory数据
    //     this.sku = {// sku临时对象
    //       index: -1,
    //       id: 0,
    //       productId: 0,
    //       skuName: '',
    //       price: 0,
    //       originPrice: 0,
    //       stock: 0,
    //       picture: ''
    //     }
    //     // 清除文件上传控件的文件列表
    //     this.$refs.upload.clearFiles()
    //   }
    // },
    skuSpecList: {// 当sku规格列表变化时，更新sku规格id列表
      handler: function() {
        var skuSpecIdList = []
        for (let i = 0; i < this.skuSpecList.length; i++) {
          skuSpecIdList.push(this.skuSpecList[i].id)
        }
        this.skuSpecIdList = skuSpecIdList
      },
      immediate: true
      // deep: true
    },
    productSpecList: {// 商品规格初始化完成后
      handler: function() {
        // 初始化skuSpecList
        this.initSkuSpecList()
        // 初始化specValueMap
        this.initSpecValueMap()
      }
    }
  },
  created() {
    productBrandApi.getList().then(respone => { // 获取商品品牌列表
      this.productBrandList = respone.data
    })
    productCategoryApi.getList().then(response => { // 获取商品分类列表
      this.productCategoryList = this.getTreeData(response.data)
    })
    productServiceApi.getList().then(response => { // 获取商品服务列表
      this.productServiceList = response.data
    })
    productSpecApi.getList().then(response => { // 获取sku规格列表
      this.productSpecList = response.data
    })
  },
  mounted() {
    const params = this.$route.params
    if (params.id !== undefined) { // id不是未定义则此次操作是修改操作
      this.productInfo.id = params.id
      // 加载商品信息
      this.loadProductInfo()
    }
  },
  methods: {
    // 加载商品信息
    loadProductInfo() {
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
          // 处理商品的skuList列表
          this.loadSkuList()
        }
      })
    },
    // 提交
    onSubmit() {
      console.log(this.productInfo)
      if (this.productInfo.id === 0) { // 添加操作
        productInfoApi.addProductInfo(this.productInfo).then(response => {
          this.$message.success('添加成功')
          this.$router.push({ path: '/product-info/list' })
        })
      } else {
        productInfoApi.updateProductCategory(this.productInfo.id, this.productInfo).then(respone => {
          if (respone.code === 0) {
            this.$message.success('修改成功')
            this.$router.push({ path: '/product-info/list' })
          }
        })
      }
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
    // SKU图片上传成功回调
    fileUploadSuccess(response) {
      this.$message.success('文件上传成功')
      this.sku.picture = response.data.url
    },
    fileUploadError() {
      this.$message.error('文件上传失败')
    },
    // 处理分类列表子类为空数组的问题
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
    },
    // 添加规格属性
    addSpec() {
      if (this.currentSpecId === '') {
        this.$message.info('请先选择规格')
      } else { // 添加
        if (this.skuSpecIdList.indexOf(this.currentSpecId) === -1) { // 判断当前规格是否已经添加
          for (let i = 0; i < this.productSpecList.length; i++) {
            // 获取Spec信息
            if (this.currentSpecId === this.productSpecList[i].id) {
              var skuSpec = this.productSpecList[i]
              // 更新当前商品的规格列表
              this.skuSpecList.push({ id: skuSpec.id, specName: skuSpec.specName })
              break
            }
          }
          this.$nextTick(() => {
            // 更新商品的skuList
            this.refreshSkuList()
          })
        }
      }
    },
    // 删除规格属性
    delSpec(specId) {
      for (let i = 0; i < this.skuSpecList.length; i++) {
        if (this.skuSpecList[i].id === specId) {
          this.skuSpecList.splice(i, 1)
          break
        }
      }
      this.$nextTick(() => {
        // 更新商品的skuList
        this.refreshSkuList()
      })
    },
    refreshSkuList() { // 刷新商品的skuList
      var skuList = []
      var arr = []
      // 根据specid列表，将对应的属性值对象加入列表

      for (let i = 0; i < this.skuSpecIdList.length; i++) {
        arr.push(this.specValueMap[this.skuSpecIdList[i]])
      }
      // 对规格属性信息组合排序
      var _specList = this.doExchange(arr)
      // console.log(_specList)

      // 生成skuList
      if (_specList) {
        for (let i = 0; i < _specList.length; i++) {
          var specList = _specList[i]
          var sku = {
            id: 0,
            productId: this.productInfo.id,
            skuName: '',
            price: 0,
            originPrice: 0,
            stock: 0,
            picture: '',
            attrValueItems: ''
          }
          var nameArr = []
          var attrValueArr = []
          if (specList instanceof Array) {
            for (let j = 0; j < specList.length; j++) {
              nameArr.push(specList[j].specValueName)
              attrValueArr.push(specList[j].specId + ':' + specList[j].id)
            }
          } else {
            nameArr.push(specList.specValueName)
            attrValueArr.push(specList.specId + ':' + specList.id)
          }
          sku.skuName = nameArr.join(' ')
          sku.attrValueItems = attrValueArr.join(';')
          // 将生成的sku加入商品的skuList
          skuList.push(sku)
        }
      }
      // 处理skuList
      this.productInfo.skuList = this.handleSkuList(skuList)
    },
    doExchange(arr) { // 执行规格属性的组合排列
      var len = arr.length
      if (len >= 2) {
        // 第一个数组的长度
        var len1 = arr[0].length
        // 第二个数组的长度
        var len2 = arr[1].length
        // 两个规格产生的组合数
        var lenBoth = len1 * len2
        // 申明一个数组，做数据暂存
        var itmes = new Array(lenBoth)
        // 申明新数组的索引
        var index = 0
        // 将两个属性的组合放到新数组中
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            itmes[index] = [].concat(arr[0][i]).concat(arr[1][j])
            index++
          }
        }
        // 将新组合的数组并到原来的数组
        var newArr = new Array(len - 1)
        for (let i = 2; i < arr.length; i++) {
          newArr[i - 1] = arr[i]
        }
        newArr[0] = itmes
        // 执行回调
        return this.doExchange(newArr)
      } else {
        return arr[0]
      }
    },
    // 对生成的skuList进行必要的校验和处理
    handleSkuList(skuList) {
      if (!skuList) { return [] }
      var _skuList = []
      var time = new Date().getTime()
      for (let i = 0; i < skuList.length; i++) {
        var sku = skuList[i]
        var attrValueNameList = sku.skuName.trim().split(' ')
        var attrValueIdsList = sku.attrValueItems.split(';')
        if (attrValueNameList.length !== attrValueIdsList.length) {
          throw 'sku配置错误'
        }
        var skuSpecValueList = []
        for (let j = 0; j < attrValueNameList.length; j++) {
          var specValue = {}
          specValue.specValueName = attrValueNameList[j]
          var specIdList = attrValueIdsList[j].split(':')
          specValue.specId = parseInt(specIdList[0])
          specValue.specValueId = parseInt(specIdList[1])
          skuSpecValueList.push(specValue)
        }
        // 排序
        skuSpecValueList.sort(function(a, b) {
          return a.specId - b.specId
        })
        sku.skuSpecValueList = skuSpecValueList
        // 作为唯一id，用于解决vue刷新for循环默认模式的问题
        sku._time = time + i
        _skuList.push(sku)
      }
      return _skuList
    },
    // 根据specId获取specValueName
    getSpecValueName(skuSpecValueList, specId) {
      var sku = skuSpecValueList.filter(item => {
        return item.specId === specId
      })
      return sku[0].specValueName
    },
    // 加载并处理商品的skuList
    loadSkuList() {
      // 处理skuList
      var _skuList = this.productInfo.skuList
      var skuList = this.handleSkuList(_skuList)
      this.productInfo.skuList = skuList
    },
    // 初始化skuSpecList
    initSkuSpecList() {
      var specMap = {}
      for (let i = 0; i < this.productSpecList.length; i++) {
        var spec = this.productSpecList[i]
        specMap[spec.id] = spec.specName
      }
      this.specMap = specMap

      if (this.productInfo.skuList.length > 0) {
        var sku = this.productInfo.skuList[0]
        for (let j = 0; j < sku.skuSpecValueList.length; j++) {
          var specValue = sku.skuSpecValueList[j]
          this.skuSpecList.push({ id: specValue.specId, specName: specMap[specValue.specId] })
        }
      }
    },
    // 初始化specValueMap
    initSpecValueMap() {
      for (let j = 0; j < this.productSpecList.length; j++) {
        var spec = this.productSpecList[j]
        this.specValueMap[spec.id] = spec.values
      }
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
  .skuDivier{
    margin-top: 60px;
    font-size:14px;
    font-weight:800;
  }
</style>
