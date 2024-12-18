import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto/auth.dto';

@Controller('lime/authenticate')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async login(@Body() authDto: AuthDto) {
        const { username, password } = authDto;
        try {
            const token = await this.authService.authenticate(username, password);
            return { access_token: token };
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
