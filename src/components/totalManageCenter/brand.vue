<template>
    <div id="brand">
        <p class="title">品牌管理</p>
        <div class="cont">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="设定品牌：" prop="storeName">
                    <el-input v-model="ruleForm.storeName" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌内容：" prop="">
                    <p class="editor-rule">全文限制上传10张图片，每张图片大小限制2MB，为避免图片严重失帧，建议宽度为750像素</p>
                    <!--<script id="editor" type="text/plain" style="width:602px;"></script>-->
                    <quill-editor :content="content" ref="myQuillEditor" :options="editorOption"  @change="onEditorChange($event)">
                    </quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from "../../fetch/api.js"
    import { mapGetters } from "vuex";
    import { quillEditor, Quill } from "vue-quill-editor";
    import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";

    Quill.register("modules/ImageExtend", ImageExtend);
    export default {
        name: 'brandManage',
        data: function() {
            return {
                // editor: '',
                content: "",
                editorOption: {
                    modules: {
                        ImageExtend: {
                            loading: true,
                            name: "multipartFile",
                            size: 2,
                            action:  `${this.siteUrl}/upload`,
                            brandCont: '',
                            response: res => {
                                // console.log("res is", res);
                                return res.url;
                            },
                            headers: xhr => {
                                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                                xhr.open("PUT",  `${this.siteUrl}/upload`)
                            }, // 可选参数 设置请求头部
                            sizeError: () => {
                                this.$message.error("上传的图片大小请勿2MB");
                            }, // 图片超过大小的回调
                            start: () => {
                                // console.log(this.content.split('<img src').length)
                                /*if(this.content.split('<img src').length > 10){
                                    this.$message.error("最多上传十张图片");
                                    return false
                                }*/
                                // console.log(this.content.match(new RegExp(/\<img.*\>$/g)).length)
                            }, // 可选参数 自定义开始上传触发事件
                            end: () => {
                                // this.$message.error("上传数据结束");
                                this.content.match(new RegExp(/\<img.*\>$/g)).length < 10
                                    ? ""
                                    : this.$message.error("最多上传十张图片");
                            }, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                            error: () => {
                                this.$message.error("上传数据失败");
                            }, // 可选参数 上传失败触发的事件
                            success: () => {
                                // console.log('res',res);
                            }, // 可选参数  上传成功触发的事件
                            change: (xhr, formData) => {
                                // xhr.setRequestHeader('myHeader','myValue')
                                // formData.append('multipartFile', 'myToken')
                            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
                        },
                        toolbar: {
                            container: [
                                [{ size: ["small", false, "large"] }],
                                ["bold", "italic"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link", "image"]
                            ],
                            handlers: {
                                image: function() {
                                    QuillWatch.emit(this.quill.id);
                                }
                            }
                        }
                    }
                },
                ruleForm: {
                    storeName: ''
                },
                rules: {
                    storeName: [
                        {required: true, message: '请输入品牌名称', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ]
                },
                siteUrl: ''
            }
        },
        created() {
            this.siteUrl = api.siteUrl();
        },
        mounted() {
            // this.editor = UE.getEditor("editor");
            this.selectBrand()
        },
        methods: {
            //查品牌
            selectBrand() {
                let params = { id: this.loginInfo.sellerId };
                api.selectBrand(params).then(res => {
                    console.log(res);
                    this.brandCont = res;
                    this.ruleForm.storeName = res.name;
                    this.content = res.content
                });
            },
            //改品牌
            updateBrand() {
                let params = { id: this.brandCont.id, content: this.content, name: this.ruleForm.storeName };
                api.updateBrand(params).then(res => {
                    console.log(res)
                    this.open()
                });
            },
            //加品牌
            addBrand() {
                let params = { sellerId: this.loginInfo.sellerId, content: this.content, name: this.ruleForm.storeName };
                api.addBrand(params).then(res => {
                    console.log(res)
                    this.open()
                });
            },
            onEditorChange({ quill, html, text }) {
                // console.log("editor change!", quill, text);
                let textLen = text.length;
                if (textLen > 1000) {
                    this.$message.error("最多输入1000字符");
                }
                console.log(html)
                this.content = html;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.content.split('<img src').length > 11){
                            this.$message.error("最多上传十张图片");
                        }else if(this.brandCont == '') {
                            this.addBrand()
                        }else{
                            this.updateBrand()
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            open() {
                this.$notify({
                    title: '成功',
                    message: '品牌更新成功',
                    type: 'success'
                });
            },
        },
        computed: {
            ...mapGetters({
                loginInfo: "getLoginInfo"
            }),
            editor() {
                return this.$refs.myTextEditor.quillEditor
            }
        },
        components: {
            // quillEditor
        }
    }
</script>

<style lang="scss">
    #brand{
        width: 100%;
        height: 100%;
        .ql-editor{
            height: 424px
        }
        .quill-editor{
            width: 602px;
        }
        .title{
            height: 92px;
            line-height: 92px;
            font-size: 20px;
            color: rgba(0,0,0,.85);
            text-indent: 32px;
            font-weight: 900;
        }
        .cont{
            height: calc(100% - 140px);
            height: -webkit-calc(100% - 140px);
            height: -moz-calc(100% - 140px);
            border: 24px solid #edf2f5;
            overflow: auto;
            .el-form{
                width: 65%;
                margin: 0 auto;
                .el-form-item{
                    .el-form-item__label{
                        color: rgba(0,0,0,0.85);
                    }
                    .el-form-item__label:before{
                        content: "";
                    }
                    .el-input{
                        width: 468px;
                    }
                    .editor-rule{
                        line-height: 40px;
                        color: rgba(0,0,0,0.85);;
                    }
                    &:nth-of-type(1) {
                        margin-top: 32px;
                    }
                    .editor-rule{
                        line-height: 32px;
                    }
                }
            }
        }
    }
</style>
