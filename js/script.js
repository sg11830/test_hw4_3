var accessToken = "";

window.fbAsyncInit = function () {
          FB.init({
          appId      : '257546967766722',
          xfbml      : true,
          version    : 'v2.0'
        });
      




            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {

                    var uid = response.authResponse.userID;
                    accessToken = response.authResponse.accessToken;
                   FB.api('/me/picture?type=normal', function(response) { // normal/large/squere 
                        var str="<img crossOrigin = 'Anonymous' id='preview1' src="+ response.data.url +">";
                        $('body').append(str);
                      });

                } else if (response.status === 'not_authorized') {
                    console.log("this user is not authorizied your apps");
                    FB.login(function (response) {
                        // FB.api('/me/feed', 'post', {message: 'I\'m started using FB API'});
                        if (response.authResponse) { // if user login to your apps right after handle an event
                            window.location.reload();
                        };
                    }, {
                        scope: 'user_about_me,email,user_location,user_photos,publish_actions,user_birthday,user_likes'
                    });
                } else {
                    console.log("this isn't logged in to Facebook.");
                    FB.login(function (response) {
                        if (response.authResponse) {
                            window.location.reload();
                        } else {
                            //alertify.alert('An Error has Occurs,Please Reload your Pages');
                        }
                    });
                }
            });
   



//以下為canvas的程式碼，基本上不需多動，依據comments修改即可
	
	//起始畫面
	var ctx = document.getElementById('canvas').getContext('2d'); //宣告變數找到頁面的canvas標籤的2d內容
	ctx.font='20px "Arial"'; //設定字體與大小
	ctx.fillText("Click here to start fill with Facebook Profile Picture", 40, 270); //設定預設的開始畫面
    var img = new Image(); // 新增圖像1
    img.src = "img/img_1.jpg"; //圖像路徑（路徑自己設，且自己加入想要的圖層）
	var img2 = new Image(); //新增圖像2
	img2.src = "img/img_2.jpg" //圖像路徑
	var img3 = new Image();//新增圖像3
	img3.src = "img/img_3.jpg"//圖像路徑
	
	

	//宣告基本變數
    var canvas=document.getElementById("canvas"); //宣告變數找到canvas標籤
    var ctx=canvas.getContext("2d"); //找到2d內容
    var canvasOffset=$("#canvas").offset();//找到offset
    var offsetX=canvasOffset.left;//左方
    var offsetY=canvasOffset.top;//上方
    var canvasWidth=canvas.width;//大小
    var canvasHeight=canvas.height;//高度
    var isDragging=false;//拖拉

    function handleMouseDown(e){//滑鼠按下的函數
      canMouseX=parseInt(e.clientX-offsetX);//抓滑鼠游標X
      canMouseY=parseInt(e.clientY-offsetY);//抓滑鼠游標y
      // set the drag flag
      isDragging=true;//宣告拖拉變數
    }

    function handleMouseUp(e){//滑鼠放掉的函數
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // clear the drag flag
      isDragging=false;
    }

    function handleMouseOut(e){//滑鼠移開的函數
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // user has left the canvas, so clear the drag flag
      //isDragging=false;
    }

    function handleMouseMove(e){//滑鼠移動的event
      canMouseX=parseInt(e.clientX-offsetX);
      canMouseY=parseInt(e.clientY-offsetY);
      // if the drag flag is set, clear the canvas and draw the image
      if(isDragging){ //當拖拉為True時
          	ctx.clearRect(0,0,canvasWidth,canvasHeight); //移除canvas起始的內容
			var profileIMG = document.getElementById("preview1");//抓html裡預載入的照片
			profileIMG.crossOrigin = "Anonymous"; // 這務必要做，為了讓Facebook的照片能夠crossdomain傳入到你的頁面，CORS Policy請參考https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image 
			//canvas.width = profileIMG.width;//設定canvas的大小需符合profileimg的大小
			//canvas.height = profileIMG.height;
			ctx.drawImage(img2,0,0); //劃入img2
      ctx.drawImage(img3,0,0); //劃入img3，並根據你的滑鼠游標移動，你可以自行更換想要移動的圖層，數值會因XY軸向有所不同
      ctx.drawImage(profileIMG,canMouseX-128/2,canMouseY-120/2);//從XY軸0，0值開始畫如profileimg
			
			var inputedText = $('#inputed').val();//抓取頁面inputed ID的內容
			ctx.fillStyle = "gray"; 
			ctx.font='30px "微軟正黑體"'; 
			ctx.fillText(inputedText, canMouseX-1/2,canMouseY-30/2); 
    }

	//抓滑鼠移動的event
    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});









};




//LOAD FACEBOOK SDK ASYNC
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js"; 
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));





// Post a BASE64 Encoded PNG Image to facebook
function PostImageToFacebook(accessToken) {
	$('.info').append('<img src="img/loading.gif"/>')//載入loading的img
    var canvas = document.getElementById("canvas");//找canvas
    var imageData = canvas.toDataURL("image/png");//把canvas轉換PNG
    try {
        blob = dataURItoBlob(imageData);//把影像載入轉換函數
    } catch (e) {
        console.log(e);
    }
    var fd = new FormData();
    fd.append("access_token", accessToken);
    fd.append("source", blob);//輸入的照片
    fd.append("message", "這是HTML5 canvas和Facebook API結合教學");//輸入的訊息
    try {
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + accessToken,//GraphAPI Call
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                console.log("success " + data);//成功log + photoID
                  $(".info").html("Posted Canvas Successfully. [<a href='http://www.facebook.com/" + data.id + " '>Go to Profile Picture</a>] "); //成功訊息並顯示連接
            },
            error: function (shr, status, data) {
                $(".info").html("error " + data + " Status " + shr.status);//如果錯誤把訊息傳到class info內
            },
            complete: function () {
                $(".info").append("Posted to facebook");//完成後把訊息傳到HTML的div內
            }
        });

    } catch (e) {
        console.log(e);
    }
}




// Convert a data URI to blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}

