import { BadRequestException } from '@nestjs/common';

export class UserValidation {
    static validateEmail(email: string) {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!regex.test(email)) {
            throw new BadRequestException('Invalid email format.');
        }
    }

    static validatePassword(password?: string) {
        if (password && password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters.');
        }
    }
}
