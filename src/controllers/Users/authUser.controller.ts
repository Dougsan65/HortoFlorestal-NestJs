import { NotFoundException, UsePipes } from '@nestjs/common';
import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma-service';
import { z } from 'zod';

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
});

type User = z.infer<typeof userSchema>;

@Controller('users')
export class AuthUser {
    constructor(private prisma: PrismaService) {}

    @Post('/login')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(userSchema))
    async login(@Body() body: User) {
        
        console.log(body);
        const { username, password } = body;
        console.log('Usuario tentanto se conectar: ', username, ' com senha: ', password)

        const user = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            console.log('Usuario nao encontrado')
            throw new NotFoundException('User not found');
        }
        if (user.password !== password) {
            console.log('Senha invalida')
            throw new NotFoundException('Invalid password/email');
        }
        console.log('Usuario conectado')
        return user;
    }
}
