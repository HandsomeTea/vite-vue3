import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError, Method, AxiosInstance } from 'axios';
import Agent from 'agentkeepalive';

class Exception extends Error {
	private status: number;
	private type?: string | undefined;
	private error: Record<string, unknown>;
	private httpInfo: string;

	constructor(error: HttpException) {
		super(error.httpInfo);

		this.status = error.status;
		this.type = error.type;
		this.error = error.error || {};
		this.httpInfo = error.httpInfo;
	}
}

interface RestHttpArgument {
	params?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	data?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	headers?: Record<string, string | string[] | number | boolean | null>;
}

export const HTTP = new class RestApi {
	private Service: AxiosInstance;
	constructor() {
		this.Service = axios.create({
			timeout: 10000,
			httpAgent: new Agent({
				keepAlive: true,
				timeout: 60000, // active socket keepalive for 60 seconds
				freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
				freeSocketKeepAliveTimeout: 10,
				socketActiveTTL: 100
			})
		});
		this.init();
	}

	private init(): void {
		// 请求拦截器
		this.Service.interceptors.request.use(config => this.beforeSendToServer(config), this.beforeSendToServerButError);

		// 响应拦截器
		this.Service.interceptors.response.use(this.receiveSuccessResponse, this.receiveResponseNotSuccess);
	}

	private beforeSendToServer(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
		const zh = config.url?.match(/[\u4e00-\u9fa5]/g);

		if (zh) {
			const _obj: Record<string, string> = {};

			for (let i = 0; i < zh.length; i++) {
				if (!_obj[zh[i]]) {
					_obj[zh[i]] = encodeURIComponent(zh[i]);
				}
			}

			for (const key in _obj) {
				config.url = config.url?.replace(new RegExp(key, 'g'), _obj[key]);
			}
		}

		return config;
	}

	private async beforeSendToServerButError(error: unknown): Promise<HttpException> {
		return Promise.reject(
			new Exception({
				httpInfo: `${error}`,
				status: 0,
				error: {
					info: 'request send error: not send.'
				}
			})
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async receiveSuccessResponse(response: AxiosResponse): Promise<any> {
		// 这里只处理 response.status >= 200 && response.status <= 207 的情况
		const { data /*, config, headers, request, status, statusText*/ } = response;

		return Promise.resolve(data);
	}

	private async receiveResponseNotSuccess(error: AxiosError): Promise<HttpException> {
		// const { message, name, description, number, fileName, lineNumber, columnNumber, stack, code } = error.toJSON();
		const { response, config, request: { responseURL } } = error;
		// const { url, baseURL, method } = config;

		let errorResult: HttpException = {
			status: 500,
			httpInfo: ` 访问 ${config ? config.baseURL : responseURL} 失败`,
			error: { info: '' }
		};

		if (response) {
			const { status, statusText, data } = response;

			try {
				// data:{status,code,message,source,reason}
				errorResult = {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					status: data.status || status,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					type: data.code || 'INTERNAL_SERVER_ERROR',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					httpInfo: data.message || statusText,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					error: { ...delete data.status && delete data.code && delete data.message && data }
				};
			} catch (e) {
				errorResult = {
					status,
					type: 'INTERNAL_SERVER_ERROR',
					httpInfo: statusText,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					error: { info: data }
				};
			}
		}

		return Promise.reject(new Exception(errorResult));
	}

	private async send(url: string, method: Method, options: RestHttpArgument): Promise<AxiosResponse> {
		return await this.Service.request({
			url,
			method,
			...options
		});
	}

	public async post(url: string, options: RestHttpArgument): Promise<AxiosResponse> {
		return await this.send(url, 'post', options);
	}

	public async delete(url: string, options: RestHttpArgument): Promise<AxiosResponse> {
		return await this.send(url, 'delete', options);
	}

	public async put(url: string, options: RestHttpArgument): Promise<AxiosResponse> {
		return await this.send(url, 'put', options);
	}

	public async get(url: string, options: RestHttpArgument): Promise<AxiosResponse> {
		return await this.send(url, 'get', options);
	}
};
