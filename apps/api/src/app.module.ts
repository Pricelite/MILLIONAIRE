import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { RolesGuard } from "./common/guards/roles.guard";
import { AnalyticsController } from "./modules/analytics/analytics.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthController } from "./modules/health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    AuthModule
  ],
  controllers: [HealthController, AnalyticsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    RolesGuard
  ]
})
export class AppModule {}
