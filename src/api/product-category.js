import request from '@/utils/request'

const api_name = '/product/category'

export default {

  getList() { // 获取商品分类列表列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET'
    })
  },
  addProductCategory(productCategory) { // 添加商品分类
    return request({
      url: `${api_name}`,
      method: 'POST',
      data: productCategory
    })
  }

}
