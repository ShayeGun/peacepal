import { ApiRequest, Methods } from "./api-request";
import axios from "axios";
import { IToken } from "../token";
import { generateUniqueNumber } from "../generate-unique-number";

interface IGetRequest {
    method: Methods.get,
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string | number>;
}

class GetRequest extends ApiRequest<IGetRequest> {

    method: IGetRequest["method"] = Methods.get;
    url: IGetRequest['url'];
    headers: IGetRequest['headers'] = {};
    private params?: IGetRequest['params'];

    constructor(url: IGetRequest['url'] = 'https://postman-echo.com/status/200', token?: IToken) {
        super();
        this.url = url;

        // default headers
        if (token) {
            const t = token.getToken();
            this.headers = { "Authorization": `${t.tokenType} ${t.accessToken}` };
        }
    }

    setHeader(header: IGetRequest['headers']) {
        this.headers = { ...this.headers, ...header };

        return this;
    }

    setParam(param: IGetRequest['params']) {
        this.params = { ...this.params, ...param };

        return this;
    }

    async call(): Promise<any> {
        // this.setHeader({ activityId: generateUniqueNumber() });

        let requestConfig: IGetRequest = {
            url: this.url,
            method: this.method,
            headers: this.headers,
        };

        if (this.params) requestConfig.params = this.params;
        const { data } = await axios(requestConfig);

        return data;
    }
}

export { GetRequest };