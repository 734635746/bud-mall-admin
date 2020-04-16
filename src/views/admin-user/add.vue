<template>
  <div class="app-container">
    <el-form ref="adminUserForm" :model="data" :rules="formRules" label-width="120px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="data.account" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="data.nickname" />
      </el-form-item>
      <el-form-item label="密码" prop="loginPwd">
        <el-input v-model="data.loginPwd" />
      </el-form-item>
      <el-form-item label="头像">
        <!--头像缩略图-->
        <pan-thumb :image="data. avatar" />
        <!--文件上传按钮-->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          上传头像
        </el-button>
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          :max-size="2048"
          :url="'/file'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item label="账号状态" prop="dataStatus">
        <el-select v-model="data.dataStatus" placeholder="选择账号状态">
          <el-option v-for="status in dataStatusList" :key="status.label" :label="status.label" :value="status.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="roleId" prop="roleId">
        <el-input v-model="data.roleId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from '@/api/admin-user'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: {
    ImageCropper, PanThumb
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      const regex = /^[A-Za-z0-9]{4,20}$/g
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (!regex.test(value)) {
          callback(new Error('账号只能由字母、数字构成,最少4位最高20位！'))
        }
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const regex = /^[A-Za-z0-9$@#%^&]{6,20}$/g
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!regex.test(value)) {
          callback(new Error('密码只能由字母、数字、$、@、#、%、^、&构成,最少6位最高20位！'))
        }
        callback()
      }
    }
    return {
      data: {
        id: 0,
        account: '',
        nickname: '',
        loginPwd: '',
        avatar: '',
        roleId: 0,
        dataStatus: 0,
        createTime: 0
      },
      formRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        nickname: [{ required: true, trigger: 'blur', message: '昵称不能为空' }],
        loginPwd: [{ validator: validatePassword, trigger: 'blur' }]
      },
      dataStatusList: [
        { value: 1, label: '待审核' },
        { value: 2, label: '正常' },
        { value: 3, label: '删除' },
        { value: 4, label: '禁用' },
        { value: 5, label: '停用' },
        { value: 6, label: '冻结' }
      ],
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0
    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      this.$refs.adminUserForm.validate((valid) => {
        if (valid) {
          add(this.data).then(res => {
            this.$message.success('添加管理员成功')
            this.$router.push({ path: '/admin-user/list' })
          }).catch(err => {
            this.$message.error('新增管理员失败:' + err)
          })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ path: '/admin-user/list' })
    },
    // 上传文件成功的回调
    cropSuccess(data) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1

      // 获取后端服务器的返回值
      this.data.avatar = data.url
    },

    // 关闭文件上传组件
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

