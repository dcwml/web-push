
(function () {

'use strict'

var ajax = function (url, data, method, done, fail, always) {
  method = method || 'POST'
  var xhr
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xhr = new window.XMLHttpRequest()
  } else { // code for IE6, IE5
    xhr = new window.ActiveXObject("Microsoft.XMLHTTP") // Msxml2.XMLHTTP
  }
  xhr.open(method, url)
  // xhr.setRequestHeader()
  xhr.onerror = function (err) {
    // xhr.abort()
    // console.log('onerror')
    // console.log(err)
    // fail && fail(err)
    // always && always()
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        done && done(xhr.responseText)
        always && always()
      } else {
        fail && fail(new Error('request fail with status code ' + xhr.status))
        always && always()
      }
    }
  }
  xhr.timeout = 30000
  if (method.toUpperCase() === 'POST') {
    xhr.send(data)
  } else {
    xhr.send()
  }
}

var pushClient = {
  isPosting: false,
  list: [],
  url: '',
  callback: function () {}
}

pushClient.init = function (cnf) {
  pushClient.url = cnf.url
  pushClient.callback = cnf.callback || pushClient.callback
}

pushClient.start = function () {
  var fn = function () {
    if (pushClient.isPosting) {
      return
    }
    pushClient.isPosting = true
    ajax(pushClient.url, '', 'POST', function (responseText) {
      // done
      pushClient.callback(responseText)
    }, function (err) {
      // fail
    }, function () {
      // always
      pushClient.isPosting = false
      fn()
    })
  }
  fn()
}

pushClient.sub = function (topic, fn) {
  pushClient.list.push({
    topic: topic,
    fn: fn
  })
}

window.pushClient = pushClient

})()
