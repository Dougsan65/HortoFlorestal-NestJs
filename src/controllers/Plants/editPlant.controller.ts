import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Put,
    UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma-service';
import { z } from 'zod';

const userSchema = z.object({
    id: z.number(),
    nome: z.string(),
    especie: z.string(),
    descricao: z.string(),
    img_url: z.string(),
    localizacao: z.string(),
    floracao: z.string(),
    curiosidades: z.string(),
    cuidados: z.string(),
    rega: z.string()
});

type Planta = z.infer<typeof userSchema>;

@Controller('/plants')
export class editPlant {
    constructor(private prisma: PrismaService) {}

    @Put('/editPlant')
    @ApiTags('Plants')
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(userSchema))
    async editPlant(@Body() body: Planta) {
        const { id, nome, especie, descricao, img_url, localizacao, floracao, curiosidades, cuidados, rega } = body;
        try {
            // Encontrar a planta no banco de dados pelo nome, id ou outra identificação única
            const plantaExistente = await this.prisma.planta.findUnique({
                where: {
                    id: id // ou outra condição para identificar a planta
                }
            });

            // Verificar se a planta existe
            if (!plantaExistente) {
                throw new BadRequestException('Planta não encontrada');
            }

            // Atualizar os campos da planta com os novos valores
            const plantaAtualizada = await this.prisma.planta.update({
                where: {
                    id: plantaExistente.id // ou outra condição para identificar a planta
                },
                data: {
                    nome,
                    especie,
                    descricao,
                    img_url,
                    cuidados,
                    curiosidades,
                    floracao,
                    rega
                }
            });

            return plantaAtualizada;
        } catch (error) {
            throw new BadRequestException('Erro ao editar planta');
        }
    }
}
