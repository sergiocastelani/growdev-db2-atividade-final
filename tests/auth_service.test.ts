import { AuthService } from "../src/services/auth_service";

describe('Test for AuthService class', () => 
{
    test('login() must fail on non existing email', async () => 
    {
        const sut = new AuthService();

        const result = await sut.login('test', 'test');

        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('statusCode', 400);
        expect(result).toHaveProperty('message', "'email' field is required");
    });
});