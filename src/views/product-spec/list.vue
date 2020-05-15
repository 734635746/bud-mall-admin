<template>
  <div class="app-container">

    <el-input v-model="filterText" placeholder="输入商品规格名称进行筛选" style="margin-bottom:30px;" />

    <el-button type="text" @click="specDialogVisible=true">添加商品规格</el-button>

    <el-tree
      ref="specTree"
      :data="specList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      node-key="id"
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node , data}" class="custom-tree-node">

        <i :class="node.level==1?&quot;el-icon-s-tools&quot;:&quot;el-icon-setting&quot;" />
        <span>{{ node.label }}</span>

        <span>
          <el-button
            v-if="node.level==1"
            type="text"
            size="mini"
            @click="()=>{specValueDialogVisible=true,productSpecValue.specId=data.id}"
          >
            添加商品规格属性值
          </el-button>

          <el-button
            v-if="node.level==1"
            type="text"
            size="mini"
            @click="()=>{specDialogVisible=true,PaddingSpec(data)}"
          >
            修改
          </el-button>
          <el-button
            v-if="node.level==2"
            type="text"
            size="mini"
            @click="()=>{specValueDialogVisible=true,PaddingSpecValue(data)}"
          >
            修改
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="remove(data,node.level)"
          >
            删除
          </el-button>

        </span>
      </span>
    </el-tree>

    <!--添加/修改商品规格的文本框-->
    <el-dialog :visible.sync="specDialogVisible" title="添加/修改商品规格">
      <el-form :model="productSpec" label-width="120px" :rules="formRules">
        <el-form-item label="规格名称" prop="specName">
          <el-input v-model="productSpec.specName" />
        </el-form-item>
        <el-form-item label="是否可视">
          <el-switch
            v-model="productSpec.isVisible"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input v-model="productSpec.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{specDialogVisible = false}">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateProductSpec()">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加/修改商品规格属性值的文本框-->
    <el-dialog :visible.sync="specValueDialogVisible" title="添加/修改商品规格属性值">
      <el-form :model="productSpecValue" label-width="120px" :rules="formRules2">
        <el-form-item label="规格属性值" prop="specValueName">
          <el-input v-model="productSpecValue.specValueName" />
        </el-form-item>
        <el-form-item label="是否可视">
          <el-switch
            v-model="productSpecValue.isVisible"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input v-model="productSpecValue.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{specValueDialogVisible = false}">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateProductSpecValue()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import productSpecApi from '@/api/product-spec'

const defaultProductSpec = {
  id: 0,
  specName: '',
  isVisible: 1,
  sort: 0
}
const defaultproductSpecValue = {
  id: 0,
  specValueName: '',
  specId: 0,
  isVisible: 1,
  sort: 0
}

export default {
  data() {
    return {
      defaultProps: {
        label: (data, node) => {
          if (node.level === 1) {
            return data.specName
          } else {
            return data.specValueName
          }
        },
        children: 'values'
      },
      filterText: '', // 过滤文本
      specList: [], // 规格列表
      productSpec: {// 商品规格
        id: 0,
        specName: '',
        isVisible: 1,
        sort: 0
      },
      productSpecValue: {// 商品规格属性值
        id: 0,
        specId: 0,
        specValueName: '',
        isVisible: 1,
        sort: 0
      },
      specDialogVisible: false,
      specValueDialogVisible: false,
      // 表单校验
      formRules: {
        specName: [{ required: true, trigger: 'blur', message: '规格名称不能为空' }]
      },
      formRules2: {
        specValueName: [{ required: true, trigger: 'blur', message: '规格属性值不能为空' }]
      }
    }
  },
  watch: {
    specDialogVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新catagory数据
        this.productSpec = { ...defaultProductSpec }
      }
    },
    specValueDialogVisible(val) {
      if (val === false) { // 监听文本框的状态，关闭文本框怎进行数据刷新
        // 刷新catagory数据
        this.productSpecValue = { ...defaultproductSpecValue }
      }
    },
    filterText(value) { // 监听filterText的变化
      this.$refs.specTree.filter(value)
    }
  },
  created() {
    // 创建页面的时候拉取远程数据
    this.fetchProductSpecList()
  },
  methods: {
    fetchProductSpecList() { // 获取规格列表
      productSpecApi.getList().then(response => {
        this.specList = response.data
      })
    },
    PaddingSpec(data) { // 获取并填充Spec数据
      this.productSpec = data
    },
    PaddingSpecValue(data) { // 获取并填充SpecValue数据
      this.productSpecValue = data
    },
    addOrUpdateProductSpec() {
      const spec = this.productSpec
      if (spec.id === 0) { // 添加
        productSpecApi.saveProductSpec(spec).then(response => {
          this.$message.success('添加成功')
          this.specDialogVisible = false
          this.fetchProductSpecList()
        })
      } else { // 修改
        productSpecApi.updateProductSpec(spec).then(response => {
          this.$message.success('修改成功')
          this.specDialogVisible = false
          this.fetchProductSpecList()
        })
      }
    },
    addOrUpdateProductSpecValue() {
      const specValue = this.productSpecValue

      if (specValue.id === 0) { // 添加
        productSpecApi.saveProductSpecValue(specValue).then(response => {
          this.$message.success('添加成功')
          this.specValueDialogVisible = false
          this.fetchProductSpecList()
        })
      } else { // 修改
        productSpecApi.updateProductSpecValue(specValue).then(response => {
          this.$message.success('修改成功')
          this.specValueDialogVisible = false
          this.fetchProductSpecList()
        })
      }
    },
    remove(data, level) {
      this.$confirm('确定删除该规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (level === 1) {
          return productSpecApi.removeProductSpec(data.id)
        } else {
          return productSpecApi.removeProductSpecValue(data.id)
        }
      }).then(() => { // 上一个then成功则返回这里
        this.fetchProductSpecList()// 刷新页面
        this.$message.success('删除成功')
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message.info('已取消删除')
        }
      })
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      if (data.specName === undefined) {
        return data.specValueName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
      return data.specName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>
