import request from '@/utils/request'

const api_name = '/product/info'

export default {

  getList(page, limit, searchObj) { // 获取商品详情列表
    return request({
      url: `${api_name}` + `/${page}` + `/${limit}`,
      method: 'GET',
      params: searchObj
    })
  }

}