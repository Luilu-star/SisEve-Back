import z from 'zod'
import profiles from '../helpers/profiles.js';

export const registerSchema = z.object({
  nome: z.string().z.min(3, 'Nome precisa ter pelo menos 3 carateres'),
  email: z.email(),
  senha: z.string().min(8, 'Senha precisa ter pelo menos 8 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'mensagem'),
  desc: z.enum([profiles.admin, profiles.servidor, profiles.aluno]),
  key: z.string().min(3),
  admin_code: z.string().optional()

});



export const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1, 'Insira uma senha')
});