import {API_BASE_URL} from "../config/config";
import {request} from "../utils/request";

export async function getOpenId(authCode: string) {
  return await request({
    url: `${API_BASE_URL}/billing/alipay/openid?code=${authCode}`,
    method: 'GET',
  })
}

export async function getAlipayOrderList(openId: string) {
  console.log('getAlipayOrderList', openId)
  return await request({
    url: `${API_BASE_URL}/billing/order/query_by_user?platform=alipay&user_id=${openId}`,
    method: 'GET',
  })
}

export async function queryCdkByOrderId(orderId: string) {
  return await request({
    url: `${API_BASE_URL}/billing/order/query?order_id=${orderId}`,
    method: 'GET',
  })
}

export async function getContactInfo() {
  return await request({
    url: `${API_BASE_URL}/misc/contact_us`,
    method: 'GET',
  })
} 