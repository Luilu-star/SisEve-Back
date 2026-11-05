const { z } = require('zod');
const { ROLES_LISTA, ROLES } = require('../constants/roles');

const registrarSchema = z.object({
  body: z.object({
    nome: z.string().trim().min(3, 'Nome deve ter no minimo 3 caracteres').max(45),
    email: z.string().trim().toLowerCase().email('E-mail invalido').max(90),
    senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres').max(100),
    cpf: z.string().trim().regex(/^\d{11}$/, 'CPF deve ter exatamente 11 digitos numericos'),
    desc: z.enum(ROLES_LISTA, {
      errorMap: () => ({ message: 'Perfil invalido. Use: ' + ROLES_LISTA.join(', ') })
    }),
    key: z.string().trim().min(1, 'Chave de identificacao obrigatoria').max(45),
    isActive: z.boolean().optional().default(true),
    adminCode: z.string().optional()
  }).refine((data) => {
    if (data.desc === ROLES.ADMIN && (!data.adminCode || data.adminCode.trim() === '')) {
      return false;
    }
    return true;
  }, {
    message: 'adminCode e obrigatorio para cadastro de admin',
    path: ['adminCode']
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('E-mail invalido'),
    senha: z.string().min(1, 'Senha e obrigatoria')
  })
});

const buscaEmailSchema = z.object({
  query: z.object({
    email: z.string().trim().toLowerCase().email('E-mail invalido')
  })
});

const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser numerico').transform(Number)
  })
});

module.exports = {
  registrarSchema,
  loginSchema,
  buscaEmailSchema,
  idParamSchema
};