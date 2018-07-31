<template>
    <div class="err_page">
        <p class="err_tip">
            抱歉！您访问的页面丢失了!
        </p>
        <button @click="goBack">返 回</button>
    </div>
</template>

<script>
export default {
  name: 'notFind page',
    data() {
        return {
            palyVideoVisible: false,
        }
    },
    methods: {
        goBack() {
            window.history.back()
        }
    }
}
</script>

<style scoped lang="scss">
    .err_page{
        width: 100%;
        height: 100%;
        background: url("../../assets/images/err_bg.jpg") center;
        position: relative;
        .err_tip{
            height: 45px;
            line-height: 45px;
            font-size: 24px;
            color: #F18C26;
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
        }
        button{
            cursor: pointer;
            width: 118px;
            height: 45px;
            border: 1px solid #F18C26;
            font-size: 24px;
            color: #F18C26;
            background: #fff;
            border-radius: 4px;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
    @media screen and (max-width:1366px){
        .err_tip{
            bottom: 180px;
        }
        button{
            bottom: 100px;
        }
    }
    @media screen and (max-width:1440px) and (min-width: 1367px){
        .err_tip{
            bottom: 250px;
        }
       button{
           bottom: 160px;
       }
    }
    @media screen and (min-width:1441px){
        .err_tip{
            bottom: 330px;
        }
        button{
            bottom: 240px;
        }
    }
</style>
