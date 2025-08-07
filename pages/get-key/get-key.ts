import {queryCdkByOrderId} from '../../api/api'
import {formatDate, getRemainingTimeText} from "../../utils/misc";

interface CDKRenderResult {
  cdk: string;
  expiredTime?: Date;
  expiredFormatStr?: string;
  remainingFormatStr?: string;
  status?: 'expired' | 'valid';
}

Page({
  data: {
    orderId: '',
    cdkResult: null as CDKRenderResult | null,
    loading: false,
    showSuccessModal: false
  },

  onLoad() {
  },

  onOrderNumberInput(e: any) {
    this.setData({orderId: e.detail.value});
  },

  onPopupVisibleChange(e: any) {
    this.setData({
      showSuccessModal: e.detail.visible
    });
  },

  async doQueryCDK() {
    const orderId = this.data.orderId.trim();

    if (!orderId) {
      await my.showToast({
        type: 'none',
        content: '请输入订单号'
      });
      return;
    }

    this.setData({
      loading: true,
      cdkResult: null
    });

    await my.showLoading({
      content: '查询中...'
    });

    try {
      const resp = await queryCdkByOrderId(orderId);
      if (resp.statusCode === 200 && resp.data.code == 0) {
        my.hideLoading();
        const result = this.processCDKResult(resp.data);
        this.setData({
          cdkResult: result,
          showSuccessModal: true
        });
      } else {
        my.hideLoading();
        my.showToast({
          type: 'none',
          content: '订单号错误或不存在'
        });
      }
    } catch (error) {
      my.hideLoading();
      console.error('查询CDK失败:', error);
      my.showToast({
        type: 'none',
        content: '网络错误，请重试'
      });
    } finally {
      this.setData({loading: false});
    }
  },

  processCDKResult({data}: any): CDKRenderResult {
    const result: CDKRenderResult = {
      cdk: data.cdk
    };

    const fieldVal = data['expired_at']
    if (fieldVal) {
      const now = Date.now().valueOf();
      const expiredTime = new Date(fieldVal).valueOf();
      const isExpired = expiredTime < now;
      result.expiredTime = data.expiredTime;
      result.expiredFormatStr = formatDate(expiredTime);
      result.remainingFormatStr = getRemainingTimeText(expiredTime);
      result.status = isExpired ? 'expired' : 'valid';
    }

    return result;
  },

  copyCDK(e: any) {
    const cdk = e.currentTarget.dataset.cdk;
    my.setClipboard({
      text: cdk,
      success: () => {
        my.showToast({
          type: 'success',
          content: '复制成功'
        });
      }
    });
  },

  closeSuccessModal() {
    this.setData({showSuccessModal: false});
  }
}) 