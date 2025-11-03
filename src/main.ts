import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import "dotenv/config";
import { WinstonModule } from "nest-winston";
import { bootstrap } from "./app";
import { AppModule } from "./app.module";
import { AppConfig } from "./config/type";
import { loggerConfig } from "./lib/logger";

run().catch((error: Error) => {
  console.error("Failed to start Hopper Solution API", { error: error.stack });
  process.exit(1);
});

async function run() {
  const app = await createNestApp();
  const logger = new Logger("App");

  try {
    bootstrap(app);
    const port = app.get(ConfigService<AppConfig, true>).get("api.port", { infer: true });

    // Swagger Module Configuration
    const config = new DocumentBuilder().setTitle("Hopper Solution API").build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    if (!process.env.DOCS_URL) {
      SwaggerModule.setup("docs", app, document, {
        customCss: ".swagger-ui .topbar { display: none }",
      });

      logger.log(`Swagger documentation available in the "/docs" endpoint\n`);
    }

    await app.listen(port);
    logger.log(`Application started on port: ${port}`);
  } catch (error) {
    console.error(error);
    logger.error("Application crashed", {
      error,
    });
  }
}

export async function createNestApp() {
  return NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig()),
    bodyParser: false,
  });
}
