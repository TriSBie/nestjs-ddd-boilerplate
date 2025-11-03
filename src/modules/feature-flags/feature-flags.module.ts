import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeatureFlagsService } from './feature-flags.service';
import { FEATURE_FLAG_DECORATOR_KEY } from 'src/lib/constants';

export type FeatureFlagsModuleOptions = {
    apiHost: string;
    clientKey: string;
    refreshIntervalMs?: number;
};

@Global()
@Module({
    imports: [ConfigModule],
    providers: [FeatureFlagsService],
    exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {
    static forRoot(): DynamicModule {
        return {
            module: FeatureFlagsModule,
            global: true,
            imports: [ConfigModule],
            providers: [
                {
                    provide: FEATURE_FLAG_DECORATOR_KEY,
                    inject: [ConfigService],
                    useFactory: (
                        config: ConfigService
                    ): FeatureFlagsModuleOptions => ({
                        apiHost: config.get<string>(
                            'GROWTHBOOK_API_HOST',
                            'https://cdn.growthbook.io'
                        )!,
                        clientKey: config.get<string>('GROWTHBOOK_CLIENT_KEY')!,
                        refreshIntervalMs: config.get<number>(
                            'GROWTHBOOK_REFRESH_INTERVAL_MS',
                            30000
                        )!,
                    }),
                },
            ],
            exports: [FEATURE_FLAG_DECORATOR_KEY],
        };
    }
}
