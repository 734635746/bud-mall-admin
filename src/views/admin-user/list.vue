<template>
  <div class="app-container">

    <!--条件查询-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="管理员昵称" />
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
      <el-table-column align="center" label="ID" width="95" prop="id" />
      <el-table-column label="账号" prop="account" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="账号状态" prop="dataStatus" />
      <el-table-column label="权限Id" prop="roleId" />
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <span><img class="avatar" :src="scope.row.avatar"></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.$index)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.$index)">删除</el-button>
          <el-button type="text" size="small" @click="forbid(scope.$index)">禁止登陆</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="pagination.p"
      :page-size="pagination.size"
      :total="pagination.total"
      :pager-count="7"
      background
      style="margin-top:20px; padding:50px 0; text-align:center"
      layout="total, prev, pager, next, jumper"
      @current-change="loadList"
    />
  </div>
</template>

<script>
import { del, getList, forbid } from '@/api/admin-user'
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
        p: 1, // 页码
        size: 4, // 每页记录数
        total: 0, // 总记录数
        order: 'id desc'
      },
      searchObj: { name: '' }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    loadList(page = 1) {
      this.pagination.p = page
      this.loading = true
      getList(this.pagination.p, this.pagination.size, this.searchObj.name).then(res => {
        const data = res.data
        this.pagination.total = data.total
        this.list = data.records
        this.loading = false
      }).catch(err => {
        console.err(err)
        this.loading = false
      })
    },
    forbid(index) {
      const data = this.list[index]

      this.$confirm('确定禁止该管理员登陆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return forbid(data.id)
      }).then(() => { // 上一个then成功则返回这里
        this.loadList()// 刷新页面
        this.$message.success('禁止该管理员登陆成功')
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message.info('已取消操作')
        }
      })
    },
    edit(index) {
      const data = this.list[index]
      this.$router.push({ path: '/admin-user/edit/' + data.id })
    },
    del(index) {
      const data = this.list[index]

      this.$confirm('确定删除该管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return del(data.id)
      }).then(() => { // 上一个then成功则返回这里
        this.list.splice(index, 1)
        this.loadList()// 刷新页面
        this.$message.success('删除成功')
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message.info('已取消删除')
        }
      })
    },
    timeFormatter(row) {
      return DateUtil.format(row.createTime)
    },
    resetData() { // 清空
      this.searchObj = { name: '' }
      this.loadList()
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
