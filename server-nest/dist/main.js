"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    app.use((0, cors_1.default)({ origin, credentials: true }));
    const port = Number(process.env.PORT || 4000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map