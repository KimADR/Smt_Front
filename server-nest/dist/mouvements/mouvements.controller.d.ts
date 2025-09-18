import { MouvementsService } from './mouvements.service';
import { CreateMouvementDto } from './dto/create-mouvement.dto';
export declare class MouvementsController {
    private readonly service;
    constructor(service: MouvementsService);
    list(): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }[]>;
    create(req: any, body: CreateMouvementDto): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
}
