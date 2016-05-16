var apiUrl="http://127.0.0.1/api_door/check";
var MapIDShow=['2F', '3F', '4F', 'Lab'];
var MapID = "1";
var zone = "3307";
var session = "AA";
$(document).ready(function(){
	StartUp();
	StatusAreaUpdate();
	$('#inputZone').keypress(function(e) {
		if(e.keyCode==13)
		$('#btnApply').trigger('click');
	});
	setInterval(function() {
			setWell("<div class=\"well\" id=\"statusWell\">請感應票卡</div>");
		}, 7000);
});
function ChangeArea() {
	if ($("#inputZone").val()=="") {
		alert("區域欄位不得空白")
		return false;
	}
	MapID = $("#selMap").prop("selectedIndex");
	zone = $("#inputZone").val();
	$("#inputZone").val('');
	StatusAreaUpdate()
	alert("修改成功");
}
function StartUp() {
	$('#reader').html5_qrcode(function(data){
			//$('#read').html(data);
			console.log("QR decode: "+data);
			sendPOST(data);
		},
		function(error){
			// $('#read_error').html(error);
		}, function(videoError){
			// $('#vid_error').html(videoError);
		});
}
function Shutdown() {
	$('#reader').html5_qrcode_stop()
	$('video, canvas').remove();
}
function sendPOST(newSession) {
	if(newSession!==undefined) {
		session = newSession;
	}
	$.ajax({
		url:apiUrl,
		method:"POST",
		data:{
			MapID:MapID,
			zone:zone,
			session:session
		},
		datatype:"json",
		success:function (result) {
			  var strResult = eval(result)[0];
			console.log("HTTP SUCCESS: "+strResult);
			var index;
			switch (strResult) {
				//Data Lose
				case -2:
					console.log("缺少欄位");
					strResult = undefined;
					break;
				// Fake Session
				case -1:
					strResult = "Session 已過期或無效！";
					index = 0;
					break;
				//Access Denied
				case 0:
					strResult = "無權限進入！"
					index = 1;
					break;
				//Access Allowed
				case 1:
					strResult = "歡迎進入！";
					index = 2;
					break;
				default:
					console.log("未知錯誤");
					strResult = undefined;
			}
			if (strResult !== undefined) {
				StatusWell(index, strResult);
			}
		} ,
		error:function (result) {
			console.log("Connection Failed.");
		}
	});
}
function StatusWell(ind, msg) {
	var label=["<span class=\"label label-danger\">警告</span>",
						"<span class=\"label label-warning\">注意</span>",
						"<span class=\"label label-success\">通過</span>"];
	var str1 = "<div id=\"statusWell\" class=\"well\">";
	var str2 = "</div>";
	setWell(str1+label[ind]+msg+str2);
}
function setWell(str) {
	$("#statusWell").replaceWith(str);
}
function StatusAreaUpdate() {
	$("#labMapID").text(MapIDShow[MapID]);
	$("#labZone").text(zone);
}
