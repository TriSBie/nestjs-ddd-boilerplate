import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { GrowthBook, type Attributes, type FeatureResult } from '@growthbook/growthbook';
import { type FeatureFlagsModuleOptions } from './feature-flags.module';
import { FEATURE_FLAG_DECORATOR_KEY } from 'src/lib/constants';

@Injectable()
export class FeatureFlagsService implements OnModuleInit, OnModuleDestroy {
    private readonly growthbook: GrowthBook;
    private refreshTimer?: NodeJS.Timeout;

    constructor(@Inject(FEATURE_FLAG_DECORATOR_KEY) private readonly options: FeatureFlagsModuleOptions) {
        this.growthbook = new GrowthBook({
            apiHost: this.options.apiHost,
            clientKey: this.options.clientKey,
        });
    }

    async onModuleInit(): Promise<void> {
        await this.loadFeatures();
    }

    onModuleDestroy(): void {
        this.stopAutoRefresh();
    }

    async loadFeatures(): Promise<void> {
        await this.growthbook.loadFeatures();
    }

    stopAutoRefresh(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = undefined;
        }
    }

    isOn(key: string, attributes: Attributes = {}): boolean {
        this.growthbook.setAttributes(attributes);
        return this.growthbook.isOn(key);
    }

    getValue<T>(key: string, defaultValue: T, attributes: Attributes = {}): T {
        this.growthbook.setAttributes(attributes);
        return this.growthbook.getFeatureValue(key, defaultValue) as T;
    }

    getFeature(key: string, attributes: Attributes = {}): FeatureResult | null {
        this.growthbook.setAttributes(attributes);
        const result = this.growthbook.evalFeature(key);
        return result as FeatureResult | null;
    }
}


