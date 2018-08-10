<template>
    <div id="messagedetail">
        <div class="redback">
            <p class="title">消息详情</p>
            <el-button @click="goBack">返 回</el-button>
        </div>
        <div class="cont">
            <p>【{{type}}】</p>
            <div class="title">{{title}}</div>
            <p class="releaseTime">发布时间：{{releaseTime}}</p>
            <div class="hr"></div>
            <div class="content" v-html="content"></div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../../fetch/api.js";
export default {
    name: "messageDetail",
    data() {
        return {
            type: "",
            title: "",
            releaseTime: "",
            content: ""
        };
    },
    created() {
        console.log(this.$route.query.id);
        this.messageCenterqueryById(this.$route.query.id);
    },
    computed: {},
    methods: {
        messageCenterqueryById(e) {
            let params = {
                id: e
            };
            api.messageCenterqueryById(params).then(res => {
                console.log("消息", res);
                this.type = res.type;
                this.title = res.title;
                this.releaseTime =
                    new Date(res.releaseTime)
                        .toLocaleDateString()
                        .replace(/\//g, "-") +
                    " " +
                    new Date(res.releaseTime).toTimeString().substr(0, 8);
                this.content = res.content;
            });
        },
        goBack() {
            this.$router.push({ name: "messageCenter" });
        }
    }
};
</script>

<style lang="scss">
#messagedetail {
    width: 100%;
    height: 100%;
    .redback {
        display: flex;
        align-items: center;
        border-left: 24px solid #edf2f5;
        border-right: 24px solid #edf2f5;
        border-top: 24px solid #edf2f5;
        position: relative;
        .title {
            height: 66px;
            line-height: 66px;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.85);
            text-indent: 32px;
            font-weight: 900;
            flex: 1;
            border-bottom: 0;
        }
        .el-button {
            height: 32px;
            width: 75px;
            position: absolute;
            right: 32px;
            top: 17px;
        }
    }

    .cont {
        height: calc(100% - 114px);
        height: -webkit-calc(100% - 202px);
        height: -moz-calc(100% - 202px);
        border: 24px solid #edf2f5;
        border-top: 0;
        overflow: auto;
        p {
            padding: 24px 24px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
        }
        .title {
            font-size: 28px;
            color: rgba(0, 0, 0, 0.85);
            padding: 0;
            border: none;
            height: auto;
            line-height: normal;
            text-align: center;
        }
        .releaseTime {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            text-align: center;
        }
        .hr {
            margin: 0 24px;
            background: rgba(232, 232, 232, 1);
            height: 2px;
        }
        .content {
            width: 50%;
            margin:0 auto;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            p{
                padding: 11px 0;
                img{
                    max-width: 100%;
                    display: block;
                    margin: 0 auto;
                }
            }
            .ql-indent-1 {
                text-indent: 1em;
            }
            .ql-indent-2 {
                text-indent: 2em;
            }
            .ql-indent-3 {
                text-indent: 3em;
            }
            .ql-indent-4 {
                text-indent: 4em;
            }
            .ql-indent-5 {
                text-indent: 5em;
            }
            .ql-indent-6 {
                text-indent: 6em;
            }
            .ql-indent-7 {
                text-indent: 7em;
            }
            .ql-indent-8 {
                text-indent: 8em;
            }
            .ql-align-center{
                text-align: center;
                img{
                    max-width: 100%;
                    display: block;
                    margin: 0 auto;
                }
            }
            .ql-align-left{
                text-align: left;
                img{
                    display: inline;
                    margin: 0;
                }
            }
            .ql-align-right{
                text-align: right;
                img{
                    display: inline;
                    margin: 0;
                }
            }
            ul,
            li,
            dl,
            dt,
            dd,
            ol {
                list-style: inherit;
            }
        }
    }
}
</style>
