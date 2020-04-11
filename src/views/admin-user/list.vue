<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95" prop="id"/>
      <el-table-column label="账号" prop="account"/>
      <el-table-column label="昵称" prop="nickname"/>
      <el-table-column label="账号状态" prop="dataStatus"/>
      <el-table-column label="权限Id" prop="roleId"/>
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <span><img class="avatar" :src="scope.row.avatar"></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.$index)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.$index)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { del, getList } from '@/api/admin-user'
import DateUtil from '../../utils/DateUtil'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      pagination: {
        p: 1,
        size: 10,
        total: 0,
        order: 'id desc'
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    loadList() {
      this.loading = true
      getList(this.pagination.p, this.pagination.size).then(res => {
        const data = res.data
        this.pagination.total = data.total
        this.list = data.records
        this.loading = false
      }).catch(err => {
        console.err(err)
        this.loading = false
      })
    },
    edit(index) {
      const data = this.list[index]
      this.$router.push({ path: '/admin-user/edit/' + data.id })
    },
    del(index) {
      const data = this.list[index]
      del(data.id).then(res => {
        this.$message.success('删除成功')
        this.list.splice(index, 1)
      }).catch(err => {
        this.$message.error('删除失败:' + err)
      })
    },
    timeFormatter(row) {
      return DateUtil.format(row.createTime)
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
