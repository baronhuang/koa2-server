function uploadFile(){
  var formData = new FormData($("#frmUploadFile")[0]);
  console.log(444, formData)
  $.ajax({
    url: 'api/users/avatar?userId=t3r6FiYgI8YDE0oZ',
    type: 'POST',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function(data){
      if(200 === data.statusCode) {
        $("#imgShow").attr('src', data.url);
        $("#spanMessage").html("上传成功");
      } else {
        $("#spanMessage").html("上传失败");
      }
      console.log('imgUploader upload success, data:', data);
    },
    error: function(){
      $("#spanMessage").html("与服务器通信发生错误");
    }
  });
}