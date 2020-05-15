import request from '@/utils/request'

const api_name = '/product/spec'

export default {

  getList() { // 获取规格列表
    return request({
      url: `${api_name}` + '/list',
      method: 'GET'
    })
  },

  saveProductSpec(productSpec) { // 添加商品规格
    return request({
      url: `${api_name}`,
      method: 'POST',
      data: productSpec
    })
  },

  updateProductSpec(productSpec) { // 修改商品规格
    return request({
      url: `${api_name}/` + productSpec.id,
      method: 'PUT',
      data: productSpec
    })
  },

  saveProductSpecValue(productSpecValue) { // 添加商品规格属性值
    return request({
      url: `${api_name}` + '/value',
      method: 'POST',
      data: productSpecValue
    })
  },

  updateProductSpecValue(productSpecValue) { // 修改商品规格属性值
    return request({
      url: `${api_name}` + '/value/' + productSpecValue.id,
      method: 'PUT',
      data: productSpecValue
    })
  },

  removeProductSpec(id) { // 删除规格
    return request({
      url: `${api_name}/` + id,
      method: 'DELETE'
    })
  },
  removeProductSpecValue(id) { // 删除规格属性值
    return request({
      url: `${api_name}` + '/value/' + id,
      method: 'DELETE'
    })
  }

}
