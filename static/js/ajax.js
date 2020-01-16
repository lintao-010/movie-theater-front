/**
options = {
  url: "",
  method: "",
  headers: {}, 
  data: "",
  success: function(result) {},  // 请求成功后调用此方法
  fail: function(error) {}    // 请求失败或出错后调用此方法
}
**/
window.ajax = function(options) {
  options = {
    url: options.url || "",
    method: options.method || "get",
    headers: options.headers || {},
    data: options.data || null,
    onSuccess: options.success || function(result) {},
    onFail: options.fail || function(result) {}
  };

  
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url, true);
  for (key in options.headers){
    xhr.setRequestHeader(key, options.headers[key]);
  }
  xhr.onreadystatechange = function() {
    // TODO 201 succeed
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 201) {
        options.onSuccess(xhr.responseText);
      } else {
        options.onFail(xhr.status);
      }
    }
  };
  xhr.send(options.data);
};
