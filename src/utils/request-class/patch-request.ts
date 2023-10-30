import axios from 'axios';
import { ApiRequest, Methods } from "./api-request";
import { IToken } from '../token';
import { generateUniqueNumber } from "../generate-unique-number";

export enum Formats {
    JSON = "json",
    FORM = "form"
}

interface IPatchRequest {
    method: Methods.patch,
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string | number>;
    data: Record<string, any>;
}

class PatchRequest extends ApiRequest<IPatchRequest> {

    method: IPatchRequest["method"] = Methods.patch;
    url: IPatchRequest['url'];
    headers: IPatchRequest['headers'] = {};
    private params?: IPatchRequest['params'];
    private data: IPatchRequest['data'] = {};

    constructor(url: IPatchRequest['url'] = 'https://postman-echo.com/post', token?: IToken) {
        super();
        this.url = url;

        // default headers
        if (token) {
            const t = token.getToken();
            this.headers = { "Authorization": `${t.tokenType} ${t.accessToken}` };
        }
    }

    setBody(data: IPatchRequest['data'], format: Formats = Formats.JSON) {
        // (condition) ? data-form : json
        this.data = (format === Formats.FORM) ? axios.toFormData({ ...this.data, ...data }) : { ...this.data, ...data };

        return this;
    }

    setHeader(header: IPatchRequest['headers']) {
        this.headers = { ...this.headers, ...header };

        return this;
    }

    setParam(param: IPatchRequest['params']) {
        this.params = { ...this.params, ...param };

        return this;
    }

    async call(): Promise<any> {
        // this.setHeader({ activityId: generateUniqueNumber() });

        let requestConfig: IPatchRequest = {
            url: this.url,
            method: this.method,
            headers: this.headers,
            data: this.data
        };

        if (this.params) requestConfig.params = this.params;

        const { data } = await axios(requestConfig);

        return data;
    }
}

export { PatchRequest };