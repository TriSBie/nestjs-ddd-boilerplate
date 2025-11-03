import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from './modules/common/services/prisma.service';
import { FeatureFlag } from './modules/feature-flags/decorators/feature-flag.decorator';
import { FeatureFlagGuard } from './modules/feature-flags/guards/feature-flag.guard';

@ApiTags('app')
@Controller()
export class AppController {
    constructor(private readonly prismaService: PrismaService) {}

    @Get('/health')
    public async getHealth() {
        return this.prismaService.isHealthy();
    }

    @Get('/admin/test')
    @FeatureFlag('admin_test_enabled')
    @UseGuards(FeatureFlagGuard)
    public getAdminTest(): { ok: boolean } {
        return { ok: true };
    }
}
