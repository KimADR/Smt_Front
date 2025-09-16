"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const enterprises = [
        { name: 'MerakiTeam', siret: 'MT-0001', city: 'Antananarivo', contactEmail: 'contact@merakiteam.mg', phone: '+261207000111' },
        { name: 'Beta SAS', siret: 'BETA-0002', city: 'Antsirabe', contactEmail: 'info@beta-sas.mg', phone: '+261207000222' },
        { name: 'ACME SARL', siret: 'ACME-0003', city: 'Toamasina', contactEmail: 'hello@acme.mg', phone: '+261207000333' },
    ];
    const entrepriseBySiret = {};
    for (const e of enterprises) {
        const up = await prisma.entreprise.upsert({
            where: { siret: e.siret },
            update: { name: e.name, city: e.city, contactEmail: e.contactEmail, phone: e.phone },
            create: { name: e.name, siret: e.siret, city: e.city, contactEmail: e.contactEmail, phone: e.phone },
        });
        entrepriseBySiret[e.siret] = up.id;
    }
    const users = [
        { username: 'admin1', email: 'rivo.andrian@dgf.mg', fullName: 'Rivo Andrian', role: client_1.Role.ADMIN_FISCAL, phone: '+261320000003', avatar: '/sefo.jpg' },
        { username: 'agent1', email: 'mamy.haja@impots.mg', fullName: 'Mamy Haja', role: client_1.Role.AGENT_FISCAL, phone: '+261320000001', avatar: '/Jyeuhair.jpg' },
        { username: 'patterson', email: 'patterson.johnson@merakiteam.mg', fullName: 'Patterson Johnson', role: client_1.Role.ENTREPRISE, phone: '+261341112223', entrepriseSiret: 'MT-0001', avatar: '/fitiavana.jpg' },
        { username: 'claire', email: 'claire.beta@beta-sas.mg', fullName: 'Claire Beta', role: client_1.Role.ENTREPRISE, phone: '+261330000002', entrepriseSiret: 'BETA-0002', avatar: '/rijade.png' },
        { username: 'aina.admin', email: 'aina.randria@dgf.mg', fullName: 'Aina Randria', role: client_1.Role.ADMIN_FISCAL, phone: '+261341234567', avatar: '/tsiaro.png' },
    ];
    const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);
    for (const u of users) {
        const entrepriseId = u.entrepriseSiret ? entrepriseBySiret[u.entrepriseSiret] : undefined;
        await prisma.user.upsert({
            where: { username: u.username },
            update: {
                email: u.email,
                fullName: u.fullName,
                phone: u.phone,
                avatar: u.avatar,
                role: u.role,
                isActive: true,
                entrepriseId: entrepriseId ?? null,
            },
            create: {
                username: u.username,
                email: u.email,
                password: hashedPassword,
                fullName: u.fullName,
                phone: u.phone,
                avatar: u.avatar,
                role: u.role,
                isActive: true,
                entrepriseId: entrepriseId ?? null,
            },
        });
    }
    const eCount = await prisma.entreprise.count();
    const uCount = await prisma.user.count();
    console.log(`Seeded ${eCount} enterprises and users. Total users in DB: ${uCount}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map