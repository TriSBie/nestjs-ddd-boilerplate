import "./instrument";

import type { ValidationError } from "@nestjs/common";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { PrismaExceptionFilter } from "./filters/prisma-exception.filter";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

export const bootstrap = (app: NestExpressApplication): NestExpressApplication => {
  // Enable shutdown hooks - graceful shutdown
  app.enableShutdownHooks(); // often used to implement event OnApplicationShutdown

  // Collections of middleware protecting the app from common web vulnerabilities
  app.use(helmet());

  app.enableCors({
    origin: "*",
    methods: ["GET", "PATCH", "DELETE", "HEAD", "POST", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Accept",
      "Authorization",
      "Content-Type",
      "Origin",
    ],
    maxAge: 86_400, // 24 hours - preflight cache duration
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Transform payloads to DTO objects based on class-transformer options
      validationError: {
        target: true, // Include the validation error target in the response
        value: true, // Include the validation error value in the response
      },
      // Custom exception factory for validation errors
      exceptionFactory(errors: ValidationError[]) {
        // When validation fails, return a BadRequestException with the validation errors
        return new BadRequestException({ errors });
      },
    })
  );

  // Exception filters for different types of errors
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cookie parser middleware
  app.use(cookieParser());

  if (process?.env?.API_GLOBAL_PREFIX) {
    app.setGlobalPrefix(process?.env?.API_GLOBAL_PREFIX);
  }

  return app;
};
