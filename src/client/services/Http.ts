import axios from 'axios'

export interface IRequestParams {
  baseUrl?: string
  method: 'get' | 'put' | 'post' | 'delete'
  url: string
  params?: any
  body?: any,
}

export class Http {
  constructor(
    public readonly baseUrl: string = '',
    public readonly headers: {[key: string]: string} = {},
  ) {
  }
  async request(params: IRequestParams) {
    return axios({
      baseURL: this.baseUrl,
      headers: this.headers,
      ...params,
    })
    .then(result => result.data)
  }
  async get(url: string, params?: {[key: string]: any}) {
    return this.request({
      method: 'get',
      url,
      params,
    })
  }
}
