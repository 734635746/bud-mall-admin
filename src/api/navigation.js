import request from '@/utils/request'

const api_name = '/navigation'

export default {

  getList() { // 获取导航列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET'
    })
  },

  remove(id) { // 删除导航信息
    return request({
      url: `${api_name}/` + id,
      method: 'DELETE'
    })
  },

  saveCategoryNavigation(categoryNavigation) { // 添加分类导航
    return request({
      url: `${api_name}/ofCategory`,
      method: 'POST',
      data: categoryNavigation
    })
  },

  updateCategoryNavigation(categoryNavigation) { // 修改分类导航
    return request({
      url: `${api_name}/ofCategory/` + categoryNavigation.id,
      method: 'PUT',
      data: categoryNavigation
    })
  }

}
