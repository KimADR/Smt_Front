import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }[]>;
    create(dto: any): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    get(id: string): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    update(id: string, dto: any): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
