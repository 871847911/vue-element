import axios from 'axios';
import qs from 'qs';

let urlPrefix = {
    backend: '',
    // plat: 'http://112.17.127.68:611',
    plat: 'http://sphz.vdongchina.com/api',
    // plat: 'http://meiye-hz.vdongchina.com/api',
    // plat: '/api',
    // plat: 'http://192.168.1.139:611',
    upload: '',
    docker: '',
    open: ''
}

export function fetch(url, data, method = 'GET', headers = {}) {
    return new Promise((resolve, reject) => {
        let options = {
            'method': method,
            'url': url,
            'headers': headers && typeof headers === 'object' ? headers : {}
        }
        // options.headers['X-Requested-Page'] = 'json'
        options[method === 'GET' ? 'params' : 'data'] = data
        axios(options).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}



export function serializeQuery(params) {
    return encodeURIComponent(params);
}
/**************************************************************************************************************/

export default {

    // store 店面
    // 站点信息
    siteUrl() {
        return `${urlPrefix.plat}`
    },
    queryStorePage(params) {
        return fetch(`${urlPrefix.plat}/store/queryStorePage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    // staff 技师

    addStaff(params) {
        return fetch(`${urlPrefix.plat}/staff/addStaff`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    addStaffType(params) {
        return fetch(`${urlPrefix.plat}/staff/addStaffType`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    addServerStaff(params) {
        return fetch(`${urlPrefix.plat}/staff/addServerStaff`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    removeServerStaff(params) {
        return fetch(`${urlPrefix.plat}/staff/removeServerStaff`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },
    removeStaffType(params) {
        return fetch(`${urlPrefix.plat}/staff/removeStaffType`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },

    queryStaffCount(params) {
        return fetch(`${urlPrefix.plat}/staff/queryStaffCount`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    queryStaffPage(params) {
        return fetch(`${urlPrefix.plat}/staff/queryStaffPage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    queryStaffServer(params) {
        return fetch(`${urlPrefix.plat}/staff/queryStaffServer`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    removeStaff(params) {
        return fetch(`${urlPrefix.plat}/staff/removeStaff`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },
    updateStaff(params) {
        return fetch(`${urlPrefix.plat}/staff/updateStaff`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    // 批量操作

    disableStaffs(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/staff/disableStaffs?id=${queryString}`, '', 'DELETE')
    },
    enableStaffs(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/staff/enableStaffs?id=${queryString}`, '', 'DELETE')
    },
    removeStaffs(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/staff/removeStaffs?id=${queryString}`, '', 'DELETE', )
    },

    recommendAllStaff(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/staff/recommendAll?id=${queryString}`, '', 'DELETE')
    },
    recommendServerStaff(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/staff/recommendServerStaff?serverStaff=${queryString}`, '', 'DELETE')
    },


    // 根据storeid找所有技师类型
    selectByStore(params) {
        return fetch(`${urlPrefix.plat}/staff/selectByStore`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },


    // server 服务模块
    addServer(params) {
        return fetch(`${urlPrefix.plat}/server/addServer`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    addServerType(params) {
        return fetch(`${urlPrefix.plat}/server/addServerType`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    queryByStaff(params) {
        return fetch(`${urlPrefix.plat}/server/queryByStaff?staffid=${params.staffid}`, params, 'POST', {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    queryServerCount(params) {
        return fetch(`${urlPrefix.plat}/server/queryServerCount`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    queryServerPage(params) {
        return fetch(`${urlPrefix.plat}/server/queryServerPage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    queryServerTypePage(params) {
        return fetch(`${urlPrefix.plat}/server/queryServerTypePage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    removeServer(params) {
        return fetch(`${urlPrefix.plat}/server/removeServer`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },
    removeServerType(params) {
        return fetch(`${urlPrefix.plat}/server/removeServerType`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },
    updateServer(params) {
        return fetch(`${urlPrefix.plat}/server/updateServer`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    updateServerType(params) {
        return fetch(`${urlPrefix.plat}/server/updateServerType`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    // 服务批量操作

    disableServers(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/server/disableServers?id=${queryString}`, '', 'DELETE')
    },
    enableServers(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/server/enableServers?id=${queryString}`, '', 'DELETE')
    },
    removeServers(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/server/removeServers?id=${queryString}`, '', 'DELETE', )
    },
    recommendAllServers(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/server/recommendAll?id=${queryString}`, '', 'DELETE')
    },
    unRecommendAllServer(params) {
        let queryString = serializeQuery(params)
        return fetch(`${urlPrefix.plat}/server/unRecommendAll?id=${queryString}`, '', 'DELETE')
    },
    // image 图片
    // 添加轮播图
    addTMaterial(params) {
        return fetch(`${urlPrefix.plat}/material/addTMaterial`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    // 查询店面轮播图
    queryShoppicByStore(params) {
        return fetch(`${urlPrefix.plat}/material/queryShoppicByStore`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    //
    querySlideshowByStore(params) {
        return fetch(`${urlPrefix.plat}/material/querySlideshowByStore`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    // 删除轮播图
    removeTMaterial(params) {
        return fetch(`${urlPrefix.plat}/material/removeTMaterial`, params, 'DELETE', {
            'Content-Type': 'application/json'
        })
    },
    // 更新轮播图
    updateTMaterial(params) {
        return fetch(`${urlPrefix.plat}/material/updateTMaterial`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },


    //积分规则设置
    integralSetting(params) {
        return fetch(`${urlPrefix.plat}/integral/integralSetting`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //获取积分参数
    getIntegralSetting(params) {
        return fetch(`${urlPrefix.plat}/integral/integralSetting`, params)
    },

    //添加门店
    addStore(params) {
        return fetch(`${urlPrefix.plat}/store/addStore`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },

    // 配置门店信息
    updateStore(params) {
        return fetch(`${urlPrefix.plat}/store/updateStore`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //预约
    queryAppointmentPage(params) {
        return fetch(`${urlPrefix.plat}/orderAppointment/queryAppointmentPage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //省市区联动
    selectAllRegion(params) {
        return fetch(`${urlPrefix.plat}/region/selectAllRegion`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //支付管理
    queryOrderPaymentPage(params) {
        return fetch(`${urlPrefix.plat}/orderPayment/queryOrderPaymentPage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //用户信息
    queryUserPage(params) {
        return fetch(`${urlPrefix.plat}/userLog/queryUserPage`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //用户积分列表
    integralList(params) {
        return fetch(`${urlPrefix.plat}/integral/integralList`, params)
    },

    //优惠券

    getCouponListByMerchantId(params) {
        return fetch(`${urlPrefix.plat}/coupon/getCouponListByMerchantId`, params)
    },

    // 创建折扣券
    addDiscount(params) {
        return fetch(`${urlPrefix.plat}/coupon/addDiscount`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },

    //创建代金券
    addVoucher(params) {
        return fetch(`${urlPrefix.plat}/coupon/addVoucher`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },

    //投放/暂停投放
    setCouponStopByCouponId(params) {
        return fetch(`${urlPrefix.plat}/coupon/setCouponStopByCouponId`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    // 优惠券强制失效
    setCouponInvalidByCouponId(params) {
        return fetch(`${urlPrefix.plat}/coupon/setCouponInvalidByCouponId`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //优惠券删除
    setCouponDeleteByCouponId(params) {
        return fetch(`${urlPrefix.plat}/coupon/setCouponDeleteByCouponId`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //我的模板
    queryMyTemplatePage(params) {
        return fetch(`${urlPrefix.plat}/template/queryMyTemplatePage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //模板市场
    queryTemplatePage(params) {
        return fetch(`${urlPrefix.plat}/template/queryTemplatePage`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    //模板id查模板
    queryTemplateById(params) {
        return fetch(`${urlPrefix.plat}/template/queryTemplateById`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    //取消激活模板
    disabledMyTemplate(params) {
        return fetch(`${urlPrefix.plat}/template/disabledMyTemplate`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    //激活模板
    activateMyTemplate(params) {
        return fetch(`${urlPrefix.plat}/template/activateMyTemplate`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    //获取账号版本
    queryAccountById(params) {
        return fetch(`${urlPrefix.plat}/account/queryAccountById`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    // 模板id查功能
    queryTemplateFunctionsById(params) {
        return fetch(`${urlPrefix.plat}/template/queryTemplateFunctionsById`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    // 模板id查轮播图
    queryTemplateBroadcastById(params) {
        return fetch(`${urlPrefix.plat}/template/queryTemplateBroadcastById`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    // 根据商家找门店id,name
    queryStoreBySeller(params) {
        return fetch(`${urlPrefix.plat}/store/queryStoreBySeller`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    //绑定读短信平台
    bindingIdentity(params) {
        return fetch(`${urlPrefix.plat}/shortMessage/bindingIdentity`, qs.stringify(params), 'PUT', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //商户发送信息统计
    getMessageStatistics(params) {
        return fetch(`${urlPrefix.plat}/shortMessage/getMessageStatistics`, params)
    },

    //发送短信列表
    getMessageList(params) {
        return fetch(`${urlPrefix.plat}/shortMessage/getMessageList`, params)
    },

    // 根据技师查服务
    getServerByStaff(params) {
        return fetch(`${urlPrefix.plat}/server/queryByStaff`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //根据服务查技师
    getStaffByServer(params) {
        return fetch(`${urlPrefix.plat}/staff/queryByServerId`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },

    //更新预约
    updateOrderAppointment(params) {
        return fetch(`${urlPrefix.plat}/orderAppointment/updateOrderAppointment`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    // 获取商家门店数量和配置信息
    queryStoreByAccountId(params) {
        return fetch(`${urlPrefix.plat}/store/queryStoreByAccountId`, qs.stringify(params), 'POST', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    //根据商家查品牌
    selectBrand(params) {
        return fetch(`${urlPrefix.plat}/brand/selectBrand`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    // 添加品牌
    addBrand(params) {
        return fetch(`${urlPrefix.plat}/brand/addBrand`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    //更新品牌
    updateBrand(params) {
        return fetch(`${urlPrefix.plat}/brand/updateBrand`, params, 'POST', {
            'Content-Type': 'application/json'
        })
    },

    // 登陆
    queryAccount(params) {
        return fetch(`${urlPrefix.plat}/account/queryAccount`, params, 'POST', {
            'Content-Type': 'application/json',
        })
    },

    updateAccount(params) {
        return fetch(`${urlPrefix.plat}/account/updateAccount`, params, 'POST', {
            'Content-Type': 'application/json',
        })
    },

    // 微信

    getAutUrl(params) {
        return fetch(`${urlPrefix.plat}/wx/getAutUrl`, params);
    },

    getLatestAuditstatus(params) {
        return fetch(`${urlPrefix.plat}/wx/getLatestAuditstatus`, params);

    },
    testUpload(params) {
        return fetch(`${urlPrefix.plat}/wx/testUpload?user_version=${params.user_version}&user_desc=${params.user_desc}&accountId=${params.accountId}`,{}, 'POST', {
            'Content-Type': 'application/json'
        })
    },
    //新增接口 发布至线上
    pushOnline(params){
        console.log(params)
        return fetch(`${urlPrefix.plat}/wx/release?sellerId=${params.sellerId}`,{}, 'POST', {
            'Content-Type': 'application/json'
        })
    },



    // 查看我的激活模板
    queryActivateTemplate(params){
        return fetch(`${urlPrefix.plat}/template/queryActivateTemplate?accountId=${params.accountId}`, {}, 'POST', {
            'Content-Type': 'application/json',
        })
    },
    // 商家
    updateSeller(params) {
        return fetch(`${urlPrefix.plat}/seller/updateSeller`, params, 'POST', {
            'Content-Type': 'application/json',
        })
    },
    sendMesssage(params) {
        return fetch(`${urlPrefix.plat}/shortMessage/sendMesssage`, params, 'PUT', {
            'Content-Type': 'application/json'
        })
    },
    checkCode(params) {
        return fetch(`${urlPrefix.plat}/shortMessage/checkcode`, params, 'PUT', {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    },
    querySellerById(params){
        return fetch(`${urlPrefix.plat}/seller/queryById?sellerId=${params.sellerId}`,{}, 'POST', {
            'Content-Type': 'application/json',
        })
    }
    // example

    // baidu(params) {
    //     return fetch(`${urlPrefix.plat}`, params)
    // },
    // SaveConfig(params) {
    //     return fetch(`${urlPrefix.plat}/guard/app/add`, qs.stringify(params), 'POST', {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     })
    // },
}
/**************************************************************************************************************/
