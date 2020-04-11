<template>
  <div class="app-container">

    <el-form ref="adminUserForm" :model="data" :rules="formRules" label-width="120px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="data.account" disabled="true" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="data.nickname" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="data.avatar" />
      </el-form-item>
      <el-form-item label="账号状态" prop="dataStatus">
        <el-select v-model="data.dataStatus" placeholder="选择账号状态">
          <el-option v-for="status in dataStatusList" :label="status.label" :value="status.value" />
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
import { getInfo, update } from '@/api/admin-user'

export default {
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
    return {
      data: {
        id: 0,
        account: '',
        nickname: '',
        avatar: '',
        roleId: 0,
        loginPwd: '',
        dataStatus: 0,
        createTime: 0
      },
      formRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        nickname: [{ required: true, trigger: 'blur', message: '昵称不能为空' }]
      },
      dataStatusList: [
        { value: 1, label: '待审核' },
        { value: 2, label: '正常' },
        { value: 3, label: '删除' },
        { value: 4, label: '禁用' },
        { value: 5, label: '停用' },
        { value: 6, label: '冻结' }
      ]
    }
  },
  mounted() {
    const params = this.$route.params
    this.data.id = params.id
    this.loadInfo()
  },
  methods: {
    loadInfo() {
      if (this.data.id > 0) {
        getInfo(this.data.id).then(res => {
          this.data = res.data
        }).catch(err => {
          this.$message.error('获取管理员信息失败:' + err)
        })
      }
    },
    onSubmit() {
      this.$refs.adminUserForm.validate((valid) => {
        if (valid) {
          update(this.data).then(res => {
            this.$message.success('更新管理员成功')
            this.$router.push({ path: '/admin-user/list' })
          }).catch(err => {
            this.$message.error('更新管理员失败:' + err)
          })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ path: '/admin-user/list' })
    }
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

