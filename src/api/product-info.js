import request from '@/utils/request'

const api_name = '/product/info'

export default {

  getList(page, limit, searchObj) { // 获取商品详情列表
    return request({
      url: `${api_name}` + `/${page}` + `/${limit}`,
      method: 'GET',
      params: searchObj
    })
  },

  addProductInfo(productInfo) { // 添加商品
    return request({
      url: `${api_name}`,
      method: 'POST',
      data: productInfo
    })
  },

  getProductInfoById(id) { // 根据id获取商品详情信息
    return request({
      url: `${api_name}` + `/` + id,
      method: 'GET'
    })
  },

  updateProductCategory(id, productInfo) { // 修改商品信息
    return request({
      url: `${api_name}` + `/` + id,
      method: 'PUT',
      data: productInfo
    })
  },

  deleteProductInfo(id) { // 删除商品
    return request({
      url: `${api_name}` + `/` + id,
      method: 'DELETE'
    })
  }

}
