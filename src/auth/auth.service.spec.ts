import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockUserRepository = {
    findOneBy: jest.fn(),
};

const JWT_SECRET = 'lime_secret';

describe('AuthService', () => {
    let service: AuthService;

    beforeAll(() => {
        process.env.JWT_SECRET = 'lime_secret';
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: 'UserRepository', useValue: mockUserRepository },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should generate a valid JWT', async () => {
        const user = { id: 'user1', username: 'user1', password: 'hashed-password' };
        mockUserRepository.findOneBy.mockResolvedValue(user);

        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const token = await service.authenticate('user1', 'password');
        const decoded = jwt.verify(token, JWT_SECRET);

        expect(decoded).toMatchObject({ userId: 'user1' });
    });

    it('should verify a valid JWT', () => {
        const token = jwt.sign({ userId: 'user1' }, JWT_SECRET);
        const userId = service.verifyToken(token);
        expect(userId).toEqual('user1');
    });

    it('should throw error if invalid JWT is provided', () => {
        const invalidToken = 'invalid.token';
        expect(() => service.verifyToken(invalidToken)).toThrow(UnauthorizedException);
    });
});
