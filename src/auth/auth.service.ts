import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../lime/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async authenticate(username: string, password: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            userId: user.id,
            username: user.username,
        };

        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    verifyToken(token: string): string {
        if (!token) {
            throw new UnauthorizedException('Authorization token is required');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            return decoded.userId;
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

}
