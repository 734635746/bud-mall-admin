import request from '@/utils/request'

const api_name = '/product/brand'

export default {

  getList() { // 获取商品品牌列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET'
    })
  }

}
