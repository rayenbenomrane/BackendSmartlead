
import {
  PrismaClient,
  Role,
  UserStatus,
  BusinessRole,
  ProspectSource,
  ProspectStatus,
  InteractionType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('SmartLead123!', 10);

  const users = [];
  for (const user of [
    { name: 'Admin Smart Lead', email: 'admin@smartlead.tn', role: Role.ADMIN },
    { name: 'Amine Ben Salem', email: 'amine@smartlead.tn', role: Role.COMMERCIAL },
    { name: 'Sarra Trabelsi', email: 'sarra@smartlead.tn', role: Role.COMMERCIAL },
  ]) {
    users.push(
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, role: user.role, status: UserStatus.ACTIVE },
        create: { ...user, password, status: UserStatus.ACTIVE },
      }),
    );
  }

  const businesses = [];
  for (const business of [
    {
      name: 'TechNova Solutions',
      matriculeFiscale: '1234567AAM000',
      description: 'Services numériques et développement logiciel.',
      region: 'Tunis',
      serviceDomain: 'Informatique',
      phone: '+216 71 100 201',
      email: 'contact@technova.example',
      address: 'Centre Urbain Nord, Tunis',
      website: 'https://technova.example',
    },
    {
      name: 'Carthage Conseil',
      matriculeFiscale: '9876543BPM000',
      description: 'Conseil et accompagnement des PME.',
      region: 'Sousse',
      serviceDomain: 'Conseil',
      phone: '+216 73 220 310',
      email: 'contact@carthageconseil.example',
      address: 'Sahloul, Sousse',
      website: 'https://carthageconseil.example',
    },
  ]) {
    businesses.push(
      await prisma.business.upsert({
        where: { matriculeFiscale: business.matriculeFiscale },
        update: business,
        create: business,
      }),
    );
  }

  const memberships = [
    { userId: users[0].id, businessId: businesses[0].id, role: BusinessRole.OWNER },
    { userId: users[1].id, businessId: businesses[0].id, role: BusinessRole.MEMBER },
    { userId: users[2].id, businessId: businesses[1].id, role: BusinessRole.OWNER },
    { userId: users[0].id, businessId: businesses[1].id, role: BusinessRole.ADMIN },
  ];

  for (const membership of memberships) {
    await prisma.businessMember.upsert({
      where: {
        userId_businessId: {
          userId: membership.userId,
          businessId: membership.businessId,
        },
      },
      update: { role: membership.role },
      create: membership,
    });
  }

  const prospectData = [
    {
      businessId: businesses[0].id,
      firstName: 'Yasmine',
      lastName: 'Gharbi',
      company: 'Medina Digital',
      email: 'yasmine@medinadigital.example',
      phone: '+216 98 123 456',
      jobTitle: 'Directrice générale',
      industry: 'Services numériques',
      region: 'Tunis',
      source: ProspectSource.LINKEDIN,
      status: ProspectStatus.QUALIFIED,
      estimatedValue: 18000,
      notes: 'Intéressée par une solution CRM.',
    },
    {
      businessId: businesses[0].id,
      firstName: 'Mohamed',
      lastName: 'Khelifi',
      company: 'Atlas Industrie',
      email: 'mohamed@atlasindustrie.example',
      phone: '+216 22 456 789',
      jobTitle: 'Responsable commercial',
      industry: 'Industrie',
      region: 'Ben Arous',
      source: ProspectSource.REFERRAL,
      status: ProspectStatus.NEGOTIATION,
      estimatedValue: 32000,
      notes: 'Demande une proposition commerciale.',
    },
    {
      businessId: businesses[0].id,
      firstName: 'Ines',
      lastName: 'Mansouri',
      company: 'GreenPack Tunisie',
      email: 'ines@greenpack.example',
      phone: '+216 55 234 567',
      jobTitle: 'Gérante',
      industry: 'Emballage',
      region: 'Nabeul',
      source: ProspectSource.WEBSITE,
      status: ProspectStatus.NEW,
      estimatedValue: 9500,
      notes: 'Contact provenant du site web.',
    },
    {
      businessId: businesses[0].id,
      firstName: 'Fares',
      lastName: 'Jaziri',
      company: 'PixelCraft',
      email: 'fares@pixelcraft.example',
      phone: '+216 27 987 654',
      jobTitle: 'Fondateur',
      industry: 'Marketing digital',
      region: 'Sfax',
      source: ProspectSource.FACEBOOK,
      status: ProspectStatus.CONTACTED,
      estimatedValue: 7000,
      notes: 'Relance à prévoir.',
    },
    {
      businessId: businesses[0].id,
      firstName: 'Amira',
      lastName: 'Saidi',
      company: 'Saphir Distribution',
      email: 'amira@saphir.example',
      phone: '+216 21 654 321',
      jobTitle: 'Directrice des opérations',
      industry: 'Distribution',
      region: 'Monastir',
      source: ProspectSource.OTHER,
      status: ProspectStatus.PROPOSAL_SENT,
      estimatedValue: 24500,
      notes: 'Proposition envoyée, en attente de réponse.',
    },
    {
      businessId: businesses[1].id,
      firstName: 'Karim',
      lastName: 'Bouaziz',
      company: 'BatiPlus',
      email: 'karim@batiplus.example',
      phone: '+216 98 765 432',
      jobTitle: 'Gérant',
      industry: 'Bâtiment',
      region: 'Sousse',
      source: ProspectSource.REFERRAL,
      status: ProspectStatus.WON,
      estimatedValue: 15000,
      notes: 'Client converti après une réunion.',
    },
    {
      businessId: businesses[1].id,
      firstName: 'Nour',
      lastName: 'Haddad',
      company: 'BioTerroir',
      email: 'nour@bioterroir.example',
      phone: '+216 24 111 222',
      jobTitle: 'Responsable partenariats',
      industry: 'Agroalimentaire',
      region: 'Kairouan',
      source: ProspectSource.LINKEDIN,
      status: ProspectStatus.LOST,
      estimatedValue: 12000,
      notes: 'Projet reporté.',
    },
  ];

  const savedProspects = [];

  for (const data of prospectData) {
    const prospect = await prisma.prospect.upsert({
      where: {
        // The email is not unique in the schema, so use findFirst below instead.
        id: 'unused',
      },
      update: {},
      create: data,
    }).catch(async () => {
      const existing = await prisma.prospect.findFirst({
        where: { businessId: data.businessId, email: data.email },
      });
      return existing
        ? prisma.prospect.update({ where: { id: existing.id }, data })
        : prisma.prospect.create({ data });
    });

    savedProspects.push(prospect);
  }

  const interactions = [
    {
      email: 'yasmine@medinadigital.example',
      type: InteractionType.EMAIL,
      description: 'Présentation Smart Lead envoyée par email.',
    },
    {
      email: 'yasmine@medinadigital.example',
      type: InteractionType.REUNION,
      description: 'Réunion de découverte des besoins CRM.',
    },
    {
      email: 'yasmine@medinadigital.example',
      type: InteractionType.NOTE,
      description: 'Préparer une démonstration pour cinq commerciaux.',
    },
    {
      email: 'mohamed@atlasindustrie.example',
      type: InteractionType.REUNION,
      description: 'Discussion sur le budget et le calendrier.',
    },
    {
      email: 'mohamed@atlasindustrie.example',
      type: InteractionType.EMAIL,
      description: 'Devis et récapitulatif des besoins envoyés.',
    },
    {
      email: 'fares@pixelcraft.example',
      type: InteractionType.NOTE,
      description: 'Prévoir une relance téléphonique.',
    },
    {
      email: 'karim@batiplus.example',
      type: InteractionType.EMAIL,
      description: 'Confirmation du démarrage et des prochaines étapes.',
    },
  ];

  for (const item of interactions) {
    const prospect = savedProspects.find((p) => p.email === item.email);
    if (!prospect) continue;

    const exists = await prisma.interaction.findFirst({
      where: {
        prospectId: prospect.id,
        type: item.type,
        description: item.description,
      },
    });

    if (!exists) {
      await prisma.interaction.create({
        data: {
          prospectId: prospect.id,
          type: item.type,
          description: item.description,
        },
      });
    }
  }

  console.log('Seed completed.');
  console.log('Test users: admin@smartlead.tn, amine@smartlead.tn, sarra@smartlead.tn');
  console.log('Password for all seeded users: SmartLead123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
