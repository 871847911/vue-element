<template>
  <div class="play-video-wrap">
    <div class="pv-text" @click="palyVideoVisible=true">{{playText}}</div>
    <el-dialog  title="" :visible.sync="palyVideoVisible"  custom-class="play-video-dialog" :close-on-click-modal="true" :before-close="closePlayVideo" @open="openPlayVideo">
      <video :src="srcUrl" controls autoplay class="pv-cont">
        您的浏览器不支持video标签, 无法播放视频
      </video>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'palyVidio',
  props: ['srcUrl', 'playText'],
  data() {
    return {
      palyVideoVisible: false,
    }
  },
  methods: {
    openPlayVideo() {
      if (document.querySelector('.pv-cont')) {
        document.querySelector('.pv-cont').load()
      }
    },
    closePlayVideo(done) {
      this.palyVideoVisible = false
      document.querySelector('.pv-cont').pause()
    }
  }
}
</script>

<style scoped>

.play-video-wrap {
  /* padding: 0 20px; */
  display: inline-block;
}

.pv-text {
  color: RGBA(0, 0, 0, 0.45);
  cursor: pointer;
  line-height: 22px;
}

.pv-cont {
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>