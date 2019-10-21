// 全局函数
exports.install = function (Vue, options) {

    // 获取币种余额
    Vue.prototype.getCoinBalance = function (coin, callback) {
        this.$axios({
            method: 'get',
            url: '/account/getBalance/' + coin
        }).then((result) => {
            callback(result.data.balance)
        }).catch((error) => {
            if (error && error.data.message) {
                self.$message.error(error.data.message)
            }
        });
    };

    // 重置表单
    Vue.prototype.resetForm = function (self, formName) {
        if (self.$refs[formName])
            self.$nextTick(() => {
                self.$refs[formName].resetFields(); //重置表单
                self.$refs[formName].clearValidate();//重置验证信息
            })
    };
    //
    // //获取指定用户信息
    // Vue.prototype.getUserInfo = function (self, account, callback) {
    //     if (!account) return;
    //     clearTimeout(self._inter);
    //     self._inter = setTimeout(() => {
    //         this.$axios({
    //             method: 'get',
    //             url: '/admin/getUserInfo/' + account
    //         }).then((result) => {
    //             callback(result.data)
    //         }).catch((error) => {
    //             if (error && error.data.message) {
    //                 self.$message.error(error.data.message)
    //             }
    //         });
    //     }, 1000 * 1.5);
    // };

    // 导出功能
    Vue.prototype.export = function (item) {
        if (!item.url || !item.title) return;
        this.$confirm('确定要导出“' + item.title + '.xlsx”?', '导出', {
            showCancelButton: true,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(() => {
                        done();
                        setTimeout(() => {
                            instance.confirmButtonLoading = false;
                        }, 300);
                    }, 500);
                } else {
                    done();
                }
            }
        }).then(() => {
            let params = item.data;
            this.$axios({
                method: 'get',
                url: item.url + '?excel=' + true,
                params: params,
                responseType: 'blob'
            }).then((res) => {
                const link = document.createElement('a');
                let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', item.title + '.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                this.$message.success('导出成功');
            }).catch(error => {
                this.$message.error({
                    title: '错误',
                    desc: '网络连接错误'
                })
            })
        }).catch(() => {
        })
    };
};
