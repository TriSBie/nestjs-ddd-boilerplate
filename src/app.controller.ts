import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from './modules/common/services/prisma.service';

@ApiTags('app')
@Controller()
export class AppController {
    constructor(private readonly prismaService: PrismaService) {}

    @Get('/health')
    public async getHealth() {
        return this.prismaService.isHealthy();
    }
}
