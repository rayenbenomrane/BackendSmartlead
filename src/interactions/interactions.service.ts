
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProspectsService } from '../prospects/prospects.service';
import {
  CreateInteractionDto,
  UpdateInteractionDto,
} from './interactions.dto';

@Injectable()
export class InteractionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prospects: ProspectsService,
  ) { }

  async list(
    userId: string,
    businessId: string,
    prospectId: string,
  ) {
    await this.prospects.findOwned(userId, businessId, prospectId);

    return this.prisma.interaction.findMany({
      where: { leadId: prospectId },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async create(
    userId: string,
    businessId: string,
    prospectId: string,
    dto: CreateInteractionDto,
  ) {
    await this.prospects.findOwned(userId, businessId, prospectId);

    return this.prisma.interaction.create({
      data: {
        leadId: prospectId,
        type: dto.type,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  private async find(
    userId: string,
    businessId: string,
    prospectId: string,
    id: string,
  ) {
    await this.prospects.findOwned(userId, businessId, prospectId);

    const interaction = await this.prisma.interaction.findFirst({
      where: {
        id,
        leadId: prospectId,
      },
    });

    if (!interaction) {
      throw new NotFoundException('Interaction introuvable');
    }

    return interaction;
  }

  async get(
    userId: string,
    businessId: string,
    prospectId: string,
    id: string,
  ) {
    return this.find(userId, businessId, prospectId, id);
  }

  async update(
    userId: string,
    businessId: string,
    prospectId: string,
    id: string,
    dto: UpdateInteractionDto,
  ) {
    const interaction = await this.find(
      userId,
      businessId,
      prospectId,
      id,
    );

    return this.prisma.interaction.update({
      where: { id: interaction.id },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.date !== undefined && {
          date: new Date(dto.date),
        }),
      },
    });
  }

  async remove(
    userId: string,
    businessId: string,
    prospectId: string,
    id: string,
  ) {
    const interaction = await this.find(
      userId,
      businessId,
      prospectId,
      id,
    );

    await this.prisma.interaction.delete({
      where: { id: interaction.id },
    });

    return { ok: true };
  }
}
