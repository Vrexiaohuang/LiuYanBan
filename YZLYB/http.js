//https://liuyanbanapi.magicbox.top/API/
  function post(apiUrl, params, yes, error) {
  wx.request({
    method: 'POST',
    url: 'http://localhost:44329/API/' + apiUrl,
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    data: params,
    success: yes,
    fail: error
  })
}

module.exports = {
  post:post
}
