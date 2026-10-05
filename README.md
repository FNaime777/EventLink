# 📱 Eventos Acadêmicos — App Mobile

Aplicativo web progressivo (PWA) para divulgação e gerenciamento de eventos acadêmicos.
Roda em **qualquer celular** (Android, iPhone, tablets) e também abre em **modo celular** dentro do navegador do PC.

## 🚀 Como usar

### Publicar (GitHub Pages, Vercel, Netlify…)
1. Suba a pasta inteira para o serviço de hospedagem
2. Acesse a URL no celular
3. Toque em **"Adicionar à tela inicial"** / **"Instalar aplicativo"**
4. Pronto — o app abre em tela cheia, com ícone próprio

### Testar no PC
Abra **`viewer.html`** no navegador — ele mostra o app dentro de uma moldura de iPhone.
- Clique em **"Modo tela cheia"** (canto superior direito) para alternar entre moldura e tela cheia
- Ou abra **`Eventlink.html`** direto para ver o app puro

## 🔑 Login de teste
- **E-mail:** `admin@eventos.com`
- **Senha:** `Admin@123`

## 📁 Arquivos

| Arquivo | Função |
|---------|--------|
| `Eventlink.html` | **App principal** — todas as telas e funcionalidades |
| `viewer.html` | Moldura de celular para visualizar no PC |
| `manifest.json` | Metadados do PWA (nome, ícone, cor) |
| `sw.js` | Service Worker (funciona offline) |
| `icon.svg` | Ícone do app |
| `index.html` | Redireciona para o viewer |

## ✨ Funcionalidades
- Login / cadastro com validação de senha forte
- Busca com filtros (categoria, cidade, estado)
- Marcar interesse e inscrever-se em eventos
- Notificações de e-mail (confirmação + lembrete)
- Painel administrativo: CRUD de eventos e usuários
- Permissões: admin, aluno, palestrante, comum
- Perfil editável (nome, endereço, foto)

## 🎨 Design
- Mobile-first, responsivo para qualquer tamanho
- Tema escuro com gradientes azul/roxo
- Bottom navigation estilo app nativo
- Suporte a `env(safe-area-inset-*)` (iPhone notch)

## 📄 Licença
Projeto acadêmico — uso livre para fins educacionais.
