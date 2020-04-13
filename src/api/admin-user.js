import request from '@/utils/request'

export function getList(page, pageSize, name) {
  const url = '/user/' + page + '/' + pageSize + '?nickname=' + name
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

export function update(data) {
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

export function forbid(id) {
  const url = '/user/' + id + '/loginPermit'
  return request({
    url: url,
    method: 'delete'
  })
}
