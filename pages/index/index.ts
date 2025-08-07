import {CONTACT, ROUTES} from '../../config/config'
import {getContactInfo, getOpenId, getAlipayOrderList} from "../../api/api";
import {formatDate} from "../../utils/misc";

interface OrderItem {
  cdk: string;
  expiredTime: number;
  expiredFormatStr: string;
  status?: 'expired' | 'valid' | 'transferred';
}

Page({
  data: {
    showOrderList: false,
    showGetKey: false,
    showFeedback: false,

    orderList: [] as OrderItem[],

    openid: '',

    qqGroupNumber: CONTACT.qqGroupNumber
  },

  onLoad() {
    this.getOpenId()
  },

  async getOpenId() {
    try {
      const result = await my.getAuthCode({
        scopes: ['auth_user']
      })
      if (result.authCode) {
        const resp = await getOpenId(result.authCode);
        if (resp.data?.data?.openid) {
          this.setData({openid: resp.data.data.openid})
          return true
        }
      }
      return false
    } catch (error) {
      console.error('获取openid失败:', error)
      return false
    }
  },

  async onFetchCdkList() {
    await Promise.all([
      this.getOpenId(),
      my.showLoading({content: '查询中...'})
    ])

    try {
      const resp = await getAlipayOrderList(this.data.openid)
      console.log(resp)
      if (resp.data) {
        const processedOrders = this.processOrderList(resp.data.data);
        this.setData({
          orderList: processedOrders,
          showOrderList: true
        })
        await my.hideLoading()
      } else {
        await my.hideLoading()
        await my.showToast({
          type: 'none',
          content: '查询失败'
        })
      }
    } catch (error) {
      console.log(error)
      await my.hideLoading()
      await my.showToast({
        type: 'none',
        content: '网络错误，请重试'
      })
    }
  },

  processOrderList(orders: any[]): OrderItem[] {
    console.log(orders)
    if (!orders) {
      return []
    }
    const now = Date.now();
    const m: any = {}
    const val = orders.sort((a, b) => {
      return new Date(b['created_at']).valueOf() - new Date(a['created_at']).valueOf()
    }).filter(e => {
      if (m[e['cdk']]) {
        return false
      }
      m[e['cdk']] = true
      return true
    })
    return val.map(order => {
      const expiredTime = new Date(order['expired_at']);
      const expiredTs = expiredTime.valueOf();
      const isExpired = expiredTs < now;
      console.log(order)
      let status: 'expired' | 'valid' | 'transferred' = 'valid'
      if (isExpired) {
        status = order['transferred'] === -1 ? 'transferred' : 'expired'
      }
      return {
        cdk: order.cdk,
        expiredTime: expiredTime.valueOf(),
        status: status,
        expiredFormatStr: formatDate(expiredTs)
      };
    });
  },

  closeOrderList() {
    this.setData({showOrderList: false})
  },

  onOrderListVisibleChange(e: any) {
    if (!e.detail.visible) {
      this.closeOrderList();
    }
  },

  async onQueryCDK() {
    await my.navigateTo({
      url: ROUTES.getkey
    })
  },

  closeCDKQuery() {
    this.setData({showGetKey: false})
  },

  async onFeedback() {
    try {
      const {data} = await getContactInfo()
      const qq = data.data.QQGroup
      this.setData({qqGroupNumber: qq})
    } catch (e) {
      console.log(e)
    }
    this.setData({showFeedback: true})
  },

  closeFeedback() {
    this.setData({showFeedback: false})
  },

  onFeedbackVisibleChange(e: any) {
    if (!e.detail.visible) {
      this.closeFeedback();
    }
  },

  copyCDK(e: any) {
    const cdk = e.currentTarget.dataset.cdk
    my.setClipboard({
      text: cdk,
      success: () => {
        my.showToast({
          type: 'success',
          content: '复制成功'
        })
      }
    })
  },

  copyQQ() {
    my.setClipboard({
      text: this.data.qqGroupNumber,
      success: () => {
        my.showToast({
          type: 'success',
          content: '已复制'
        })
      }
    })
  },

  preventDefault() {
    // 空函数，防止事件冒泡
  }
})