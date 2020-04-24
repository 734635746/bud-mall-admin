<template>
  <div class="app-container">

    <el-form :inline="true" class="demo-form-inline" style="margin-bottom:20px">
      <el-button type="primary" icon="el-icon-plus" @click="pBannerDialogVisible=true">添加商品横幅</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="oBannerDialogVisible=true">添加外链横幅</el-button>
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
      <el-table-column label="横幅标题" prop="title" />
      <el-table-column label="横幅类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="success">外链横幅</el-tag>
          <el-tag v-if="scope.row.type==0" type="primary">商品横幅</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="横幅图片" width="110" align="center">
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
    <el-dialog :visible.sync="pBannerDialogVisible" title="添加商品横幅">
      <el-form :model="banner" label-width="120px">
        <el-form-item label="横幅标题">
          <el-input v-model="banner.title" />
        </el-form-item>

        <el-form-item label="横幅图片">
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

        <el-form-item label="商品id">
          <el-input v-model="banner.productId" />
        </el-form-item>
        <el-form-item label="商品skuId">
          <el-input v-model="banner.skuId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{pBannerDialogVisible = false}">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateProductBanner()">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加/修改外链横幅文本框-->
    <el-dialog :visible.sync="oBannerDialogVisible" title="添加/修改外链横幅">
      <el-form :model="banner" label-width="120px">
        <el-form-item label="横幅标题">
          <el-input v-model="banner.title" />
        </el-form-item>

        <el-form-item label="横幅图片">
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

        <el-form-item label="外链">
          <el-input v-model="banner.outerChain" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{oBannerDialogVisible = false}">取 消</el-button>
        <el-button type="primary" @click="saveOrupdateOuterChainBanner()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>
<script>
import bannerApi from '@/api/banner'
import { getToken } from '@/utils/auth'

const defaultBanner = {
  index: -1,
  id: 0,
  title: '',
  image: '',
  productId: 0, // 类型商品时有效
  skuId: 0, // 类型商品时有效
  outerChain: '', // 类型外链时有效
  position: 1 // 第一处横幅
}

export default {
  data() {
    return {
      list: [], // 横幅列表
      loading: false,
      headers: { 'authToken': getToken() },
      banner: {
        index: -1, // 下标位置，修改时通过此标志进行判断
        id: 0,
        title: '',
        image: '',
        productId: 0, // 类型商品时有效
        skuId: 0, // 类型商品时有效
        outerChain: '', // 类型外链时有效
        position: 1 // 第一处横幅
      },
      pBannerDialogVisible: false,
      oBannerDialogVisible: false
    }
  },
  watch: {
    pBannerDialogVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新banner数据
        this.banner = { ...defaultBanner }
        // 清除文件上传控件的文件列表
        this.$refs.upload.clearFiles()
        this.loadList()
      }
    },
    oBannerDialogVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新banner数据
        this.banner = { ...defaultBanner }
        // 清除文件上传控件的文件列表
        this.$refs.upload.clearFiles()
        this.loadList()
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    loadList() { // 拉取列表
      bannerApi.getListByPosition(1).then(response => {
        this.list = response.data
      })
    },
    del(index) { // 删除横幅数据
      const data = this.list[index]
      bannerApi.remove(data.id).then(response => {
        this.$message.success('删除成功')
        this.loadList()
      })
    },
    saveProductBanner() { // 添加商品横幅
      bannerApi.saveProductBanner(this.banner).then(response => {
        this.$message.success('添加成功')
        this.pBannerDialogVisible = false
        this.loadList()
      })
    },
    saveOrUpdateProductBanner() { // 或者添加商品横幅
      if (this.banner.index === -1) {
        bannerApi.saveProductBanner(this.banner).then(response => {
          this.$message.success('添加成功')
          this.pBannerDialogVisible = false
          this.loadList()
        })
      } else {
        bannerApi.updateProductBanner(this.banner.id, this.banner).then(response => {
          this.$message.success('修改成功')
          this.pBannerDialogVisible = false
          this.loadList()
        })
      }
    },
    saveOrupdateOuterChainBanner() { // 或者添加外链横幅
      if (this.banner.index === -1) {
        bannerApi.saveOuterChainBanner(this.banner).then(response => {
          this.$message.success('添加成功')
          this.oBannerDialogVisible = false
          this.loadList()
        })
      } else {
        bannerApi.updateOuterChainBanner(this.banner.id, this.banner).then(response => {
          this.$message.success('修改成功')
          this.oBannerDialogVisible = false
          this.loadList()
        })
      }
    },
    edit(index) { // 编辑横幅信息
      const data = this.list[index]
      this.banner.index = index
      if (data.type === 0) { // 商品类型
        var productbanner = JSON.parse(JSON.stringify(data))
        var productUrl = productbanner.content
        var productId = productUrl.substring(productUrl.lastIndexOf('/') + 1, productUrl.lastIndexOf('?'))
        var skuId = productUrl.substring(productUrl.lastIndexOf('=') + 1)
        this.banner.id = productbanner.id
        this.banner.productId = productId
        this.banner.skuId = skuId
        this.banner.title = productbanner.title
        this.banner.image = productbanner.image
        this.banner.position = 1

        this.pBannerDialogVisible = true
      } else if (data.type === 1) { // 外链类型
        var oldbanner = JSON.parse(JSON.stringify(data))
        this.banner.id = oldbanner.id
        this.banner.title = oldbanner.title
        this.banner.image = oldbanner.image
        this.banner.outerChain = oldbanner.content
        this.banner.position = 1

        this.oBannerDialogVisible = true
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
      this.banner.image = response.data.url
    },
    fileUploadError() {
      this.$message.error('文件上传失败')
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
