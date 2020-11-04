const electron = require("electron");
const {
	remote
} = require('electron');
const {
	BrowserWindow
} = remote;
let win = require('electron').remote.getCurrentWindow()
win.setIgnoreMouseEvents(true, { forward: true })
var app = new Vue({
  el: '#voinoBtn',
  data() {
      return {
        musicPlayer: {
          songName: "暂无",
          // songSrc:'http://www.sbeam.xyz/voinoVue/static/audios/april02.mp3',
          songSrc: "暂无",
          songAuthor: "暂无",
          vAudioIsReady: false
        }
      };
    },
    mounted() {
      const _this = this;
      let voi_is_on = true;
      let isLoaded = false;
      // const _html = (this.html = document.getElementsByTagName("html")[0]);
      this.$refs.voi_main_box.onmouseup = () => {
        if (voi_is_on) {
          play_svg.style.d = "path('M128 128h768v768H128z')";
          startMusic(voi_is_on);
          voi_is_on = !voi_is_on;
        } else {
          play_svg.style.d =
            "path('M862.7 528L338.4 908.3c-7.9 4.4-14.7 5-20.4 1.5-5.6-3.5-8.5-9.6-8.5-18.5V132.8c0-8.9 2.8-15.1 8.5-18.5 5.6-3.5 12.5-2.9 20.4 1.5L862.7 496c7.9 4.4 11.8 9.8 11.8 15.9 0 6.3-4 11.7-11.8 16.1z')";
          startMusic(voi_is_on);
          voi_is_on = !voi_is_on;
        }
      };
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
        this.$refs.voi_song_list,
        this.$refs.voi_song_list_box,
        this.$refs.voi_song_list_operate_box,
        this.$refs.voi_off_btn,
        this.$refs.voi_container,
        this.$refs.play_svg,
        this.$refs.voi_main_svg_box,
        this.$refs.play_svg_box,
        this.$refs.play_load_svg
      ];
      // let dragStage = document.getElementsByClassName('dragStage')[0];
	  voi_container.addEventListener('mouseenter',function(){
		  win.setIgnoreMouseEvents(false)
	  })
	  voi_container.addEventListener('mouseleave',function(){
		  win.setIgnoreMouseEvents(true, { forward: true })
	  })
	  
      let [x, y, l, t, isDown] = [0, 0, 0, 0, false];
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
            window.event
              ? (window.event.cancelBubble = true)
              : e.stopPropagation();
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
        voi_container.style.left = voi_container.offsetLeft + 140 + "px";
        window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
        _songListIsOn = false;
      }
      voi_off_btn.onclick = () => {
        _songListOffFun();
      };
      // 以上为歌单操作
  
      //开始音乐播放逻辑
      const vAudio = _this.$refs.voinoAudio;
      const songSrcArr = [
        "http://www.sbeam.xyz/voinoVue/static/audios/april02.mp3",
        "http://www.sbeam.xyz/voinoVue/static/audios/柏大輔 - Stella.mp3",
        "http://www.sbeam.xyz/voinoVue/static/audios/ササノマリイ - 共感覚おばけ.mp3",
        "http://www.sbeam.xyz/voinoVue/static/audios/アンクローズ・ヒューマン.mp3"
      ];
      const songNameArr = [
        "april.#02",
        "Stella",
        "ササノマリイ - 共感覚おばけ",
        "アンクローズ・ヒューマン"
      ];
      const songAuthorArr = ["柏大輔", "柏大輔", "ササノマリイ", "未知作者"];
      let songIndex = 0;
      //开始播放音乐
      function musicInfo() {
        // _this.$set(_this.musicPlayer, "vAudioIsReady", true);
        _this.$set(_this.musicPlayer, "songSrc", songSrcArr[songIndex]);
        _this.$set(_this.musicPlayer, "songAuthor", songAuthorArr[songIndex]);
        _this.$set(_this.musicPlayer, "songName", songNameArr[songIndex]);
        // play_svg.style.display = "none";
        // if(_this.musicPlayer == true){
        //   play_load_svg.style.display = "block";
        // }else{
        //   play_load_svg.style.display = "none";
        // }
        // play_load_svg.style.display = "block";
        // _html.style.cursor = "wait";
      }
      function startMusic(isPlay) {
        if (isPlay == true) {
          musicInfo();
          vAudio.play();
        } else {
          vAudio.pause();
        }
      }
  
      //下一曲
      function nextMusic() {
        _this.$set(_this.musicPlayer, "vAudioIsReady", true);
        if (songIndex < songSrcArr.length - 1) {
          songIndex++;
        } else {
          songIndex = 0;
        }
      }
      this.$refs.voi_child_2.onmousedown = function() {
        nextMusic();
        musicInfo();
        play_svg.style.d = "path('M128 128h768v768H128z')";
        vAudio.play();
        voi_is_on = false;
      };
  
      //上一曲
      function previousMusic() {
        _this.$set(_this.musicPlayer, "vAudioIsReady", true);
        if (songIndex <= 0) {
          songIndex = songSrcArr.length - 1;
        } else {
          songIndex--;
        }
      }
      this.$refs.voi_child_4.onmousedown = function() {
        previousMusic();
        musicInfo();
        play_svg.style.d = "path('M128 128h768v768H128z')";
        vAudio.play();
        voi_is_on = false;
      };
  
      //随机播放
      function randomMusic() {
        _this.$set(_this.musicPlayer, "vAudioIsReady", true);
        songIndex = Math.ceil(Math.random() * songSrcArr.length - 1);
      }
      this.$refs.voi_child_3.onmousedown = function() {
        randomMusic();
        musicInfo();
        play_svg.style.d = "path('M128 128h768v768H128z')";
        vAudio.play();
        voi_is_on = false;
      };
  
      //解决在调用play()时音频文件未加载完毕导致报错问题
      // vAudio.load();
      // let playPromise = vAudio.play();
      // if (playPromise !== undefined) {
      //   playPromise
      //     .then(() => {
      //       vAudio.play();
      //     })
      //     .catch(() => {});
      // }
  
      //监测音频是否加载完成
      vAudio.oncanplay = function() {
        // isLoaded = true;
        // _this.$emit('loadStatus',isLoaded);
        play_svg.style.display = "block";
        // play_load_svg.style.display = "none";
        // _html.style.cursor = "default";
        _this.$set(_this.musicPlayer, "vAudioIsReady", false);
      };
    }
})