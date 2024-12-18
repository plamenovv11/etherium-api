import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

const DEFAULT_USERS = [
    { username: 'alice', password: 'alice' },
    { username: 'bob', password: 'bob' },
    { username: 'carol', password: 'carol' },
    { username: 'dave', password: 'dave' },
];

@Injectable()
export class UserSeederService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onApplicationBootstrap() {
        for (const user of DEFAULT_USERS) {
            const exists = await this.userRepository.findOneBy({ username: user.username });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                const newUser = this.userRepository.create({
                    username: user.username,
                    password: hashedPassword,
                });

                await this.userRepository.save(newUser);
            }
        }
    }
}
