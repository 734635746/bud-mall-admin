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

export function del(id) {
  const url = '/user/' + id
  return request({
    url: url,
    method: 'delete'
  })
}
