const baseApi = {
  test: "https://dev.mirrorchyan.com/api",
  trial: "https://dev.mirrorchyan.com/api",
  prod: "https://mirrorchyan.com/api",
};

export const API_BASE_URL = baseApi[my.isIDE ? 'test' : 'prod'] || baseApi.prod

export const CONTACT = {
  qqGroupNumber: '995458883'
}

export const ROUTES = {
  index: '/pages/index/index',
  orders: '/pages/orders/orders',
  getkey: '/pages/get-key/get-key'
}

export const REQUEST_TIMEOUT = 10000 