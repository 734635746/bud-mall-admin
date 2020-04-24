import request from '@/utils/request'

const api_name = '/banner'

export default {

  getListByPosition(position) { // 获取指定位置的横幅列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET',
      params: { position: position }
    })
  },

  remove(id) { // 删除横幅信息
    return request({
      url: `${api_name}/` + id,
      method: 'DELETE'
    })
  },

  saveProductBanner(banner) { // 添加商品横幅
    return request({
      url: `${api_name}/ofProduct`,
      method: 'POST',
      data: banner
    })
  },

  saveOuterChainBanner(banner) { // 添加外链横幅
    return request({
      url: `${api_name}/ofOuterChain`,
      method: 'POST',
      data: banner
    })
  },

  updateOuterChainBanner(id, banner) { // 修改外链横幅
    return request({
      url: `${api_name}/ofOuterChain/${id}`,
      method: 'PUT',
      data: banner
    })
  },

  updateProductBanner(id, banner) { // 修改商品横幅
    return request({
      url: `${api_name}/ofProduct/${id}`,
      method: 'PUT',
      data: banner
    })
  }
}
