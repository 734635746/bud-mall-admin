import request from '@/utils/request'

export function getList(page, pageSize) {
  const url = '/user/' + page + '/' + pageSize
  return request({
    url: url,
    method: 'get'
  })
}

export function getInfo(id) {
  const url = '/user/' + id
  return request({
    url: url,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function update(param) {
  const data = { adminUser: param }
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function del(id) {
  const url = '/user/' + id
  return request({
    url: url,
    method: 'delete'
  })
}
