<template>
    <div>
        <script :id=id type="text/plain"></script>
    </div>
</template>
<script>
    // ueditor
    import '../../../../static/js/ueditor/ueditor.config';
    import '../../../../static/js/ueditor/ueditor.all.min';
    import '../../../../static/js/ueditor/lang/zh-cn/zh-cn';
    import '../../../../static/js/ueditor/ueditor.parse.min';

    export default {
        name: 'UE',
        data() {
            return {
                editor: null
            }
        },
        props: {
            defaultMsg: {
                type: String,
                default: null
            },
            config: {
                type: Object,
                default: {}
            },
            id: {
                type: String,
                default: `ue${Math.random(0, 100)}`
            }
        },
        watch: {
            defaultMsg(val) {
                if (val) this.editor.setContent(val);
            }
        },
        mounted() {
            this._initEditor();
        },
        methods: {
            _initEditor() { // 初始化
                this.editor = UE.getEditor(this.id, this.config);
                this.editor.addListener("ready", () => {
                    if (this.defaultMsg) this.editor.setContent(this.defaultMsg);
                    // this.editor.execCommand('insertHtml', this.defaultMsg);
                    this.editor.focus() // 确保UE加载完成后，放入内容。

                })
            },
            getUEContent() { // 获取含标签内容方法
                return this.editor.getContent()
            }
        },
        destroyed() {
            this.editor.destroy()
        }
    }
</script>
