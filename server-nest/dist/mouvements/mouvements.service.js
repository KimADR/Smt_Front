"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouvementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let MouvementsService = class MouvementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        return this.prisma.mouvement.findMany({
            select: { id: true, amount: true, type: true, description: true, createdAt: true, entrepriseId: true, userId: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createFromBody(body) {
        const entrepriseId = Number(body.entrepriseId);
        if (!entrepriseId)
            throw new common_1.BadRequestException('entrepriseId requis');
        const exists = await this.prisma.entreprise.findUnique({ where: { id: entrepriseId } });
        if (!exists)
            throw new common_1.NotFoundException('Entreprise introuvable');
        const signType = String(body.type);
        const amountNum = Number(body.amount);
        if (!['CREDIT', 'DEBIT'].includes(signType))
            throw new common_1.BadRequestException('type invalide');
        const amountSigned = signType === 'DEBIT' ? -Math.abs(amountNum) : Math.abs(amountNum);
        const created = await this.prisma.mouvement.create({ data: { entrepriseId, amount: amountSigned, type: signType, description: body.description } });
        return created;
    }
    async createFromMultipart(rawBody) {
        let payload = {};
        try {
            payload = rawBody?.payload ? JSON.parse(String(rawBody.payload)) : {};
        }
        catch (e) {
            throw new common_1.BadRequestException('Invalid payload JSON');
        }
        const mapped = {
            entrepriseId: payload.entreprise_id ?? payload.entrepriseId,
            amount: payload.montant ?? payload.amount,
            type: (payload.type === 'RECETTE' || payload.type === 'CREDIT') ? 'CREDIT' : (payload.type === 'DEPENSE' || payload.type === 'DEBIT') ? 'DEBIT' : payload.type,
            description: payload.description,
        };
        return this.createFromBody({
            entrepriseId: mapped.entrepriseId,
            amount: mapped.type === 'DEBIT' ? -Math.abs(Number(mapped.amount)) : Math.abs(Number(mapped.amount)),
            type: mapped.type,
            description: mapped.description,
        });
    }
};
exports.MouvementsService = MouvementsService;
exports.MouvementsService = MouvementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MouvementsService);
//# sourceMappingURL=mouvements.service.js.map