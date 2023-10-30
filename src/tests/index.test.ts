import request from "supertest";
import { app } from "../app";

describe('testing stuff', () => {
    it('test route /test', async () => {
        const response = await request(app).get('/api/v1/test');
        const { status, text: data } = response;
        expect(status).toBe(200);
        expect(JSON.parse(data)).toStrictEqual(expect.objectContaining({
            data: expect.any(String)
        }));
    });
});