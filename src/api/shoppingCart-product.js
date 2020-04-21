import request from '@/utils/request'

const api_name = '/shoppingCart/product'

export default {

  getList(mobile) { // 获取指定手机号用户购物车商品列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET',
      params: { mobile: mobile }
    })
  },

  remove(id) { // 删除购物车商品信息
    return request({
      url: `${api_name}/` + id,
      method: 'DELETE'
    })
  }

}
