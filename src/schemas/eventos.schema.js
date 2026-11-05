const { z } = require('zod');

const criarEventoSchema = z.object({
  body: z.object({
    nome: z.string().trim().min(3, 'Nome deve ter no minimo 3 caracteres').max(45),
    categoria: z.string().trim().min(2, 'Categoria e obrigatoria').max(45),
    local: z.string().trim().min(2, 'Local e obrigatorio').max(45),
    descricao: z.string().trim().max(1000).optional().nullable(),
    capacidade: z.number().int().positive('Capacidade deve ser maior que zero'),
    horario: z.string().trim().min(1, 'Horario e obrigatorio').max(45),
    data: z.string().trim().min(1, 'Data e obrigatoria').max(45),
    statusEvent: z.boolean().optional().default(true)
  })
});

const updateEventoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser numerico').transform(Number)
  }),
  body: z.object({
    nome: z.string().trim().min(3).max(45).optional(),
    categoria: z.string().trim().min(2).max(45).optional(),
    local: z.string().trim().min(2).max(45).optional(),
    descricao: z.string().trim().max(1000).optional().nullable(),
    capacidade: z.number().int().positive().optional(),
    horario: z.string().trim().min(1).max(45).optional(),
    data: z.string().trim().min(1).max(45).optional(),
    statusEvent: z.boolean().optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar'
  })
});

const idEventoParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID deve ser numerico').transform(Number)
  })
});

const filtroEventoSchema = z.object({
  query: z.object({
    nome: z.string().trim().optional(),
    categoria: z.string().trim().optional(),
    data: z.string().trim().optional()
  })
});

module.exports = {
  criarEventoSchema,
  updateEventoSchema,
  idEventoParamSchema,
  filtroEventoSchema
};