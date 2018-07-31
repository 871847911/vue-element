<template>
    <el-container>
        <el-aside width="208px" style="box-shadow:1px 0px 4px 0px rgba(0,16,41,0.12);">
            <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select='handleSelect'  text-color="#000000" active-text-color="#18CCC0" :router="true">
                <el-menu-item v-for="(item,index) in asideNavList" :key="index" :index="index.toString()" :route="asideNavList[index].url">
                    <span class="operA">{{item.alias}}</span>
                </el-menu-item>
            </el-menu>
            <!--<el-menu class="temp_menu" :default-active="$route.path" router>
                <el-menu-item :index="myTemp">我的模板</el-menu-item>
                <el-menu-item :index="tempM">模板市场</el-menu-item>
            </el-menu>-->
        </el-aside>
        <div class="tempM">
            <router-view></router-view>
        </div>
    </el-container>
</template>

<script>
    export default {
        name: "templateMarketC",
        data: function() {
            return {
                info: "templateMarketC",
                activeIndex: '',
                asideNavList: [{
                    name: "myTemp",
                    url: "/templateMarketC/myTemp",
                    alias: "我的模板"
                },
                {
                    name: "tempM",
                    url: "/templateMarketC/tempM",
                    alias: "模板市场"
                },

                ],
                myTemp: '/templateMarketC/myTemp',
                tempM: '/templateMarketC/tempM',
            };
        },
        created() {
            this.setIndex()
        },
        updated() {
            this.setIndex()
        },
        methods: {
            setIndex() {
                if(window.location.href.indexOf('myTemp') != -1) {
                    this.activeIndex = '0'
                }else if(window.location.href.indexOf('tempM') != -1) {
                    this.activeIndex = '1'
                }
            },
            handleOpen() {},
            handleClose() {},
            handleSelect() {

            }
        },
        watch: {
            $route(to,from){
                console.log(to.path, from.path)
                if(to.path == '/templateMarketC/tempDetail' && from.path == '/templateMarketC/tempM'){
                    this.tempM = '/templateMarketC/tempM'
                }
            }
        }
    };
</script>

<style lang="scss">
    .el-container{
        font-size: 14px;
        .el-menu{
            height: 100%;
        }
    }

    .temp_menu{
        .is-active{
            color: rgb(24, 204, 192);
            background: RGBA(220, 245, 243, 1);
            border-right: 2px solid #18CCC0;
        }
    }
    .tempM{
        width: 100%;
        height: 100%;
        .el-button{
            padding-top: 0;
            padding-bottom: 0;
            span{
                line-height: 30px;
                margin: 0;
            }
            &:hover {
                color: #18CCC0;
                border: 1px solid #18CCC0;
                background: #fff;
            }
        }
        .el-button--primary{
            background: #18CCC0;
            border: 1px solid #18CCC0;
            &:hover, &:focus {
                color: #fff;
                background: #18CCC0;
                border: 1px solid #18CCC0;
            }
        }
        .el-button--text{
            &:hover{
                color: #18CCC0;
            }
        }
        .el-menu-item{
            height: 40px;
            margin-top: 24px;
            line-height: 40px;
            text-align: center;
            .is-active{
                border-right: 2px solid #18CCC0;
                background: #f66
            }
        }
        .el-form-item__label{
            height: 32px;
            line-height: 32px;
        }
    }
</style>
