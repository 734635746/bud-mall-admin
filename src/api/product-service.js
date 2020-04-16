import request from '@/utils/request'

const api_name = '/product/service'

export default {

  getList() { // 获取商品服务列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET'
    })
  }

}
