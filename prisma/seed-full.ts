/**
 * Seed complet Smart Lead — données réalistes (contexte tunisien, montants en TND).
 *
 *   npx ts-node prisma/seed-full.ts
 *   RESET=true npx ts-node prisma/seed-full.ts    # vide d'abord prospects + interactions
 *   SKIP_SCORES=true ...                          # ne pré-calcule pas les scores IA
 *
 * - Compatible avec votre seed.ts : mêmes utilisateurs / entreprises / 7 premiers prospects (pas de doublons).
 * - Idempotent : relançable sans créer de doublons (ids déterministes + upsert).
 * - Dates relatives à aujourd'hui : le dashboard montre toujours des relances et des prospects "chauds".
 * - Domaines d'email en ".example" (jamais de vrais emails). Mot de passe de tous les comptes : SmartLead123!
 */
import {
  BusinessRole, InteractionType, Prisma, PrismaClient, ProspectSource, ProspectStatus, Role, UserStatus,
} from '@prisma/client';
import type { Business, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const prisma = new PrismaClient();
const RESET = process.env.RESET === 'true';
const SKIP_SCORES = process.env.SKIP_SCORES === 'true';

// ───────────────────────── utilitaires ─────────────────────────
const detId = (key: string) => {
  const h = createHash('sha1').update(key).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
function rng(seed: number) {            // mulberry32 : aléatoire déterministe
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rnd = () => number;
const pick = <T,>(r: Rnd, a: readonly T[]): T => a[Math.floor(r() * a.length)];
const between = (r: Rnd, a: number, b: number) => Math.round(a + r() * (b - a));
const fmtMoney = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ') + ' TND';
const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');

const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
function dateAgo(days: number, hour: number, minute: number): Date {
  let d = new Date(startOfToday.getTime() - days * 86_400_000 + hour * 3_600_000 + minute * 60_000);
  if (d.getTime() > Date.now()) d = new Date(d.getTime() - 86_400_000);
  return d;
}

// ───────────────────────── scoring (identique au backend) ─────────────────────────
interface Inter { date: Date; type: InteractionType }
const STATUS_POINTS: Record<string, number> = { NEW: 5, CONTACTED: 10, QUALIFIED: 18, NEGOTIATION: 22, PROPOSAL_SENT: 25 };
function baseScore(p: { status: string; estimatedValue: number; email: string; phone: string; jobTitle: string; industry: string; region: string }, its: Inter[]) {
  if (p.status === 'WON') return { score: 100, level: 'HOT', breakdown: { status: 100 } };
  if (p.status === 'LOST') return { score: 0, level: 'COLD', breakdown: { status: 0 } };
  const v = p.estimatedValue;
  const budget = v <= 0 ? 0 : v < 5_000 ? 5 : v < 20_000 ? 12 : v < 50_000 ? 18 : 25;
  const status = STATUS_POINTS[p.status] ?? 0;
  const meetings = its.filter((i) => i.type === 'REUNION').length;
  const engagement = Math.min(its.length, 6) * 3 + Math.min(meetings, 2) * 5;
  const last = its.length ? Math.max(...its.map((i) => i.date.getTime())) : null;
  const age = last === null ? Infinity : (Date.now() - last) / 86_400_000;
  const recency = age <= 3 ? 15 : age <= 7 ? 10 : age <= 14 ? 5 : age <= 30 ? 2 : 0;
  const completeness = [p.email, p.phone, p.jobTitle, p.industry, p.region].filter(Boolean).length * 2;
  const breakdown = { budget, status, engagement, recency, completeness };
  const score = Math.max(0, Math.min(100, Object.values(breakdown).reduce((a, n) => a + n, 0)));
  return { score, level: score >= 70 ? 'HOT' : score >= 40 ? 'WARM' : 'COLD', breakdown };
}

// ───────────────────────── données de base ─────────────────────────
const USERS = [
  { name: 'Admin Smart Lead', email: 'admin@smartlead.tn', role: Role.ADMIN, status: UserStatus.ACTIVE },
  { name: 'Amine Ben Salem', email: 'amine@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Sarra Trabelsi', email: 'sarra@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Walid Mejri', email: 'walid@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Rim Chaabane', email: 'rim@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Hatem Zouari', email: 'hatem@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Salma Dridi', email: 'salma@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.ACTIVE },
  { name: 'Oussama Ferchichi', email: 'oussama@smartlead.tn', role: Role.COMMERCIAL, status: UserStatus.INACTIVE },
];

const BUSINESSES = [
  { name: 'TechNova Solutions', matriculeFiscale: '1234567AAM000', description: 'Services numériques et développement logiciel : CRM, ERP et cybersécurité pour les PME.', region: 'Tunis', serviceDomain: 'Informatique', phone: '+216 71 100 201', email: 'contact@technova.example', address: 'Centre Urbain Nord, Tunis', website: 'https://technova.example', offer: 'la plateforme CRM et l’intégration ERP' },
  { name: 'Carthage Conseil', matriculeFiscale: '9876543BPM000', description: 'Conseil et accompagnement des PME : stratégie, organisation et performance commerciale.', region: 'Sousse', serviceDomain: 'Conseil', phone: '+216 73 220 310', email: 'contact@carthageconseil.example', address: 'Sahloul, Sousse', website: 'https://carthageconseil.example', offer: 'l’accompagnement stratégique et l’audit organisationnel' },
  { name: 'Sahara Énergie Solaire', matriculeFiscale: '2468135CAM000', description: 'Études, installation et maintenance de centrales photovoltaïques pour l’industrie, l’hôtellerie et l’agriculture.', region: 'Gabès', serviceDomain: 'Énergies renouvelables', phone: '+216 75 270 450', email: 'contact@saharasolaire.example', address: 'Zone industrielle Gabès Sud', website: 'https://saharasolaire.example', offer: 'l’installation d’une centrale photovoltaïque en autoconsommation' },
  { name: 'MedTrans Logistique', matriculeFiscale: '1357924DAM000', description: 'Transport routier, entreposage et chaîne du froid pour les exportateurs tunisiens.', region: 'Sfax', serviceDomain: 'Transport et logistique', phone: '+216 74 300 780', email: 'contact@medtrans.example', address: 'Route de Tunis km 8, Sfax', website: 'https://medtrans.example', offer: 'notre offre de transport et d’entreposage sous température dirigée' },
  { name: 'Académie Horizon Formation', matriculeFiscale: '8642097EAM000', description: 'Organisme de formation professionnelle : management, vente, langues et outils numériques.', region: 'Nabeul', serviceDomain: 'Formation professionnelle', phone: '+216 72 285 640', email: 'contact@academiehorizon.example', address: 'Avenue Habib Bourguiba, Nabeul', website: 'https://academiehorizon.example', offer: 'nos programmes de formation continue sur mesure' },
];

// [user, business, role]
const MEMBERSHIPS: [number, number, BusinessRole][] = [
  [0, 0, 'OWNER'], [1, 0, 'MEMBER'], [3, 0, 'MEMBER'], [4, 0, 'ADMIN'],
  [2, 1, 'OWNER'], [0, 1, 'ADMIN'], [5, 1, 'MEMBER'],
  [3, 2, 'OWNER'], [6, 2, 'MEMBER'], [1, 2, 'MEMBER'],
  [4, 3, 'OWNER'], [5, 3, 'ADMIN'], [2, 3, 'MEMBER'],
  [6, 4, 'OWNER'], [7, 4, 'MEMBER'], [0, 4, 'ADMIN'],
];

type Row = [number, string, string, string, string, string, string, keyof typeof ProspectSource, keyof typeof ProspectStatus, number];
// [business, prénom, nom, société, poste, secteur, région, source, statut, valeur TND]
const PROSPECTS: Row[] = [
  // TechNova Solutions
  [0, 'Yasmine', 'Gharbi', 'Medina Digital', 'Directrice générale', 'Services numériques', 'Tunis', 'LINKEDIN', 'QUALIFIED', 18000],
  [0, 'Mohamed', 'Khelifi', 'Atlas Industrie', 'Responsable commercial', 'Industrie', 'Ben Arous', 'REFERRAL', 'NEGOTIATION', 32000],
  [0, 'Ines', 'Mansouri', 'GreenPack Tunisie', 'Gérante', 'Emballage', 'Nabeul', 'WEBSITE', 'NEW', 9500],
  [0, 'Fares', 'Jaziri', 'PixelCraft', 'Fondateur', 'Marketing digital', 'Sfax', 'FACEBOOK', 'CONTACTED', 7000],
  [0, 'Amira', 'Saidi', 'Saphir Distribution', 'Directrice des opérations', 'Distribution', 'Monastir', 'OTHER', 'PROPOSAL_SENT', 24500],
  [0, 'Walid', 'Karray', 'Mutuelle Assur Plus', 'Directeur des systèmes d’information', 'Assurance', 'Tunis', 'REFERRAL', 'NEGOTIATION', 68000],
  [0, 'Rim', 'Belhaj', 'Cap Bon Agrumes', 'Directrice financière', 'Agroalimentaire', 'Nabeul', 'WEBSITE', 'QUALIFIED', 21000],
  [0, 'Hatem', 'Naceur', 'Olivia Huiles', 'Directeur général', 'Agroalimentaire', 'Sfax', 'LINKEDIN', 'CONTACTED', 15000],
  [0, 'Salma', 'Triki', 'Médina Pharma Distribution', 'Responsable SI', 'Pharmaceutique', 'Ariana', 'LINKEDIN', 'PROPOSAL_SENT', 42000],
  [0, 'Anis', 'Ayari', 'Sfax Plast', 'Directeur industriel', 'Plasturgie', 'Sfax', 'REFERRAL', 'WON', 36000],
  [0, 'Dorra', 'Louati', 'Tunisie Textile Moderne', 'Directrice des achats', 'Textile', 'Monastir', 'OTHER', 'LOST', 28000],
  [0, 'Skander', 'Sassi', 'Oasis Hôtels & Resorts', 'Directeur informatique', 'Hôtellerie', 'Djerba', 'FACEBOOK', 'NEW', 30000],
  [0, 'Emna', 'Chebbi', 'Kairouan Céramiques', 'Gérante', 'Artisanat', 'Kairouan', 'WEBSITE', 'CONTACTED', 6000],
  // Carthage Conseil
  [1, 'Karim', 'Bouaziz', 'BatiPlus', 'Gérant', 'Bâtiment', 'Sousse', 'REFERRAL', 'WON', 15000],
  [1, 'Nour', 'Haddad', 'BioTerroir', 'Responsable partenariats', 'Agroalimentaire', 'Kairouan', 'LINKEDIN', 'LOST', 12000],
  [1, 'Slim', 'Ben Ammar', 'Delta Mécanique', 'PDG', 'Mécanique', 'Sousse', 'REFERRAL', 'NEGOTIATION', 26000],
  [1, 'Chaima', 'Dridi', 'Les Jardins de Hammamet', 'Directrice', 'Tourisme', 'Hammamet', 'WEBSITE', 'QUALIFIED', 14000],
  [1, 'Mehdi', 'Zouari', 'Sahel Emballages', 'Directeur général', 'Emballage', 'Sousse', 'LINKEDIN', 'PROPOSAL_SENT', 19500],
  [1, 'Ghada', 'Mejri', 'Clinique Les Oliviers', 'Directrice administrative', 'Santé', 'Sousse', 'REFERRAL', 'CONTACTED', 17000],
  [1, 'Aymen', 'Chaabane', 'Univers Meubles', 'Gérant', 'Ameublement', 'Monastir', 'FACEBOOK', 'NEW', 8000],
  [1, 'Syrine', 'Ferchichi', 'Argan Cosmétiques', 'Fondatrice', 'Cosmétique', 'Tunis', 'LINKEDIN', 'QUALIFIED', 11000],
  [1, 'Zied', 'Hamdi', 'Transport Hamdi & Fils', 'Gérant', 'Transport', 'Sfax', 'OTHER', 'LOST', 9000],
  [1, 'Nadia', 'Rezgui', 'Maison Lumière Éditions', 'Directrice', 'Édition', 'Tunis', 'WEBSITE', 'WON', 7500],
  [1, 'Haythem', 'Gharsalli', 'Méditerranée Conserves', 'Directeur général', 'Agroalimentaire', 'Bizerte', 'REFERRAL', 'NEGOTIATION', 34000],
  [1, 'Lamia', 'Cherif', 'Cabinet Cherif & Associés', 'Associée', 'Services juridiques', 'Sousse', 'LINKEDIN', 'CONTACTED', 5500],
  // Sahara Énergie Solaire
  [2, 'Ramzi', 'Bouzid', 'Ferme Tozeur Dattes', 'Directeur', 'Agriculture', 'Tozeur', 'REFERRAL', 'NEGOTIATION', 85000],
  [2, 'Meriem', 'Tlili', 'Hôtel Les Dunes Douz', 'Directrice', 'Hôtellerie', 'Kébili', 'WEBSITE', 'QUALIFIED', 120000],
  [2, 'Bilel', 'Abid', 'Gabès Chimie Services', 'Responsable maintenance', 'Chimie', 'Gabès', 'LINKEDIN', 'CONTACTED', 150000],
  [2, 'Hela', 'Gasmi', 'Source Saharienne Eaux Minérales', 'Directrice générale', 'Agroalimentaire', 'Gafsa', 'REFERRAL', 'PROPOSAL_SENT', 95000],
  [2, 'Oussama', 'Khemiri', 'Cimenterie du Sud', 'Directeur énergie', 'Matériaux', 'Gabès', 'OTHER', 'NEW', 300000],
  [2, 'Sonia', 'Mrad', 'Coopérative Agricole El Wafa', 'Présidente', 'Agriculture', 'Sidi Bouzid', 'FACEBOOK', 'QUALIFIED', 40000],
  [2, 'Marwen', 'Kefi', 'Groupe Scolaire Ibn Khaldoun', 'Directeur', 'Éducation', 'Médenine', 'WEBSITE', 'WON', 28000],
  [2, 'Asma', 'Bargaoui', 'Station de Dessalement de Zarzis', 'Ingénieure en chef', 'Eau', 'Médenine', 'LINKEDIN', 'NEGOTIATION', 110000],
  [2, 'Fedi', 'Oueslati', 'Entrepôts Frigorifiques du Sud', 'Gérant', 'Logistique du froid', 'Sfax', 'REFERRAL', 'LOST', 65000],
  [2, 'Rania', 'Ghanmi', 'Résidence Étudiante Campus Sud', 'Gestionnaire', 'Immobilier', 'Sfax', 'WEBSITE', 'CONTACTED', 22000],
  [2, 'Taher', 'Mabrouk', 'Huilerie Moderne de Zarzis', 'Gérant', 'Agroalimentaire', 'Médenine', 'OTHER', 'WON', 31000],
  [2, 'Imen', 'Slimani', 'Complexe Sportif Gabès Sud', 'Directrice', 'Sport et loisirs', 'Gabès', 'FACEBOOK', 'NEW', 18000],
  // MedTrans Logistique
  [3, 'Jawher', 'Bechir', 'Exportis Textile', 'Responsable export', 'Textile', 'Monastir', 'LINKEDIN', 'NEGOTIATION', 54000],
  [3, 'Sabrine', 'Henchiri', 'Distri-Fresh', 'Directrice supply chain', 'Distribution alimentaire', 'Tunis', 'REFERRAL', 'QUALIFIED', 72000],
  [3, 'Nizar', 'Amri', 'Pièces Auto Tunisie', 'Directeur des achats', 'Automobile', 'Sfax', 'WEBSITE', 'PROPOSAL_SENT', 48000],
  [3, 'Wafa', 'Bennour', 'Pharma Chaîne Froid', 'Directrice générale', 'Pharmaceutique', 'Ben Arous', 'LINKEDIN', 'CONTACTED', 60000],
  [3, 'Lotfi', 'Marzouki', 'Électro Maghreb', 'Responsable logistique', 'Électroménager', 'Sousse', 'OTHER', 'WON', 39000],
  [3, 'Houda', 'Selmi', 'E-Shop Tunisie', 'Cofondatrice', 'E-commerce', 'Tunis', 'FACEBOOK', 'NEW', 16000],
  [3, 'Achraf', 'Brahmi', 'Câblage Auto Nord', 'Directeur d’usine', 'Équipementier automobile', 'Bizerte', 'REFERRAL', 'NEGOTIATION', 92000],
  [3, 'Mouna', 'Jemmali', 'Poterie du Cap Bon', 'Gérante', 'Artisanat', 'Nabeul', 'WEBSITE', 'LOST', 4500],
  [3, 'Seif', 'Dhaouadi', 'Maghreb Pneus', 'Directeur commercial', 'Distribution', 'Sfax', 'LINKEDIN', 'QUALIFIED', 33000],
  [3, 'Yosra', 'Kacem', 'Fruits du Sahel Export', 'Responsable export', 'Agroalimentaire', 'Sousse', 'REFERRAL', 'PROPOSAL_SENT', 41000],
  [3, 'Anouar', 'Rekik', 'Matériaux de Construction Rekik', 'Gérant', 'Bâtiment', 'Bizerte', 'OTHER', 'CONTACTED', 26000],
  [3, 'Leila', 'Ben Youssef', 'Distribution Papeterie Centrale', 'Gérante', 'Commerce de gros', 'Tunis', 'WEBSITE', 'NEW', 12000],
  // Académie Horizon Formation
  [4, 'Hichem', 'Baccouche', 'Groupe Hôtelier Soleil Levant', 'Directeur des ressources humaines', 'Hôtellerie', 'Hammamet', 'REFERRAL', 'NEGOTIATION', 38000],
  [4, 'Ons', 'Mhiri', 'Voxtunis Centre d’Appels', 'Responsable formation', 'Centres d’appels', 'Tunis', 'LINKEDIN', 'QUALIFIED', 45000],
  [4, 'Marouene', 'Ellouze', 'Nabeul Tech Électronique', 'Directeur des ressources humaines', 'Électronique', 'Nabeul', 'WEBSITE', 'PROPOSAL_SENT', 29000],
  [4, 'Ahlem', 'Zaafouri', 'Laboratoires Salammbô Pharma', 'Directrice des ressources humaines', 'Pharmaceutique', 'Ariana', 'REFERRAL', 'WON', 52000],
  [4, 'Moez', 'Ghribi', 'Assurances Carthago', 'Responsable formation', 'Assurance', 'Tunis', 'LINKEDIN', 'CONTACTED', 35000],
  [4, 'Selma', 'Ouali', 'Association des Jeunes Entrepreneurs', 'Présidente', 'Association', 'Tunis', 'OTHER', 'NEW', 6000],
  [4, 'Bechir', 'Amamou', 'Compagnie de Transport du Cap Bon', 'Directeur général', 'Transport', 'Nabeul', 'FACEBOOK', 'LOST', 14000],
  [4, 'Rihab', 'Maaloul', 'Kodex Studio', 'Directrice générale', 'Technologie', 'Tunis', 'LINKEDIN', 'WON', 18500],
  [4, 'Fathi', 'Lahmar', 'Briqueterie Moderne de Mahdia', 'Directeur', 'Matériaux', 'Mahdia', 'OTHER', 'CONTACTED', 12500],
  [4, 'Takoua', 'Sfar', 'École Privée Les Lauriers', 'Directrice', 'Éducation', 'Sousse', 'WEBSITE', 'QUALIFIED', 16000],
  [4, 'Adel', 'Saïdane', 'Domaine Les Collines de Mornag', 'Gérant', 'Agroalimentaire', 'Ben Arous', 'REFERRAL', 'NEGOTIATION', 23000],
  [4, 'Cyrine', 'Hajji', 'Hajji & Co Architecture', 'Associée', 'Architecture', 'Tunis', 'LINKEDIN', 'PROPOSAL_SENT', 13500],
];

// ───────────────────────── scénarios d'interactions ─────────────────────────
const KIND_TYPE: Record<string, InteractionType> = {
  lead_note: 'NOTE', call_note: 'NOTE', needs_note: 'NOTE', objection_note: 'NOTE', reminder_note: 'NOTE', kickoff_note: 'NOTE', lost_note: 'NOTE',
  first_email: 'EMAIL', followup_email: 'EMAIL', proposal_email: 'EMAIL', signature_email: 'EMAIL',
  discovery_meeting: 'REUNION', demo_meeting: 'REUNION', negotiation_meeting: 'REUNION',
};
const TEXTS: Record<string, string[]> = {
  lead_note: [
    'Prospect identifié via {source}. {company} ({industry}) correspond à notre cible ; premier contact à planifier avec {first} ({job}).',
    'Lead qualifié : secteur {industry}, région {region}. À contacter en priorité cette semaine.',
    'Demande d’information reçue de {first} {last} ({job}) au sujet de {offer}.',
  ],
  first_email: [
    'Email de présentation envoyé à {first} : proposition d’un rendez-vous de 20 minutes pour présenter {offer}.',
    'Premier email personnalisé envoyé avec une présentation de la société {biz} et des références clients dans le secteur {industry}.',
    'Prise de contact par email avec {first} : rappel du contexte {dco} et proposition de créneaux mardi ou jeudi.',
  ],
  followup_email: [
    'Relance par email : {first} n’avait pas répondu, nouvelle proposition de créneaux la semaine prochaine.',
    'Relance envoyée avec une étude de cas du secteur {industry} ; {first} promet de revenir vers nous.',
  ],
  call_note: [
    'Appel de 10 minutes avec {first} : intérêt confirmé, demande une présentation détaillée. Disponible la semaine prochaine.',
    'Appel téléphonique : {first} est en déplacement, rappel convenu en fin de semaine.',
  ],
  discovery_meeting: [
    'Réunion de découverte (visio, 45 min) avec {first} {last} : cadrage des besoins {dco}, enjeux principaux et contraintes de calendrier.',
    'Rendez-vous chez {company} : visite des locaux et recueil des besoins avec {first} et deux collaborateurs.',
    'Entretien de qualification avec {first} : projet confirmé, budget évoqué autour de {budget}.',
  ],
  needs_note: [
    'Besoins identifiés : gain de temps, meilleure visibilité et fiabilité des opérations. Budget annoncé autour de {budget}. Décision attendue sous un mois.',
    'Décideur confirmé : {first} valide avec la direction. Critères de choix : prix, délai de mise en œuvre, accompagnement local.',
  ],
  demo_meeting: [
    'Présentation de la solution devant l’équipe {dco} (5 participants). Retours positifs, questions sur la compatibilité avec leurs outils actuels.',
    'Atelier de présentation de {offer} : {first} demande une adaptation au contexte {dco} et un chiffrage détaillé.',
  ],
  proposal_email: [
    'Proposition commerciale envoyée à {first} pour {budget} HT, valable 30 jours, avec planning de mise en œuvre.',
    'Devis détaillé et conditions de paiement (30 % à la commande) transmis à {first}.',
  ],
  negotiation_meeting: [
    'Réunion de négociation avec {first} : discussion sur le prix et les modalités. {company} demande une remise de 10 % et un paiement échelonné.',
    'Point commercial avec la direction {dco} : validation du périmètre et ajustement du calendrier de déploiement.',
  ],
  objection_note: [
    'Objection principale : budget serré cette année. Piste : phaser le projet en deux étapes pour étaler l’investissement.',
    '{first} compare avec un concurrent ; insister sur notre accompagnement local et le support en français et en arabe.',
  ],
  reminder_note: [
    'Relance à prévoir : proposition sans réponse depuis plusieurs jours, appeler {first} en début de semaine.',
    'À rappeler : {first} a demandé de reprendre contact après validation interne du budget.',
  ],
  signature_email: [
    'Bon de commande signé reçu de {first} : démarrage confirmé avec {company} pour {budget}.',
    'Contrat signé et premier acompte réglé. Remerciements envoyés à {first} et planning de démarrage partagé.',
  ],
  kickoff_note: [
    'Réunion de lancement planifiée avec l’équipe {dco}. Client à suivre pour une extension du périmètre dans 6 mois.',
    'Client converti. Demander un témoignage et une recommandation d’ici deux mois.',
  ],
  lost_note: [
    'Opportunité perdue : {company} a choisi un concurrent moins cher. Garder le contact pour un prochain appel d’offres.',
    'Projet reporté par {company} faute de budget. Relancer au prochain trimestre.',
    'Prospect injoignable après plusieurs relances, dossier clôturé.',
  ],
};
const NOTES: Record<string, string[]> = {
  NEW: ['Contact récent à qualifier. Intérêt probable pour {offer}.', 'Lead entrant, aucun échange approfondi pour le moment.'],
  CONTACTED: ['Premier échange réalisé, en attente d’un retour de {first}.', 'Relance à prévoir sous une semaine.'],
  QUALIFIED: ['Besoin confirmé, budget estimé à {budget}. Démonstration à organiser.', 'Décideur identifié, projet à court terme.'],
  NEGOTIATION: ['Négociation en cours sur le prix et le calendrier. Bonne probabilité de closing.', 'Compare avec un concurrent : insister sur le support local.'],
  PROPOSAL_SENT: ['Proposition envoyée, en attente de réponse {dco}.', 'Devis transmis ; relance prévue sans retour sous 7 jours.'],
  WON: ['Client converti, contrat signé pour {budget}.', 'Projet lancé. Potentiel d’extension à moyen terme.'],
  LOST: ['Opportunité perdue (concurrence tarifaire).', 'Projet reporté, à recontacter dans 12 mois.'],
};
const SOURCE_LABEL: Record<string, string> = { LINKEDIN: 'LinkedIn', FACEBOOK: 'Facebook', WEBSITE: 'le site web', REFERRAL: 'une recommandation', OTHER: 'un salon professionnel' };

// statut -> [scénario, [début min, début max] en jours, [fin min, fin max]]
const PLAN: Record<string, { kinds: (r: Rnd) => string[]; start: [number, number]; end: [number, number] }> = {
  NEW: { kinds: (r) => (r() < 0.7 ? ['lead_note'] : []), start: [1, 12], end: [1, 12] },
  CONTACTED: { kinds: (r) => ['lead_note', 'first_email', r() < 0.5 ? 'followup_email' : 'call_note'], start: [12, 35], end: [1, 18] },
  QUALIFIED: { kinds: () => ['lead_note', 'first_email', 'discovery_meeting', 'needs_note'], start: [25, 60], end: [1, 14] },
  NEGOTIATION: { kinds: () => ['lead_note', 'first_email', 'discovery_meeting', 'needs_note', 'demo_meeting', 'proposal_email', 'negotiation_meeting', 'objection_note'], start: [45, 100], end: [0, 10] },
  PROPOSAL_SENT: { kinds: () => ['lead_note', 'first_email', 'discovery_meeting', 'needs_note', 'demo_meeting', 'proposal_email', 'reminder_note'], start: [35, 80], end: [2, 16] },
  WON: { kinds: () => ['lead_note', 'first_email', 'discovery_meeting', 'demo_meeting', 'proposal_email', 'negotiation_meeting', 'signature_email', 'kickoff_note'], start: [80, 170], end: [8, 60] },
  LOST: { kinds: () => ['lead_note', 'first_email', 'discovery_meeting', 'proposal_email', 'objection_note', 'lost_note'], start: [60, 150], end: [10, 70] },
};

// ───────────────────────── exécution ─────────────────────────
async function main() {
  console.log('→ Seed complet…');
  const password = await bcrypt.hash('SmartLead123!', 10);

  if (RESET) {
    const d = await prisma.prospect.deleteMany();
    console.log(`  RESET : ${d.count} prospects supprimés (interactions en cascade)`);
  }

  const users: User[] = [];
  for (const u of USERS) {
    users.push(await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, status: u.status },
      create: { ...u, password },
    }));
  }

  const businesses: Business[] = [];
  for (const { offer: _offer, ...b } of BUSINESSES) {
    businesses.push(await prisma.business.upsert({ where: { matriculeFiscale: b.matriculeFiscale }, update: b, create: b }));
  }

  for (const [u, b, role] of MEMBERSHIPS) {
    await prisma.businessMember.upsert({
      where: { userId_businessId: { userId: users[u].id, businessId: businesses[b].id } },
      update: { role },
      create: { userId: users[u].id, businessId: businesses[b].id, role },
    });
  }

  let nProspects = 0;
  let nInteractions = 0;
  const now = new Date();

  for (let idx = 0; idx < PROSPECTS.length; idx++) {
    const [bIdx, first, last, company, jobTitle, industry, region, source, status, value] = PROSPECTS[idx];
    const r = rng(1000 + idx);
    const biz = BUSINESSES[bIdx];
    const cSlug = slug(company);
    const email = `${slug(first)}.${slug(last)}@${cSlug}.example`;
    const phone = `+216 ${pick(r, ['20', '22', '23', '25', '27', '29', '50', '52', '54', '55', '58', '90', '93', '95', '97', '98', '99'])} ${between(r, 100, 999)} ${between(r, 100, 999)}`;

    const dco = /^[AEIOUÉÈÂÎÔÛHaeiou]/.test(company) ? `d’${company}` : `de ${company}`;
    const vars = { dco, first, last, company, job: jobTitle, industry, region, offer: biz.offer, biz: biz.name, source: SOURCE_LABEL[source], budget: fmtMoney(value) };

    // interactions
    const plan = PLAN[status];
    const kinds = plan.kinds(r);
    const start = between(r, ...plan.start);
    const end = Math.min(between(r, ...plan.end), start);
    const interactions = kinds.map((k, i) => {
      const day = kinds.length <= 1 ? start : start - ((start - end) * i) / (kinds.length - 1);
      return {
        type: KIND_TYPE[k],
        description: fill(pick(r, TEXTS[k]), vars),
        date: dateAgo(Math.round(day), 9 + (i % 8), between(r, 0, 59)),
      };
    });
    const createdAt = interactions.length
      ? new Date(interactions[0].date.getTime() - between(r, 0, 3) * 86_400_000)
      : dateAgo(start, 10, between(r, 0, 59));

    // existe déjà (créé par seed.ts) ? on réutilise l'id
    const existing = await prisma.prospect.findFirst({
      where: { businessId: businesses[bIdx].id, firstName: first, lastName: last, company },
      select: { id: true },
    });
    const id = existing?.id ?? detId(`${biz.matriculeFiscale}:${email}`);

    const data: Prisma.ProspectUncheckedCreateInput = {
      businessId: businesses[bIdx].id,
      firstName: first, lastName: last, company, email, phone, jobTitle, industry, region,
      website: `https://www.${cSlug}.example`,
      source: ProspectSource[source],
      status: ProspectStatus[status],
      estimatedValue: value,
      notes: fill(pick(r, NOTES[status]), vars),
      createdAt,
    };

    if (!SKIP_SCORES) {
      const s = baseScore({ status, estimatedValue: value, email, phone, jobTitle, industry, region }, interactions);
      data.score = s.score;
      data.aiScoreDetails = { source: 'rules', ...s, baseScore: s.score, adjustment: 0, reasons: [] } as Prisma.InputJsonValue;
      data.aiUpdatedAt = now;
    }

    await prisma.prospect.upsert({ where: { id }, update: data, create: { id, ...data } });

    // interactions : on remplace celles du prospect pour rester idempotent
    await prisma.interaction.deleteMany({ where: { prospectId: id } });
    if (interactions.length) {
      await prisma.interaction.createMany({
        data: interactions.map((it, i) => ({ id: detId(`${id}:int:${i}`), prospectId: id, ...it })),
      });
    }
    nProspects++;
    nInteractions += interactions.length;
  }

  const byStatus = await prisma.prospect.groupBy({ by: ['status'], _count: { _all: true } });
  console.log(`✔ ${users.length} utilisateurs · ${businesses.length} entreprises · ${MEMBERSHIPS.length} adhésions`);
  console.log(`✔ ${nProspects} prospects · ${nInteractions} interactions`);
  console.log('  Répartition :', byStatus.map((s) => `${s.status}=${s._count._all}`).join(', '));
  console.log('Comptes : admin@smartlead.tn, amine@, sarra@, walid@, rim@, hatem@, salma@ (+ oussama@ INACTIF) — mot de passe : SmartLead123!');
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());