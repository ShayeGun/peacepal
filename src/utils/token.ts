import axios from 'axios';
import env from 'dotenv';

env.config({ path: `${__dirname}/../.env` });

interface IToken {
    accessToken: string;
    tokenType: string;
    expire: number;
    build(): Token;
    login(): Promise<Token>;
    checkValidity(): Promise<Token>;
    getToken(): any;
}

class Token {
    private static instance: Token;
    declare private accessToken: IToken["accessToken"];
    declare private tokenType: IToken["tokenType"];
    declare private expire: IToken["expire"];

    private constructor() { }

    public static build(): Token {
        if (!Token.instance) {
            Token.instance = new Token();
        }
        return Token.instance;
    }

    // FIX:
    private async login() {
        const formData = axios.toFormData({ "username": process.env.T_USER, "password": process.env.T_PASS });
        const { data: { data: token } } = await axios.post(`${process.env.BASE_URL}/api/v1/agency/login`, formData);

        this.accessToken = token.access_token;
        // convert seconds into milliseconds
        this.expire = token.expire * 1000;
        this.tokenType = token.token_type;
    }

    // FIX:
    public async checkValidity() {

        if (Date.now() > this.expire || !this.accessToken) {
            await this.login();
        }
    }

    public getToken() {
        return {
            accessToken: this.accessToken,
            tokenType: this.tokenType,
            expiresIn: this.expire
        };
    }

}

const token = Token.build();

export { token, IToken };
