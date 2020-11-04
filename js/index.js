const electron = require("electron");
const {
	remote
} = require('electron');
const {
	BrowserWindow
} = remote;
let win = require('electron').remote.getCurrentWindow()
win.setIgnoreMouseEvents(true, {forward: true})/* 默认播放器外区域可以穿透 */
//获取元素
const [
	voi_song_list,
	voi_song_list_box,
	voi_song_list_operate_box,
	voi_off_btn,
	voi_container,
	play_svg,
	voi_main_svg_box,
	play_svg_box,
	play_load_svg
] = [
	document.getElementsByClassName('voi_song_list')[0],
	document.getElementsByClassName('voi_song_list_box')[0],
	document.getElementsByClassName('voi_song_list_operate_box')[0],
	document.getElementsByClassName('voi_off_btn')[0],
	document.getElementsByClassName('voi_container')[0],
	document.getElementsByClassName('play_svg')[0],
	document.getElementsByClassName('voi_main_svg_box')[0],
	document.getElementsByClassName('play_svg_box')[0],
	document.getElementsByClassName('play_load_svg')[0]
];
let [x, y, l, t, isDown] = [0, 0, 0, 0, false];
/* 当鼠标进入时将win穿透设置为禁止穿透 */
voi_container.addEventListener('mouseenter', () => {
	win.setIgnoreMouseEvents(false)
})
/* 当鼠标移出时将win穿透设置为允许*/
voi_container.addEventListener('mouseleave', () => {
	win.setIgnoreMouseEvents(true, {forward: true})
})

//鼠标按下事件
voi_container.onmousedown = function(e) {
	//获取x坐标和y坐标
	x = e.clientX;
	y = e.clientY;
	// dragStage.style.zIndex = 1;
	//获取左部和顶部的偏移量
	l = voi_container.offsetLeft;
	t = voi_container.offsetTop;
	//开关打开
	isDown = true;
	//设置样式
	voi_container.style.cursor = "move";
	voi_container.style.transition = "none";
};
//鼠标移动
window.onmousemove = function(e) {
	if (isDown == false) {
		return;
	}
	//获取x和y
	// dragStage.style.zIndex = 1;
	let nx = e.clientX;
	let ny = e.clientY;
	//计算移动后的左偏移量和顶部的偏移量
	let nl = nx - (x - l);
	let nt = ny - (y - t);

	voi_container.style.left = nl + "px";
	voi_container.style.top = nt + "px";
};
//鼠标抬起事件
voi_container.onmouseup = function() {
	//开关关闭
	isDown = false;
	// dragStage.style.zIndex = "-1";
	voi_container.style.cursor = "default";
	voi_container.style.transition = "all 0.3s ease";
};

// 以下为歌单操作
let _songListIsOn = false;
//歌单展开
function _songListFun() {
	if (_songListIsOn == false) {
		voi_song_list.setAttribute("class", "voi_child_is_on");
		voi_song_list.style.cssText = "top:-60px;cursor:default;";
		voi_song_list_box.style.cssText = "opacity:1;pointer-events:auto;";
		voi_song_list_operate_box.style.width = "230px";
		//歌单详情展开后进行偏移
		voi_container.style.left = voi_container.offsetLeft - 170 + "px";
		voi_song_list.onmousedown = event => {
			window.event ?
				(window.event.cancelBubble = true) :
				e.stopPropagation();
		};
	}
	_songListIsOn = true;
}
voi_song_list.onclick = () => {
	_songListFun();
};

//歌单关闭
function _songListOffFun() {
	voi_song_list.setAttribute("class", "voi_child");
	voi_song_list.style.cssText = "top:0px;cursor:pointer;";
	voi_song_list_box.style.cssText = "opacity:0;pointer-events:auto;";
	voi_song_list_operate_box.style.width = "0px";
	voi_container.style.left = voi_container.offsetLeft + 170 + "px";
	window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
	_songListIsOn = false;
}
voi_off_btn.onclick = () => {
	_songListOffFun();
};
// 以上为歌单操作
