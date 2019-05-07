
import http from '@/config/encsubmit'

export const goodsGet = (data) => {
  return new Promise((resolve) => {
    http.DataEncSubmit('goods_get.php', data, resp => {
      resolve(resp)
    })
  })
}
