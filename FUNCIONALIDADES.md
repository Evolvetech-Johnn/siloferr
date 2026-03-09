# Funcionalidades Faltantes e Pendências Técnicas

## Funcionalidades de Usuário Final
- [ ] **Recuperação de Senha**: Fluxo de "Esqueci minha senha" via e-mail.
- [ ] **Perfil de Usuário**: Possibilidade de alterar nome, e-mail e senha.
- [ ] **Histórico de Orçamentos**: Usuários logados deveriam ver seus pedidos de orçamento anteriores.
- [ ] **Busca Avançada de Produtos**: Filtros por categoria, capacidade, material, etc.
- [ ] **Comparador de Produtos**: Ferramenta para comparar especificações lado a lado.
- [ ] **Blog/Notícias**: Seção para artigos sobre agronegócio e novidades da empresa.

## Funcionalidades Administrativas (Dashboard)
- [ ] **Gestão de Usuários**: CRUD completo de usuários (Admin/Cliente).
- [ ] **Upload de Imagens**: Integração com storage (S3/Cloudinary/Uploadthing) para imagens de produtos.
- [ ] **Relatórios Avançados**: Gráficos de leads por período, produtos mais buscados, taxa de conversão.
- [ ] **Configurações do Site**: Edição de textos institucionais, banners e contatos via painel.
- [ ] **Notificações em Tempo Real**: Alertas de novos leads no painel.

## Infraestrutura e DevOps
- [ ] **Ambientes Separados**: Staging vs Production.
- [ ] **Backup Automático**: Rotinas de backup do MongoDB Atlas.
- [ ] **Monitoramento de Erros**: Integração com Sentry ou similar.
- [ ] **Testes Automatizados**: Unitários (Jest) e E2E (Playwright/Cypress).

## Segurança e Compliance
- [ ] **Política de Cookies**: Banner de consentimento e gestão de preferências.
- [ ] **Logs de Auditoria**: Registro de quem fez o que no painel administrativo.
- [ ] **Rate Limiting**: Proteção contra abuso nas rotas de API (login, contato).
