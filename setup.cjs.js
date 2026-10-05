#!/usr/bin/env node
/**
 * setup.cjs — Gera o aplicativo completo "Eventos Acadêmicos"
 *
 * USO:
 *   1. Crie uma pasta vazia (ex.: eventos-app)
 *   2. Salve este arquivo como setup.cjs dentro dela
 *   3. Rode:  node setup.cjs
 *   4. Abra http://localhost:9999 e clique em "Baixar projeto"
 *
 * O QUE ELE GERA:
 *   • Eventlink.html        — app completo, responsivo, PWA instalável
 *   • viewer.html           — abre o app DENTRO de uma moldura de celular no PC
 *   • manifest.json         — metadados PWA (nome, ícone, cor)
 *   • sw.js                 — service worker (funciona offline)
 *   • icon.svg              — ícone do app (SVG, escalável)
 *   • README.md             — instruções
 *   • .gitignore
 *   • index.html            — redireciona para viewer.html
 *
 * NÃO REQUER npm install, Python, nem nenhuma dependência externa.
 */

const http = require('http');
const path = require('path');
const fs   = require('fs');
const os   = require('os');
const zlib = require('zlib');

const PORT = 9999;
const ROOT = __dirname;
const OUT  = path.join(ROOT, 'eventos-academicos-app.zip');

// ═══════════════════════════════════════════════════════════════════════════
// CONTEÚDO DOS ARQUIVOS
// ═══════════════════════════════════════════════════════════════════════════
const FILES = {};

// ─────────────────────────────────────────────────────────────────────────
// Eventlink.html — APP COMPLETO
// ─────────────────────────────────────────────────────────────────────────
FILES['Eventlink.html'] = String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#0F172A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Eventos">
<meta name="mobile-web-app-capable" content="yes">
<title>Eventos Acadêmicos</title>
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon.svg">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
:root{
  --bg-900:#0a0e1a; --bg-800:#0f172a; --bg-700:#1a2340; --bg-600:#1e293b;
  --bg-card:#131c33;
  --border:rgba(148,163,184,.12); --border-strong:rgba(148,163,184,.25);
  --text:#f1f5f9; --text-dim:#94a3b8; --text-mute:#64748b;
  --accent:#3b82f6; --accent-hover:#2563eb; --accent-glow:rgba(59,130,246,.35);
  --success:#10b981; --danger:#ef4444; --warning:#f59e0b;
  --safe-top:env(safe-area-inset-top,0px);
  --safe-bottom:env(safe-area-inset-bottom,0px);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{height:100%;overscroll-behavior:none}
body{
  min-height:100%;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  background:var(--bg-900);color:var(--text);line-height:1.55;
  overflow-x:hidden;-webkit-font-smoothing:antialiased;
  overscroll-behavior-y:none;
}
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(circle at 15% 10%, rgba(59,130,246,.18), transparent 40%),
    radial-gradient(circle at 85% 90%, rgba(139,92,246,.12), transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(15,23,42,.4), transparent 70%);
}
.app{
  position:relative;z-index:1;
  width:100%;max-width:520px;margin:0 auto;min-height:100vh;
  display:flex;flex-direction:column;
  padding:calc(0px + var(--safe-top)) 18px calc(96px + var(--safe-bottom));
}

/* ───── SPLASH ───── */
.splash{
  min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  padding:32px 20px calc(32px + var(--safe-bottom));
  max-width:520px;margin:0 auto;position:relative;z-index:1;
}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:44px}
.brand-logo{
  width:44px;height:44px;border-radius:12px;
  background:linear-gradient(135deg,var(--accent),#8b5cf6);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 24px var(--accent-glow);flex-shrink:0;
}
.brand-logo i{color:#fff;font-size:20px}
.brand-text .eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text-mute)}
.brand-text h1{font-size:16px;font-weight:800;color:var(--text);letter-spacing:-.01em}
.hero{margin-bottom:32px}
.hero h2{
  font-size:clamp(30px,9vw,40px);font-weight:900;line-height:1.05;
  letter-spacing:-.03em;margin-bottom:16px;
  background:linear-gradient(180deg,#fff 0%,#cbd5e1 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
}
.hero h2 em{
  font-style:normal;
  background:linear-gradient(90deg,var(--accent),#8b5cf6);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
}
.hero p{color:var(--text-dim);font-size:14.5px;line-height:1.65;max-width:400px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px}
.stat{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:14px 8px;text-align:center}
.stat i{color:var(--accent);font-size:15px;margin-bottom:6px;display:block}
.stat .num{font-size:19px;font-weight:800;color:var(--text);letter-spacing:-.02em;line-height:1}
.stat .lbl{font-size:9.5px;color:var(--text-mute);font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
.auth-card{
  background:linear-gradient(180deg,rgba(30,41,59,.7),rgba(15,23,42,.9));
  border:1px solid var(--border);border-radius:24px;padding:8px;margin-bottom:20px;
  backdrop-filter:blur(12px);box-shadow:0 20px 60px -20px rgba(0,0,0,.6);
}
.auth-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;background:rgba(10,14,26,.6);padding:4px;border-radius:18px;margin-bottom:8px}
.auth-tab{
  background:transparent;border:none;color:var(--text-dim);padding:12px;border-radius:14px;
  font-weight:700;font-size:14px;cursor:pointer;transition:.2s;font-family:inherit;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.auth-tab.active{background:linear-gradient(135deg,#fff,#e2e8f0);color:#0f172a;box-shadow:0 4px 12px rgba(0,0,0,.3)}
.auth-body{padding:20px 16px 16px}
.field{margin-bottom:14px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.field .input-wrap{position:relative}
.field input,.field select{
  width:100%;background:rgba(15,23,42,.6);border:1.5px solid var(--border);border-radius:14px;
  padding:14px 16px;color:var(--text);font-size:16px;font-family:inherit;transition:.2s;
}
.field input::placeholder{color:var(--text-mute)}
.field input:focus,.field select:focus{outline:none;border-color:var(--accent);background:rgba(15,23,42,.9);box-shadow:0 0 0 4px var(--accent-glow)}
.field .eye{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--text-mute);cursor:pointer;font-size:15px;padding:4px}
.btn-primary{
  width:100%;background:linear-gradient(135deg,var(--accent),var(--accent-hover));color:#fff;
  border:none;border-radius:16px;padding:16px;font-size:15px;font-weight:700;font-family:inherit;
  cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:10px;
  box-shadow:0 10px 30px -10px var(--accent-glow);
}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 14px 36px -10px var(--accent-glow)}
.btn-primary:active{transform:translateY(0)}
.auth-footer{text-align:center;font-size:12px;color:var(--text-mute);padding:14px 0 4px;margin-top:8px;border-top:1px solid var(--border)}
.auth-footer a{color:var(--accent);text-decoration:none;font-weight:600;cursor:pointer}
.splash-footer{text-align:center;font-size:11px;color:var(--text-mute);margin-top:24px}

/* ───── SHELL ───── */
.shell{display:none;min-height:100vh;flex-direction:column}
.shell.active{display:flex}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 0 20px}
.topbar-user{display:flex;align-items:center;gap:10px;cursor:pointer;min-width:0}
.avatar{
  width:40px;height:40px;border-radius:12px;
  background:linear-gradient(135deg,var(--accent),#8b5cf6);
  display:flex;align-items:center;justify-content:center;color:#fff;
  font-weight:800;font-size:15px;flex-shrink:0;overflow:hidden;
}
.avatar img{width:100%;height:100%;object-fit:cover}
.topbar-user .u-info{display:flex;flex-direction:column;line-height:1.2;min-width:0}
.topbar-user .u-greet{font-size:11px;color:var(--text-mute);font-weight:600;text-transform:uppercase;letter-spacing:.08em}
.topbar-user .u-name{font-size:15px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.topbar-actions{display:flex;gap:8px;flex-shrink:0}
.icon-btn{
  width:40px;height:40px;border-radius:12px;background:var(--bg-card);
  border:1px solid var(--border);color:var(--text-dim);cursor:pointer;
  display:flex;align-items:center;justify-content:center;position:relative;font-size:15px;
}
.icon-btn:hover{background:var(--bg-700);color:var(--text)}
.icon-btn .dot{position:absolute;top:8px;right:8px;width:8px;height:8px;border-radius:50%;background:var(--danger);border:2px solid var(--bg-card)}
.tab-strip{display:flex;gap:6px;overflow-x:auto;padding-bottom:12px;margin-bottom:8px;scrollbar-width:none}
.tab-strip::-webkit-scrollbar{display:none}
.tab-pill{
  background:var(--bg-card);border:1px solid var(--border);color:var(--text-dim);
  padding:9px 16px;border-radius:20px;font-size:12.5px;font-weight:700;
  cursor:pointer;white-space:nowrap;transition:.2s;font-family:inherit;
  display:flex;align-items:center;gap:6px;
}
.tab-pill.active{background:linear-gradient(135deg,var(--accent),var(--accent-hover));color:#fff;border-color:transparent;box-shadow:0 6px 18px -6px var(--accent-glow)}

/* ───── SEÇÕES ───── */
.section-head{margin-bottom:16px}
.section-head h3{font-size:22px;font-weight:800;letter-spacing:-.02em;color:var(--text);margin-bottom:4px}
.section-head p{font-size:13px;color:var(--text-mute)}

.search-panel{background:var(--bg-card);border:1px solid var(--border);border-radius:24px;padding:20px;margin-bottom:24px}
.search-panel .sp-head{display:flex;align-items:center;gap:10px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid var(--border);font-weight:700;font-size:14px;color:var(--text)}
.search-panel .sp-head i{color:var(--accent)}
.sp-grid{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:16px}
.sp-field label{display:block;font-size:10px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.sp-field select,.sp-field input{width:100%;background:rgba(15,23,42,.6);border:1.5px solid var(--border);border-radius:12px;padding:12px 14px;color:var(--text);font-size:14px;font-family:inherit}
.sp-field select:focus,.sp-field input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
.sp-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn-ghost{background:var(--bg-700);border:1px solid var(--border);color:var(--text-dim);padding:13px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-ghost:hover{background:var(--bg-600);color:var(--text)}

/* ───── EVENTOS ───── */
.events-grid{display:flex;flex-direction:column;gap:14px}
.event-card{background:var(--bg-card);border:1px solid var(--border);border-radius:24px;overflow:hidden;transition:.25s}
.event-card:hover{border-color:var(--border-strong);transform:translateY(-2px);box-shadow:0 20px 40px -20px rgba(0,0,0,.5)}
.ev-head{padding:18px;background:linear-gradient(135deg,rgba(59,130,246,.12),rgba(139,92,246,.08));border-bottom:1px solid var(--border)}
.ev-type-badge{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:4px 10px;border-radius:8px;background:rgba(59,130,246,.2);color:#93c5fd;border:1px solid rgba(59,130,246,.3);display:inline-flex;align-items:center;gap:5px}
.ev-title{font-size:16px;font-weight:800;color:var(--text);line-height:1.3;margin:10px 0 6px;letter-spacing:-.01em}
.ev-city{font-size:12.5px;color:var(--text-dim);display:flex;align-items:center;gap:6px}
.ev-city i{color:var(--accent);font-size:11px}
.ev-body{padding:16px 18px 18px}
.ev-meta{display:flex;flex-wrap:wrap;gap:10px 16px;margin-bottom:14px}
.ev-meta-item{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--text-dim)}
.ev-meta-item i{color:var(--accent);font-size:11px;width:14px;text-align:center}
.ev-desc{font-size:13px;color:var(--text-dim);line-height:1.6;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.ev-actions{display:flex;flex-direction:column;gap:8px}
.btn-int{width:100%;background:rgba(16,185,129,.15);border:1.5px solid rgba(16,185,129,.35);color:#6ee7b7;padding:12px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-int:hover{background:rgba(16,185,129,.25)}
.btn-int.active{background:var(--success);color:#fff;border-color:transparent}
.btn-sub{width:100%;background:linear-gradient(135deg,var(--accent),var(--accent-hover));border:none;color:#fff;padding:12px;border-radius:12px;font-weight:700;font-size:13px;font-family:inherit;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 8px 20px -8px var(--accent-glow)}
.btn-sub.active{background:linear-gradient(135deg,#dc2626,#ef4444);box-shadow:none}
.btn-link{width:100%;background:transparent;border:1.5px dashed var(--border-strong);color:var(--text-dim);padding:11px;border-radius:12px;font-weight:600;font-size:12.5px;font-family:inherit;text-decoration:none;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;transition:.2s}
.btn-link:hover{border-color:var(--accent);color:var(--accent)}
.admin-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;padding-top:12px;border-top:1px dashed var(--border)}
.btn-admin{background:rgba(15,23,42,.6);border:1px solid var(--border);color:var(--text-dim);padding:10px;border-radius:10px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:6px}
.btn-admin:hover{background:var(--bg-700);color:var(--text)}
.btn-admin.danger{color:#fca5a5}
.btn-admin.danger:hover{background:rgba(239,68,68,.15);color:#fecaca}

.empty{text-align:center;padding:48px 20px;color:var(--text-mute);font-size:14px}
.empty i{font-size:42px;color:var(--bg-600);margin-bottom:14px;display:block}

/* ───── FORM ───── */
.form-card{background:var(--bg-card);border:1px solid var(--border);border-radius:24px;padding:22px}
.form-card h4{font-size:17px;font-weight:800;color:var(--text);margin-bottom:18px;display:flex;align-items:center;gap:10px}
.form-card h4 i{color:var(--accent)}
.fg{margin-bottom:14px}
.fg label{display:block;font-size:11px;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px}
.fg input,.fg select,.fg textarea{width:100%;background:rgba(15,23,42,.6);border:1.5px solid var(--border);border-radius:12px;padding:13px 15px;color:var(--text);font-size:15px;font-family:inherit;transition:.2s;resize:vertical}
.fg input:focus,.fg select:focus,.fg textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
.fg-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}

/* ───── USERS ───── */
.users-list{display:flex;flex-direction:column;gap:10px}
.user-row{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:10px}
.ur-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.ur-id{display:flex;align-items:center;gap:10px;min-width:0}
.ur-name{font-size:14px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ur-email{font-size:11.5px;color:var(--text-mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ur-role{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;padding:3px 8px;border-radius:6px;white-space:nowrap}
.ur-role.admin{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.3)}
.ur-role.user{background:rgba(100,116,139,.15);color:#94a3b8;border:1px solid rgba(100,116,139,.3)}
.ur-info{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:10px;border-top:1px solid var(--border)}
.ur-info-item{display:flex;flex-direction:column;gap:3px}
.ur-info-item .lbl{font-size:9px;color:var(--text-mute);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.ur-info-item .val{font-size:12.5px;color:var(--text-dim);display:flex;align-items:center;gap:6px}
.ur-info-item .val .eye{cursor:pointer;color:var(--text-mute);font-size:11px}
.ur-select{background:rgba(15,23,42,.6);border:1px solid var(--border);color:var(--text-dim);padding:6px 10px;border-radius:8px;font-size:11.5px;font-family:inherit;cursor:pointer}
.ur-actions{display:flex;flex-wrap:wrap;gap:6px;padding-top:10px;border-top:1px solid var(--border)}

/* ───── BOTTOM NAV ───── */
.bottom-nav{
  position:fixed;bottom:0;left:50%;transform:translateX(-50%);
  width:100%;max-width:520px;
  background:rgba(15,23,42,.92);backdrop-filter:blur(20px);
  border-top:1px solid var(--border);
  padding:10px 12px calc(14px + var(--safe-bottom));
  display:none;justify-content:space-around;z-index:100;
}
.bottom-nav.active{display:flex}
.bn-item{flex:1;background:none;border:none;color:var(--text-mute);cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 4px;border-radius:12px;transition:.2s}
.bn-item i{font-size:17px}
.bn-item span{font-size:10px;font-weight:700;letter-spacing:.02em}
.bn-item.active{color:var(--accent)}
.bn-item.active i{transform:scale(1.1)}

/* ───── MODAL ───── */
.modal{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:2000;display:none;align-items:flex-end;justify-content:center}
.modal.active{display:flex}
.modal-card{background:var(--bg-800);border:1px solid var(--border);border-radius:24px 24px 0 0;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:24px 20px calc(32px + var(--safe-bottom));animation:slideUp .25s cubic-bezier(.2,.8,.2,1)}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-grab{width:40px;height:4px;border-radius:2px;background:var(--border-strong);margin:0 auto 18px}
.modal-title{font-size:19px;font-weight:800;color:var(--text);margin-bottom:6px;display:flex;align-items:center;gap:10px}
.modal-title i{color:var(--accent)}
.modal-sub{font-size:13px;color:var(--text-mute);margin-bottom:20px}
.modal-actions{display:flex;flex-direction:column;gap:8px;margin-top:20px}

.toast{position:fixed;top:calc(20px + var(--safe-top));left:50%;transform:translate(-50%,-120%);background:var(--bg-card);border:1px solid var(--border-strong);border-radius:14px;padding:14px 18px;color:var(--text);font-size:13.5px;font-weight:600;box-shadow:0 20px 40px -10px rgba(0,0,0,.6);z-index:3000;transition:transform .3s cubic-bezier(.2,.8,.2,1);max-width:90%;display:flex;align-items:center;gap:10px}
.toast.active{transform:translate(-50%,0)}
.toast i{color:var(--accent);font-size:15px}
.toast.success i{color:var(--success)}
.toast.error i{color:var(--danger)}

.profile-photo-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:24px;gap:12px}
.profile-photo{width:96px;height:96px;border-radius:24px;background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:34px;overflow:hidden;box-shadow:0 12px 30px -10px var(--accent-glow)}
.profile-photo img{width:100%;height:100%;object-fit:cover}
.photo-btn{background:var(--bg-700);border:1px solid var(--border);color:var(--text-dim);padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:.2s;display:flex;align-items:center;gap:6px}
.photo-btn:hover{background:var(--bg-600);color:var(--text)}

.notif-list{display:flex;flex-direction:column;gap:8px}
.notif-item{background:var(--bg-700);border:1px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;transition:.2s}
.notif-item:hover{border-color:var(--accent)}
.notif-item.unread{background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(139,92,246,.05));border-color:rgba(59,130,246,.3)}
.notif-item .n-title{font-size:13.5px;font-weight:700;color:var(--text);margin-bottom:3px}
.notif-item .n-body{font-size:12px;color:var(--text-dim);line-height:1.5}
.notif-item .n-time{font-size:10.5px;color:var(--text-mute);margin-top:6px;text-transform:uppercase;letter-spacing:.05em}

@media (min-width:540px){
  .sp-grid{grid-template-columns:1fr 1fr 1fr}
}
</style>
</head>
<body>

<div class="splash" id="splashScreen">
  <div class="brand">
    <div class="brand-logo"><i class="fas fa-calendar-check"></i></div>
    <div class="brand-text">
      <div class="eyebrow">Plataforma</div>
      <h1>Eventos Acadêmicos</h1>
    </div>
  </div>
  <div class="hero">
    <h2>Aprenda.<br>Conecte-se.<br><em>Cresça.</em></h2>
    <p>Acesse congressos, cursos, palestras e seminários acadêmicos. Inscreva-se e receba alertas por e-mail.</p>
  </div>
  <div class="stats">
    <div class="stat"><i class="fas fa-calendar"></i><div class="num">50+</div><div class="lbl">Eventos</div></div>
    <div class="stat"><i class="fas fa-users"></i><div class="num">2k+</div><div class="lbl">Alunos</div></div>
    <div class="stat"><i class="fas fa-star"></i><div class="num">4.9</div><div class="lbl">Avaliação</div></div>
  </div>
  <div class="auth-card">
    <div class="auth-tabs">
      <button class="auth-tab active" id="tabLogin" onclick="switchAuthTab('login')"><i class="fas fa-sign-in-alt"></i> Entrar</button>
      <button class="auth-tab" id="tabReg" onclick="switchAuthTab('reg')"><i class="fas fa-user-plus"></i> Cadastrar</button>
    </div>
    <div class="auth-body">
      <form id="splashLoginForm">
        <div class="field"><label>E-mail</label><input type="email" id="splLoginEmail" placeholder="seu@email.com" required autocomplete="email"></div>
        <div class="field"><label>Senha</label>
          <div class="input-wrap">
            <input type="password" id="splLoginPass" placeholder="••••••••" required autocomplete="current-password">
            <i class="fas fa-eye eye" onclick="togglePass('splLoginPass', this)"></i>
          </div>
        </div>
        <button type="submit" class="btn-primary">Entrar <i class="fas fa-arrow-right"></i></button>
      </form>
      <form id="splashRegForm" style="display:none">
        <div class="field"><label>Nome completo</label><input type="text" id="splRegName" placeholder="Como quer ser chamado" required autocomplete="name"></div>
        <div class="field"><label>E-mail</label><input type="email" id="splRegEmail" placeholder="seu@email.com" required autocomplete="email"></div>
        <div class="field"><label>Tipo de usuário</label>
          <select id="splRegTipo">
            <option value="usuario">Usuário comum</option>
            <option value="aluno">Aluno</option>
            <option value="palestrante">Palestrante</option>
          </select>
        </div>
        <div class="field"><label>Senha (mín. 8, maiúscula, especial)</label>
          <div class="input-wrap">
            <input type="password" id="splRegPass" placeholder="••••••••" required autocomplete="new-password">
            <i class="fas fa-eye eye" onclick="togglePass('splRegPass', this)"></i>
          </div>
        </div>
        <button type="submit" class="btn-primary">Criar conta <i class="fas fa-arrow-right"></i></button>
      </form>
      <div class="auth-footer">Ao continuar, você aceita os <a onclick="showToast('Termos de uso aceitos.')">Termos</a> e a <a onclick="showToast('Política aceita.')">Política</a>.</div>
    </div>
  </div>
  <div class="splash-footer">© 2026 Eventos Acadêmicos</div>
</div>

<div class="shell app" id="appShell">
  <div class="topbar">
    <div class="topbar-user" onclick="openModal('profileModal')">
      <div class="avatar" id="topAvatar">A</div>
      <div class="u-info">
        <div class="u-greet" id="topGreet">Bem-vindo</div>
        <div class="u-name" id="topName">Usuário</div>
      </div>
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" onclick="openModal('notifModal')" title="Notificações"><i class="fas fa-bell"></i><span class="dot" id="notifDot" style="display:none"></span></button>
      <button class="icon-btn" onclick="logout()" title="Sair"><i class="fas fa-sign-out-alt"></i></button>
    </div>
  </div>
  <div class="tab-strip" id="tabStrip"></div>
  <div id="tabContent" style="flex:1"></div>
</div>

<nav class="bottom-nav" id="bottomNav">
  <button class="bn-item" data-tab="busca" onclick="switchTab('busca')"><i class="fas fa-search"></i><span>Buscar</span></button>
  <button class="bn-item" data-tab="eventos" onclick="switchTab('eventos')"><i class="fas fa-calendar"></i><span>Eventos</span></button>
  <button class="bn-item" data-tab="meusInteresses" id="bnInteresses" onclick="switchTab('meusInteresses')"><i class="fas fa-heart"></i><span>Interesses</span></button>
  <button class="bn-item" data-tab="gerenciarEventos" id="bnAdminEv" onclick="switchTab('gerenciarEventos')" style="display:none"><i class="fas fa-tasks"></i><span>Gerenciar</span></button>
  <button class="bn-item" data-tab="gerenciarUsuarios" id="bnAdminUsr" onclick="switchTab('gerenciarUsuarios')" style="display:none"><i class="fas fa-users-cog"></i><span>Usuários</span></button>
  <button class="bn-item" data-tab="criarEvento" id="bnCriar" onclick="switchTab('criarEvento')" style="display:none"><i class="fas fa-plus-circle"></i><span>Criar</span></button>
</nav>

<div class="modal" id="profileModal"><div class="modal-card">
  <div class="modal-grab"></div>
  <div class="modal-title"><i class="fas fa-user-circle"></i> Meu Perfil</div>
  <div class="modal-sub">Atualize seus dados pessoais</div>
  <div class="profile-photo-wrap">
    <div class="profile-photo" id="profilePhotoBig">A</div>
    <label class="photo-btn"><i class="fas fa-camera"></i> Alterar foto
      <input type="file" id="photoInput" accept="image/*" style="display:none" onchange="handlePhoto(event)">
    </label>
  </div>
  <div class="fg"><label>Nome</label><input type="text" id="pfName"></div>
  <div class="fg"><label>Endereço</label><input type="text" id="pfAddress" placeholder="Cidade, Estado"></div>
  <div class="modal-actions">
    <button class="btn-primary" onclick="saveProfile()"><i class="fas fa-save"></i> Salvar alterações</button>
    <button class="btn-ghost" onclick="closeModal('profileModal')">Fechar</button>
  </div>
</div></div>

<div class="modal" id="notifModal"><div class="modal-card">
  <div class="modal-grab"></div>
  <div class="modal-title"><i class="fas fa-bell"></i> Notificações</div>
  <div class="modal-sub" id="notifSub">Seus alertas aparecem aqui</div>
  <div class="notif-list" id="notifList"></div>
  <div class="modal-actions">
    <button class="btn-ghost" onclick="markAllRead()"><i class="fas fa-check-double"></i> Marcar todas como lidas</button>
    <button class="btn-ghost" onclick="closeModal('notifModal')">Fechar</button>
  </div>
</div></div>

<div class="modal" id="emailModal"><div class="modal-card">
  <div class="modal-grab"></div>
  <div class="modal-title"><i class="fas fa-envelope-open-text"></i> <span id="emailTitle">E-mail</span></div>
  <div class="modal-sub" id="emailTo">Para: usuário@email.com</div>
  <div style="background:rgba(15,23,42,.6);border-radius:14px;padding:18px;margin-bottom:8px;border:1px solid var(--border)">
    <div id="emailBody" style="font-size:13.5px;color:var(--text-dim);line-height:1.75;white-space:pre-line"></div>
  </div>
  <div class="modal-actions"><button class="btn-primary" onclick="closeModal('emailModal')"><i class="fas fa-check"></i> Entendi</button></div>
</div></div>

<div class="toast" id="toast"><i class="fas fa-check-circle" id="toastIcon"></i><span id="toastText">Mensagem</span></div>

<script>
/* ═══ DADOS ═══ */
let events = JSON.parse(localStorage.getItem('events')) || [
  {id:1,title:"Congresso Internacional de IA",type:"congresso",date:"15/04/2026",time:"09h-18h",location:"Centro de Convenções",city:"São Paulo",state:"SP",description:"Maior congresso de Inteligência Artificial da América Latina, com palestrantes internacionais.",speaker:"Vários palestrantes",link:"https://exemplo.com/congresso-ia",inscritos:[]},
  {id:2,title:"Palestra: Marketing Digital",type:"palestra",date:"20/04/2026",time:"19h",location:"Auditório Central",city:"Rio de Janeiro",state:"RJ",description:"Estratégias atuais de marketing digital aplicadas ao mercado brasileiro.",speaker:"Carlos Mendes",link:"https://exemplo.com/marketing",inscritos:[]},
  {id:3,title:"Seminário de Liderança",type:"seminario",date:"25/04/2026",time:"14h",location:"Hotel Premium",city:"Belo Horizonte",state:"MG",description:"Desenvolvimento de habilidades de liderança para gestores e futuros líderes.",speaker:"Mariana Ribeiro",link:"",inscritos:[]},
  {id:4,title:"Curso de Python Avançado",type:"curso",date:"02/05/2026",time:"08h-12h",location:"Laboratório de Informática",city:"Brasília",state:"DF",description:"Programação avançada em Python para profissionais de dados.",speaker:"Equipe Dev",link:"https://exemplo.com/python",inscritos:[]}
];
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
let notifications = {};

if (!usuarios.some(u => u.email === "admin@eventos.com")) {
  usuarios.push({id:1,nome:"Administrador",email:"admin@eventos.com",senha:"Admin@123",role:"admin",tipo:"admin",podeCriarEventos:true,interesses:[],inscricoes:[],endereco:"",foto:""});
}

function saveUsers(){localStorage.setItem('usuarios',JSON.stringify(usuarios));}
function saveEvents(){localStorage.setItem('events',JSON.stringify(events));}
function saveNotifs(){if(currentUser)localStorage.setItem('notifications_'+currentUser.id,JSON.stringify(notifications));}
function loadNotifs(){notifications=currentUser?(JSON.parse(localStorage.getItem('notifications_'+currentUser.id))||{}):{};}

function isStrongPassword(p){return /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(p);}
function togglePass(id,icon){const f=document.getElementById(id);if(f.type==='password'){f.type='text';icon.classList.replace('fa-eye','fa-eye-slash');}else{f.type='password';icon.classList.replace('fa-eye-slash','fa-eye');}}
function getTypeIcon(t){return {palestra:'fa-microphone',seminario:'fa-chart-bar',curso:'fa-book',congresso:'fa-landmark'}[t]||'fa-calendar';}
function getTypeName(t){return {palestra:'Palestra',seminario:'Seminário',curso:'Curso',congresso:'Congresso'}[t]||t;}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function initials(n){return String(n||'U').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}

let toastTimer;
function showToast(text,type='success'){
  const t=document.getElementById('toast'),i=document.getElementById('toastIcon');
  document.getElementById('toastText').innerText=text;
  t.className='toast '+type;
  i.className='fas '+(type==='error'?'fa-exclamation-circle':type==='success'?'fa-check-circle':'fa-info-circle');
  t.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('active'),3000);
}
function openModal(id){if(id==='profileModal')loadProfileForm();if(id==='notifModal'){loadNotifs();renderNotifList();}document.getElementById(id).classList.add('active');}
function closeModal(id){document.getElementById(id).classList.remove('active');}

function switchAuthTab(tab){
  document.getElementById('tabLogin').classList.toggle('active',tab==='login');
  document.getElementById('tabReg').classList.toggle('active',tab==='reg');
  document.getElementById('splashLoginForm').style.display=tab==='login'?'block':'none';
  document.getElementById('splashRegForm').style.display=tab==='reg'?'block':'none';
}
document.getElementById('splashLoginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const em=document.getElementById('splLoginEmail').value.trim();
  const ps=document.getElementById('splLoginPass').value;
  const u=usuarios.find(x=>x.email===em&&x.senha===ps);
  if(!u){showToast('E-mail ou senha incorretos','error');return;}
  loginSuccess(u);
});
document.getElementById('splashRegForm').addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('splRegName').value.trim();
  const email=document.getElementById('splRegEmail').value.trim();
  const tipo=document.getElementById('splRegTipo').value;
  const pass=document.getElementById('splRegPass').value;
  if(!isStrongPassword(pass)){showToast('Senha fraca: 8+ chars, 1 maiúscula, 1 especial','error');return;}
  if(usuarios.some(u=>u.email===email)){showToast('E-mail já cadastrado','error');return;}
  const novo={id:Date.now(),nome,email,senha:pass,role:'user',tipo,podeCriarEventos:false,interesses:[],inscricoes:[],endereco:'',foto:''};
  usuarios.push(novo);saveUsers();
  showToast('Conta criada! Entrando...','success');
  setTimeout(()=>loginSuccess(novo),500);
});
function loginSuccess(user){
  currentUser=user;
  sessionStorage.setItem('currentUser',JSON.stringify(user));
  loadNotifs();
  document.getElementById('splashScreen').style.display='none';
  document.getElementById('appShell').classList.add('active');
  document.getElementById('bottomNav').classList.add('active');
  showToast('Bem-vindo, '+user.nome.split(' ')[0]+'!','success');
  renderAll();
}
function logout(){
  if(!confirm('Deseja sair da conta?'))return;
  sessionStorage.removeItem('currentUser');
  currentUser=null;notifications={};
  document.getElementById('splashScreen').style.display='flex';
  document.getElementById('appShell').classList.remove('active');
  document.getElementById('bottomNav').classList.remove('active');
  document.getElementById('splashLoginForm').reset();
  document.getElementById('splashRegForm').reset();
  switchAuthTab('login');
  showToast('Você saiu da conta.','info');
}

let activeTab='busca';
function getAvailableTabs(){
  if(!currentUser)return[];
  if(currentUser.role==='admin')return['busca','eventos','gerenciarEventos','gerenciarUsuarios'];
  const t=['busca','eventos','meusInteresses'];
  if(currentUser.podeCriarEventos)t.push('criarEvento');
  return t;
}
function switchTab(t){activeTab=t;renderAll();}
function renderAll(){if(!currentUser)return;renderTopbar();renderTabStrip();renderBottomNav();renderTabContent();renderNotifBadge();}
function renderTopbar(){
  const av=document.getElementById('topAvatar');
  if(currentUser.foto)av.innerHTML='<img src="'+currentUser.foto+'" alt="">';
  else av.innerText=initials(currentUser.nome);
  const h=new Date().getHours();
  document.getElementById('topGreet').innerText=h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  document.getElementById('topName').innerText=currentUser.nome;
}
function renderTabStrip(){
  const tabs=getAvailableTabs();
  const labels={busca:{icon:'fa-search',txt:'Buscar'},eventos:{icon:'fa-calendar',txt:'Eventos'},meusInteresses:{icon:'fa-heart',txt:'Interesses'},criarEvento:{icon:'fa-plus',txt:'Criar'},gerenciarEventos:{icon:'fa-tasks',txt:'Eventos'},gerenciarUsuarios:{icon:'fa-users-cog',txt:'Usuários'}};
  document.getElementById('tabStrip').innerHTML=tabs.map(t=>'<button class="tab-pill '+(activeTab===t?'active':'')+'" onclick="switchTab(\''+t+'\')"><i class="fas '+labels[t].icon+'"></i> '+labels[t].txt+'</button>').join('');
}
function renderBottomNav(){
  document.querySelectorAll('.bn-item').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  const isAdmin=currentUser.role==='admin';
  document.getElementById('bnAdminEv').style.display=isAdmin?'flex':'none';
  document.getElementById('bnAdminUsr').style.display=isAdmin?'flex':'none';
  document.getElementById('bnInteresses').style.display=isAdmin?'none':'flex';
  document.getElementById('bnCriar').style.display=(!isAdmin&&currentUser.podeCriarEventos)?'flex':'none';
}
function renderTabContent(){
  const el=document.getElementById('tabContent');
  if(activeTab==='busca')el.innerHTML=renderBusca();
  else if(activeTab==='eventos')el.innerHTML=renderEventos();
  else if(activeTab==='meusInteresses')el.innerHTML=renderMeusInteresses();
  else if(activeTab==='criarEvento')el.innerHTML=renderCriarEvento();
  else if(activeTab==='gerenciarEventos')el.innerHTML=renderGerenciarEventos();
  else if(activeTab==='gerenciarUsuarios')el.innerHTML=renderGerenciarUsuarios();
  if(activeTab==='busca')applyFilters();
}
function renderBusca(){
  return '<div class="section-head"><h3>Encontre seu evento</h3><p>Filtre por categoria, cidade ou estado</p></div>'
    +'<div class="search-panel"><div class="sp-head"><i class="fas fa-sliders-h"></i> Filtros inteligentes</div>'
    +'<div class="sp-grid">'
    +'<div class="sp-field"><label>Categoria</label><select id="sCat"><option value="">Todas</option><option value="palestra">Palestra</option><option value="seminario">Seminário</option><option value="curso">Curso</option><option value="congresso">Congresso</option></select></div>'
    +'<div class="sp-field"><label>Cidade</label><input type="text" id="sCity" placeholder="Ex: São Paulo"></div>'
    +'<div class="sp-field"><label>Estado</label><select id="sState"><option value="">Todos</option><option value="SP">São Paulo</option><option value="RJ">Rio de Janeiro</option><option value="MG">Minas Gerais</option><option value="DF">Distrito Federal</option></select></div>'
    +'</div><div class="sp-actions"><button class="btn-ghost" onclick="clearFilters()"><i class="fas fa-undo"></i> Limpar</button><button class="btn-primary" onclick="applyFilters()"><i class="fas fa-search"></i> Buscar</button></div></div>'
    +'<div class="events-grid" id="searchResults"></div>';
}
function applyFilters(){
  const cat=(document.getElementById('sCat')||{}).value||'';
  const city=((document.getElementById('sCity')||{}).value||'').toLowerCase();
  const state=(document.getElementById('sState')||{}).value||'';
  const list=events.filter(e=>(!cat||e.type===cat)&&(!city||(e.city||'').toLowerCase().includes(city))&&(!state||e.state===state));
  const el=document.getElementById('searchResults');if(!el)return;
  el.innerHTML=list.length?list.map(renderEventCard).join(''):'<div class="empty"><i class="fas fa-search"></i>Nenhum evento encontrado</div>';
}
function clearFilters(){
  document.getElementById('sCat').value='';
  document.getElementById('sCity').value='';
  document.getElementById('sState').value='';
  applyFilters();
}
function renderEventos(){
  return '<div class="section-head"><h3>Todos os eventos</h3><p>'+events.length+' eventos disponíveis</p></div><div class="events-grid">'+events.map(renderEventCard).join('')+'</div>';
}
function renderMeusInteresses(){
  const ids=currentUser.interesses||[];
  const list=events.filter(e=>ids.includes(e.id));
  return '<div class="section-head"><h3>Meus interesses</h3><p>'+list.length+' evento(s)</p></div><div class="events-grid">'
    +(list.length?list.map(renderEventCard).join(''):'<div class="empty"><i class="fas fa-heart"></i>Você ainda não marcou nenhum evento</div>')+'</div>';
}
function renderCriarEvento(){
  return '<div class="section-head"><h3>Criar evento</h3><p>Publique um novo evento acadêmico</p></div>'
    +'<div class="form-card"><h4><i class="fas fa-plus-circle"></i> Novo evento</h4><form id="createEvForm">'
    +'<div class="fg"><label>Título</label><input id="ceTitle" required></div>'
    +'<div class="fg"><label>Tipo</label><select id="ceType"><option value="palestra">Palestra</option><option value="seminario">Seminário</option><option value="curso">Curso</option><option value="congresso">Congresso</option></select></div>'
    +'<div class="fg-row"><div class="fg"><label>Cidade</label><input id="ceCity" required></div><div class="fg"><label>Estado</label><select id="ceState"><option>SP</option><option>RJ</option><option>MG</option><option>DF</option></select></div></div>'
    +'<div class="fg-row"><div class="fg"><label>Data</label><input id="ceDate" placeholder="15/05/2026" required></div><div class="fg"><label>Horário</label><input id="ceTime" placeholder="19h" required></div></div>'
    +'<div class="fg"><label>Local</label><input id="ceLocation" required></div>'
    +'<div class="fg"><label>Palestrante</label><input id="ceSpeaker"></div>'
    +'<div class="fg"><label>Link (opcional)</label><input id="ceLink" placeholder="https://..."></div>'
    +'<div class="fg"><label>Descrição</label><textarea id="ceDesc" rows="3" required></textarea></div>'
    +'<button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Publicar evento</button></form></div>';
}
function renderGerenciarEventos(){
  return '<div class="section-head"><h3>Gerenciar eventos</h3><p>'+events.length+' evento(s)</p></div>'
    +'<button class="btn-primary" style="margin-bottom:16px" onclick="switchTab(\'criarEvento\')"><i class="fas fa-plus"></i> Criar novo evento</button>'
    +'<div class="events-grid">'+(events.length?events.map(renderEventCard).join(''):'<div class="empty"><i class="fas fa-calendar"></i>Nenhum evento</div>')+'</div>';
}
function renderGerenciarUsuarios(){
  return '<div class="section-head"><h3>Gerenciar usuários</h3><p>'+usuarios.length+' usuário(s)</p></div><div class="users-list">'+usuarios.map(renderUserRow).join('')+'</div>';
}
function renderEventCard(e){
  const hasI=(currentUser.interesses||[]).includes(e.id);
  const hasS=(currentUser.inscricoes||[]).includes(e.id);
  const subs=(e.inscritos||[]).length;
  const isA=currentUser.role==='admin';
  return '<div class="event-card"><div class="ev-head">'
    +'<span class="ev-type-badge"><i class="fas '+getTypeIcon(e.type)+'"></i> '+getTypeName(e.type)+'</span>'
    +'<div class="ev-title">'+esc(e.title)+'</div>'
    +'<div class="ev-city"><i class="fas fa-map-marker-alt"></i> '+esc(e.city)+' - '+esc(e.state)+'</div></div>'
    +'<div class="ev-body">'
    +'<div class="ev-meta"><div class="ev-meta-item"><i class="fas fa-calendar"></i> '+esc(e.date)+'</div>'
    +'<div class="ev-meta-item"><i class="fas fa-clock"></i> '+esc(e.time)+'</div>'
    +'<div class="ev-meta-item"><i class="fas fa-users"></i> '+subs+' inscrito'+(subs!==1?'s':'')+'</div></div>'
    +'<div class="ev-meta" style="margin-bottom:14px"><div class="ev-meta-item"><i class="fas fa-location-dot"></i> '+esc(e.location)+'</div></div>'
    +'<div class="ev-meta" style="margin-bottom:16px"><div class="ev-meta-item"><i class="fas fa-user"></i> '+esc(e.speaker||'Organizador')+'</div></div>'
    +'<div class="ev-desc">'+esc((e.description||'').substring(0,140))+((e.description||'').length>140?'…':'')+'</div>'
    +'<div class="ev-actions">'
    +(!isA?'<button class="btn-int '+(hasI?'active':'')+'" onclick="toggleInterest('+e.id+')"><i class="fas fa-heart"></i> '+(hasI?'Interesse marcado':'Tenho interesse')+'</button>'
      +'<button class="btn-sub '+(hasS?'active':'')+'" onclick="toggleSub('+e.id+')"><i class="fas '+(hasS?'fa-times':'fa-check')+'"></i> '+(hasS?'Cancelar inscrição':'Inscrever-se')+'</button>':'')
    +(e.link&&e.link.trim()?'<a href="'+esc(e.link)+'" target="_blank" rel="noopener" class="btn-link"><i class="fas fa-external-link-alt"></i> Acessar evento</a>':'')
    +(isA?'<div class="admin-row"><button class="btn-admin" onclick="editEvent('+e.id+')"><i class="fas fa-pen"></i> Editar</button><button class="btn-admin danger" onclick="deleteEvent('+e.id+')"><i class="fas fa-trash"></i> Excluir</button></div>':'')
    +'</div></div></div>';
}
function renderUserRow(u){
  const isMe=u.id===currentUser.id;
  const isA=u.role==='admin';
  const canEdit=!isA||!isMe;
  return '<div class="user-row"><div class="ur-head"><div class="ur-id"><div class="avatar">'+initials(u.nome)+'</div>'
    +'<div style="min-width:0"><div class="ur-name">'+esc(u.nome)+(isMe?' <span style="color:var(--accent);font-size:10px">(você)</span>':'')+'</div>'
    +'<div class="ur-email">'+esc(u.email)+'</div></div></div>'
    +'<span class="ur-role '+(isA?'admin':'user')+'">'+(isA?'👑 Admin':'👤 '+(u.tipo||'user'))+'</span></div>'
    +'<div class="ur-info"><div class="ur-info-item"><span class="lbl">Senha</span><span class="val"><span id="pass-'+u.id+'">••••••••</span><i class="fas fa-eye eye" onclick="revealPass('+u.id+',\''+esc(u.senha)+'\')"></i></span></div>'
    +'<div class="ur-info-item"><span class="lbl">Criar eventos</span><span class="val">'+(isA?'✅ Total':(u.podeCriarEventos?'✅ Liberado':'❌ Bloqueado'))+'</span></div></div>'
    +(canEdit?'<div class="ur-actions">'
      +(!isA?'<select class="ur-select" onchange="changeType('+u.id+',this.value)"><option value="usuario" '+(u.tipo==='usuario'?'selected':'')+'>Usuário</option><option value="aluno" '+(u.tipo==='aluno'?'selected':'')+'>Aluno</option><option value="palestrante" '+(u.tipo==='palestrante'?'selected':'')+'>Palestrante</option></select>'
        +'<button class="btn-admin" onclick="resetPass('+u.id+')"><i class="fas fa-key"></i> Redefinir</button>'
        +'<button class="btn-admin" onclick="togglePerm('+u.id+')"><i class="fas fa-toggle-on"></i> '+(u.podeCriarEventos?'Revogar':'Liberar')+'</button>'
        +'<button class="btn-admin danger" onclick="deleteUser('+u.id+')"><i class="fas fa-trash"></i> Excluir</button>'
        +'<button class="btn-admin" onclick="promote('+u.id+')"><i class="fas fa-crown"></i> Promover admin</button>'
      :'<button class="btn-admin" onclick="demote('+u.id+')"><i class="fas fa-arrow-down"></i> Rebaixar</button>')
      +'</div>':'')+'</div>';
}
function toggleInterest(id){
  if(!currentUser)return;
  let l=currentUser.interesses||[];
  if(l.includes(id))l=l.filter(x=>x!==id);else l.push(id);
  currentUser.interesses=l;
  const i=usuarios.findIndex(u=>u.id===currentUser.id);
  if(i!==-1)usuarios[i].interesses=l;
  saveUsers();sessionStorage.setItem('currentUser',JSON.stringify(currentUser));
  showToast(l.includes(id)?'Interesse marcado!':'Interesse removido.','success');
  renderTabContent();
}
function toggleSub(id){
  if(!currentUser)return;
  const ev=events.find(e=>e.id===id);if(!ev)return;
  currentUser.inscricoes=currentUser.inscricoes||[];
  ev.inscritos=ev.inscritos||[];
  const ja=currentUser.inscricoes.includes(id);
  if(ja){
    currentUser.inscricoes=currentUser.inscricoes.filter(x=>x!==id);
    ev.inscritos=ev.inscritos.filter(x=>x!==currentUser.id);
    showToast('Inscrição cancelada.','info');
  }else{
    currentUser.inscricoes.push(id);
    if(!ev.inscritos.includes(currentUser.id))ev.inscritos.push(currentUser.id);
    addNotification({title:'Inscrição confirmada',body:'Sua inscrição em "'+ev.title+'" foi confirmada.'});
    showToast('Inscrito com sucesso!','success');
    setTimeout(()=>addNotification({title:'Lembrete de evento',body:'O evento "'+ev.title+'" acontecerá em '+ev.date+' às '+ev.time+'.'}),4000);
  }
  const i=usuarios.findIndex(u=>u.id===currentUser.id);
  if(i!==-1)usuarios[i].inscricoes=currentUser.inscricoes;
  saveUsers();saveEvents();sessionStorage.setItem('currentUser',JSON.stringify(currentUser));
  renderTabContent();
}
function deleteEvent(id){
  if(currentUser.role!=='admin')return;
  if(!confirm('Excluir este evento?'))return;
  events=events.filter(e=>e.id!==id);saveEvents();
  showToast('Evento excluído.','info');renderTabContent();
}
function editEvent(id){
  if(currentUser.role!=='admin')return;
  const e=events.find(x=>x.id===id);if(!e)return;
  const t=prompt('Título:',e.title);if(t)e.title=t;
  const d=prompt('Descrição:',e.description);if(d)e.description=d;
  const l=prompt('Link:',e.link||'');if(l!==null)e.link=l;
  const dt=prompt('Data:',e.date);if(dt)e.date=dt;
  const tm=prompt('Horário:',e.time);if(tm)e.time=tm;
  const lc=prompt('Local:',e.location);if(lc)e.location=lc;
  saveEvents();showToast('Evento atualizado.','success');renderTabContent();
}
function revealPass(id,real){
  const el=document.getElementById('pass-'+id);if(!el)return;
  if(el.innerText==='••••••••'){el.innerText=real;setTimeout(()=>{el.innerText='••••••••';},3000);}
  else el.innerText='••••••••';
}
function changeType(id,type){const u=usuarios.find(x=>x.id===id);if(!u||u.role==='admin')return;u.tipo=type;saveUsers();showToast('Tipo alterado.','success');renderTabContent();}
function resetPass(id){const u=usuarios.find(x=>x.id===id);if(!u)return;const p=prompt('Nova senha:');if(!p)return;if(!isStrongPassword(p)){showToast('Senha fraca.','error');return;}u.senha=p;saveUsers();showToast('Senha redefinida.','success');renderTabContent();}
function togglePerm(id){const u=usuarios.find(x=>x.id===id);if(!u||u.role==='admin')return;u.podeCriarEventos=!u.podeCriarEventos;saveUsers();if(currentUser.id===id){currentUser.podeCriarEventos=u.podeCriarEventos;sessionStorage.setItem('currentUser',JSON.stringify(currentUser));renderAll();}else renderTabContent();showToast('Permissão alterada.','success');}
function promote(id){const u=usuarios.find(x=>x.id===id);if(!u)return;if(!confirm('Promover '+u.nome+' a admin?'))return;u.role='admin';u.podeCriarEventos=true;saveUsers();showToast(u.nome+' agora é admin.','success');renderTabContent();}
function demote(id){
  const u=usuarios.find(x=>x.id===id);if(!u)return;
  if(usuarios.filter(x=>x.role==='admin').length<=1){showToast('Precisa haver 1 admin.','error');return;}
  if(!confirm('Rebaixar '+u.nome+'?'))return;
  u.role='user';saveUsers();
  if(currentUser.id===id){sessionStorage.removeItem('currentUser');currentUser=null;showToast('Conta rebaixada. Faça login novamente.','info');setTimeout(()=>location.reload(),1500);}
  else{showToast(u.nome+' rebaixado.','info');renderTabContent();}
}
function deleteUser(id){
  if(currentUser.role!=='admin')return;
  if(id===currentUser.id){showToast('Você não pode se excluir.','error');return;}
  const u=usuarios.find(x=>x.id===id);if(!u)return;
  if(u.role==='admin'&&usuarios.filter(x=>x.role==='admin').length<=1){showToast('Precisa haver 1 admin.','error');return;}
  if(!confirm('Remover '+u.nome+'?'))return;
  usuarios=usuarios.filter(x=>x.id!==id);
  events.forEach(ev=>{if(Array.isArray(ev.inscritos))ev.inscritos=ev.inscritos.filter(x=>x!==id);});
  usuarios.forEach(usr=>{if(Array.isArray(usr.interesses))usr.interesses=usr.interesses.filter(x=>x!==id);});
  saveUsers();saveEvents();showToast('Usuário removido.','info');renderTabContent();
}
function loadProfileForm(){
  document.getElementById('pfName').value=currentUser.nome||'';
  document.getElementById('pfAddress').value=currentUser.endereco||'';
  const b=document.getElementById('profilePhotoBig');
  if(currentUser.foto)b.innerHTML='<img src="'+currentUser.foto+'" alt="">';
  else b.innerText=initials(currentUser.nome);
}
let pendingPhoto=null;
function handlePhoto(ev){
  const f=ev.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{pendingPhoto=e.target.result;document.getElementById('profilePhotoBig').innerHTML='<img src="'+pendingPhoto+'" alt="">';};
  r.readAsDataURL(f);
}
function saveProfile(){
  const nome=document.getElementById('pfName').value.trim();
  if(!nome){showToast('Nome não pode ficar vazio.','error');return;}
  currentUser.nome=nome;
  currentUser.endereco=document.getElementById('pfAddress').value.trim();
  if(pendingPhoto){currentUser.foto=pendingPhoto;pendingPhoto=null;}
  const i=usuarios.findIndex(u=>u.id===currentUser.id);
  if(i!==-1)usuarios[i]={...usuarios[i],...currentUser};
  saveUsers();sessionStorage.setItem('currentUser',JSON.stringify(currentUser));
  showToast('Perfil atualizado!','success');closeModal('profileModal');renderAll();
}
function addNotification({title,body}){
  const id=Date.now()+'_'+Math.random().toString(36).slice(2,7);
  notifications[id]={id,title,body,at:new Date().toISOString(),read:false};
  saveNotifs();renderNotifBadge();
}
function renderNotifBadge(){
  const u=Object.values(notifications).filter(n=>!n.read).length;
  document.getElementById('notifDot').style.display=u?'block':'none';
}
function renderNotifList(){
  const list=Object.values(notifications).sort((a,b)=>b.at.localeCompare(a.at));
  document.getElementById('notifSub').innerText=list.length?(list.length+' notificação(ões)'):'Sem notificações';
  document.getElementById('notifList').innerHTML=list.length
    ?list.map(n=>'<div class="notif-item '+(n.read?'':'unread')+'" onclick="openEmail(\''+n.id+'\')"><div class="n-title">'+esc(n.title)+'</div><div class="n-body">'+esc(n.body.substring(0,90))+(n.body.length>90?'…':'')+'</div><div class="n-time">'+new Date(n.at).toLocaleString('pt-BR')+'</div></div>').join('')
    :'<div class="empty"><i class="fas fa-bell-slash"></i>Nenhuma notificação</div>';
}
function openEmail(id){
  const n=notifications[id];if(!n)return;
  document.getElementById('emailTitle').innerText=n.title;
  document.getElementById('emailTo').innerText='Para: '+currentUser.email;
  document.getElementById('emailBody').innerText=n.body;
  n.read=true;saveNotifs();renderNotifBadge();openModal('emailModal');
}
function markAllRead(){
  Object.values(notifications).forEach(n=>n.read=true);
  saveNotifs();renderNotifBadge();renderNotifList();
  showToast('Todas marcadas como lidas.','success');
}
document.getElementById('tabContent').addEventListener('submit',e=>{
  if(e.target.id!=='createEvForm')return;
  e.preventDefault();
  if(!currentUser||(currentUser.role!=='admin'&&!currentUser.podeCriarEventos)){showToast('Sem permissão.','error');return;}
  const novo={
    id:Date.now(),
    title:document.getElementById('ceTitle').value.trim(),
    type:document.getElementById('ceType').value,
    city:document.getElementById('ceCity').value.trim(),
    state:document.getElementById('ceState').value,
    date:document.getElementById('ceDate').value.trim(),
    time:document.getElementById('ceTime').value.trim(),
    location:document.getElementById('ceLocation').value.trim(),
    speaker:document.getElementById('ceSpeaker').value.trim(),
    link:document.getElementById('ceLink').value.trim(),
    description:document.getElementById('ceDesc').value.trim(),
    inscritos:[]
  };
  if(!novo.title||!novo.city||!novo.date||!novo.time||!novo.location||!novo.description){showToast('Preencha tudo.','error');return;}
  events.push(novo);saveEvents();showToast('Evento publicado!','success');switchTab('eventos');
});

saveUsers();
if(currentUser){
  loadNotifs();
  document.getElementById('splashScreen').style.display='none';
  document.getElementById('appShell').classList.add('active');
  document.getElementById('bottomNav').classList.add('active');
  renderAll();
}else{
  document.getElementById('splashScreen').style.display='flex';
}
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});}
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────
// viewer.html — moldura de celular para PC
// ─────────────────────────────────────────────────────────────────────────
FILES['viewer.html'] = String.raw`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Eventos Acadêmicos — Preview Mobile</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  font-family:'Inter',sans-serif;min-height:100vh;
  background:
    radial-gradient(circle at 20% 10%,rgba(59,130,246,.15),transparent 40%),
    radial-gradient(circle at 80% 90%,rgba(139,92,246,.12),transparent 40%),
    #050810;
  color:#f1f5f9;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:24px;overflow-x:hidden;
}

/* Botão flutuante para alternar modo */
.mode-toggle{
  position:fixed;top:20px;right:20px;z-index:100;
  background:linear-gradient(135deg,#3b82f6,#2563eb);
  color:#fff;border:none;border-radius:14px;
  padding:12px 20px;font-family:inherit;font-size:13px;font-weight:700;
  cursor:pointer;transition:.2s;
  box-shadow:0 12px 30px -8px rgba(59,130,246,.6);
  display:flex;align-items:center;gap:8px;
}
.mode-toggle:hover{transform:translateY(-2px);box-shadow:0 16px 40px -8px rgba(59,130,246,.8)}

/* Moldura de celular */
.phone-frame{
  position:relative;width:390px;height:844px;max-height:calc(100vh - 48px);
  background:#0a0e1a;border-radius:56px;padding:14px;
  box-shadow:
    0 0 0 2px #1e293b,
    0 0 0 12px #0f172a,
    0 30px 80px -20px rgba(0,0,0,.8),
    0 0 100px -20px rgba(59,130,246,.4);
  transition:.4s cubic-bezier(.2,.8,.2,1);
}
.phone-frame::before{
  content:'';position:absolute;top:14px;left:50%;transform:translateX(-50%);
  width:130px;height:32px;background:#0a0e1a;border-radius:0 0 20px 20px;z-index:10;
}
.phone-frame::after{
  content:'';position:absolute;top:22px;left:50%;transform:translateX(-50%);
  width:8px;height:8px;background:#1e293b;border-radius:50%;z-index:11;
  box-shadow:inset 0 0 4px rgba(0,0,0,.8);
}
.phone-screen{
  width:100%;height:100%;border-radius:44px;overflow:hidden;
  background:#0a0e1a;position:relative;
}
.phone-screen iframe{
  width:100%;height:100%;border:0;display:block;
  background:#0a0e1a;
}

/* Status bar (fake, decorativo) */
.status-bar{
  position:absolute;top:0;left:0;right:0;height:44px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 32px;font-size:13px;font-weight:600;color:#fff;
  pointer-events:none;z-index:9;padding-top:10px;
}
.status-bar .sb-icons{display:flex;gap:6px;font-size:12px;align-items:center}
.status-bar .battery{
  width:22px;height:11px;border:1.5px solid #fff;border-radius:3px;
  position:relative;display:inline-block;
}
.status-bar .battery::after{
  content:'';position:absolute;right:-3px;top:50%;transform:translateY(-50%);
  width:2px;height:4px;background:#fff;border-radius:0 1px 1px 0;
}
.status-bar .battery::before{
  content:'';position:absolute;left:1px;top:1px;bottom:1px;
  width:70%;background:#fff;border-radius:1.5px;
}

/* Botão Home inferior */
.home-indicator{
  position:absolute;bottom:10px;left:50%;transform:translateX(-50%);
  width:130px;height:5px;border-radius:3px;background:rgba(255,255,255,.35);
  z-index:10;pointer-events:none;
}

/* Info lateral (só desktop) */
.info-panel{
  position:fixed;left:32px;top:50%;transform:translateY(-50%);
  max-width:260px;padding:24px;background:rgba(19,28,51,.6);
  border:1px solid rgba(148,163,184,.15);
  border-radius:20px;backdrop-filter:blur(12px);
  display:flex;flex-direction:column;gap:14px;
}
.info-panel h2{font-size:16px;font-weight:800;color:#f1f5f9}
.info-panel p{font-size:12.5px;color:#94a3b8;line-height:1.65}
.info-panel .tag{
  display:inline-flex;align-items:center;gap:6px;
  font-size:10px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;padding:4px 10px;border-radius:8px;
  background:rgba(59,130,246,.15);color:#93c5fd;
  border:1px solid rgba(59,130,246,.3);width:fit-content;
}
.info-panel .creds{
  background:rgba(15,23,42,.6);border-radius:10px;padding:10px 12px;
  font-size:11.5px;color:#94a3b8;font-family:ui-monospace,monospace;
  line-height:1.7;
}
.info-panel .creds strong{color:#7dd3fc}

/* Modo "apenas app" (sem moldura) */
body.app-only{padding:0}
body.app-only .phone-frame{
  width:100%;height:100vh;max-height:none;border-radius:0;padding:0;
  box-shadow:none;
}
body.app-only .phone-frame::before,
body.app-only .phone-frame::after,
body.app-only .status-bar,
body.app-only .home-indicator{display:none}
body.app-only .phone-screen{border-radius:0}
body.app-only .info-panel{display:none}
body.app-only .mode-toggle{top:16px;right:16px}

@media (max-width:900px){
  .info-panel{display:none}
}
@media (max-width:520px){
  body{padding:0}
  .phone-frame{
    width:100%;height:100vh;max-height:none;
    border-radius:0;padding:0;box-shadow:none;
  }
  .phone-frame::before,.phone-frame::after{display:none}
  .phone-screen{border-radius:0}
  .home-indicator{display:none}
  .status-bar{display:none}
  .mode-toggle{top:12px;right:12px;padding:10px 16px;font-size:12px}
}
</style>
</head>
<body>

<button class="mode-toggle" id="modeBtn" onclick="toggleMode()">
  <span id="modeBtnIcon">📱</span> <span id="modeBtnText">Modo tela cheia</span>
</button>

<aside class="info-panel">
  <span class="tag">● Preview mobile</span>
  <h2>Eventos Acadêmicos</h2>
  <p>Este é o seu aplicativo rodando dentro de uma moldura de celular. Use os filtros, faça login e navegue normalmente.</p>
  <div class="creds">
    <strong>Login de teste:</strong><br>
    admin@eventos.com<br>
    Admin@123
  </div>
  <p style="font-size:11.5px">Clique em <strong style="color:#93c5fd">"Modo tela cheia"</strong> para abrir o app ocupando toda a janela.</p>
</aside>

<div class="phone-frame">
  <div class="status-bar">
    <span id="clock">9:41</span>
    <div class="sb-icons">
      <i>📶</i>
      <i>📡</i>
      <span class="battery"></span>
    </div>
  </div>
  <div class="phone-screen">
    <iframe src="Eventlink.html" title="Eventos Acadêmicos"></iframe>
  </div>
  <div class="home-indicator"></div>
</div>

<script>
// Relógio fake
function tick(){
  const d=new Date();
  document.getElementById('clock').innerText=
    d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
}
setInterval(tick,10000);tick();

// Alternar entre modo moldura e tela cheia
let fullscreen=false;
function toggleMode(){
  fullscreen=!fullscreen;
  document.body.classList.toggle('app-only',fullscreen);
  document.getElementById('modeBtnIcon').innerText=fullscreen?'🖥️':'📱';
  document.getElementById('modeBtnText').innerText=fullscreen?'Modo celular':'Modo tela cheia';
}
</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────
// manifest.json
// ─────────────────────────────────────────────────────────────────────────
FILES['manifest.json'] = JSON.stringify({
  name: "Eventos Acadêmicos",
  short_name: "Eventos",
  start_url: "./Eventlink.html",
  scope: "./",
  display: "standalone",
  orientation: "portrait",
  background_color: "#0a0e1a",
  theme_color: "#0f172a",
  description: "Plataforma de eventos acadêmicos — busca, inscrição e gerenciamento.",
  lang: "pt-BR",
  icons: [
    { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
  ]
}, null, 2);

// ─────────────────────────────────────────────────────────────────────────
// sw.js
// ─────────────────────────────────────────────────────────────────────────
FILES['sw.js'] = String.raw`const CACHE='eventos-v1';
const ASSETS=[
  './',
  './Eventlink.html',
  './manifest.json',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./Eventlink.html')))
  );
});
`;

// ─────────────────────────────────────────────────────────────────────────
// icon.svg — ícone do app
// ─────────────────────────────────────────────────────────────────────────
FILES['icon.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <path fill="#fff" d="M368 128h-24v-16c0-11-9-20-20-20s-20 9-20 20v16H208v-16c0-11-9-20-20-20s-20 9-20 20v16h-24c-22.1 0-40 17.9-40 40v208c0 22.1 17.9 40 40 40h224c22.1 0 40-17.9 40-40V168c0-22.1-17.9-40-40-40zm-8 248c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V216h208v160z"/>
  <rect x="200" y="256" width="40" height="40" rx="8" fill="#fff"/>
  <rect x="272" y="256" width="40" height="40" rx="8" fill="#fff"/>
  <rect x="200" y="328" width="40" height="40" rx="8" fill="#fff"/>
  <rect x="272" y="328" width="40" height="40" rx="8" fill="#fff"/>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────
// index.html — redireciona para o viewer
// ─────────────────────────────────────────────────────────────────────────
FILES['index.html'] = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=viewer.html">
<title>Eventos Acadêmicos</title>
<style>
body{margin:0;background:#0a0e1a;color:#fff;font-family:system-ui,sans-serif;
display:flex;align-items:center;justify-content:center;min-height:100vh}
a{color:#3b82f6}
</style>
</head>
<body>
<p>Redirecionando para <a href="viewer.html">viewer.html</a>…</p>
<script>location.replace('viewer.html');</script>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────────────────
// README.md
// ─────────────────────────────────────────────────────────────────────────
FILES['README.md'] = `# 📱 Eventos Acadêmicos — App Mobile

Aplicativo web progressivo (PWA) para divulgação e gerenciamento de eventos acadêmicos.
Roda em **qualquer celular** (Android, iPhone, tablets) e também abre em **modo celular** dentro do navegador do PC.

## 🚀 Como usar

### Publicar (GitHub Pages, Vercel, Netlify…)
1. Suba a pasta inteira para o serviço de hospedagem
2. Acesse a URL no celular
3. Toque em **"Adicionar à tela inicial"** / **"Instalar aplicativo"**
4. Pronto — o app abre em tela cheia, com ícone próprio

### Testar no PC
Abra **\`viewer.html\`** no navegador — ele mostra o app dentro de uma moldura de iPhone.
- Clique em **"Modo tela cheia"** (canto superior direito) para alternar entre moldura e tela cheia
- Ou abra **\`Eventlink.html\`** direto para ver o app puro

## 🔑 Login de teste
- **E-mail:** \`admin@eventos.com\`
- **Senha:** \`Admin@123\`

## 📁 Arquivos

| Arquivo | Função |
|---------|--------|
| \`Eventlink.html\` | **App principal** — todas as telas e funcionalidades |
| \`viewer.html\` | Moldura de celular para visualizar no PC |
| \`manifest.json\` | Metadados do PWA (nome, ícone, cor) |
| \`sw.js\` | Service Worker (funciona offline) |
| \`icon.svg\` | Ícone do app |
| \`index.html\` | Redireciona para o viewer |

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
- Suporte a \`env(safe-area-inset-*)\` (iPhone notch)

## 📄 Licença
Projeto acadêmico — uso livre para fins educacionais.
`;

// ─────────────────────────────────────────────────────────────────────────
// .gitignore
// ─────────────────────────────────────────────────────────────────────────
FILES['.gitignore'] = `node_modules/
dist/
.env
*.log
.DS_Store
`;

// ═══════════════════════════════════════════════════════════════════════════
// ESCRITA DOS ARQUIVOS
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📝 Escrevendo arquivos do projeto...\n');

let count = 0;
for (const [rel, content] of Object.entries(FILES)) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('   ✓ ' + rel);
  count++;
}
console.log('\n✅ ' + count + ' arquivos gerados.\n');

// ═══════════════════════════════════════════════════════════════════════════
// ZIP (implementação mínima, sem dependências)
// ═══════════════════════════════════════════════════════════════════════════
function crc32(buf) {
  if (!crc32.t) {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    crc32.t = t;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crc32.t[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function dosDT(d = new Date()) {
  const t = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
  const dd = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
  return { t, d: dd };
}
function buildZip(files) {
  const local = [], central = [];
  let off = 0;
  const { t, d } = dosDT();
  for (const f of files) {
    const name = Buffer.from(f.name.replace(/\\/g, '/'), 'utf8');
    const raw = f.data;
    const crc = crc32(raw);
    const comp = zlib.deflateRawSync(raw, { level: 9 });
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(8, 8); lh.writeUInt16LE(t, 10); lh.writeUInt16LE(d, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(name.length, 26);
    lh.writeUInt16LE(0, 28);
    local.push(lh, name, comp);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8); ch.writeUInt16LE(8, 10); ch.writeUInt16LE(t, 12);
    ch.writeUInt16LE(d, 14); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(off, 42);
    central.push(ch, name);
    off += lh.length + name.length + comp.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(off, 16);
  return Buffer.concat([...local, cd, eocd]);
}

console.log('📦 Gerando ZIP...');
const allFiles = Object.keys(FILES).map(n => ({ name: n, data: Buffer.from(FILES[n], 'utf8') }));
const zip = buildZip(allFiles);
fs.writeFileSync(OUT, zip);
console.log('✅ ZIP criado: ' + OUT);
console.log('   ' + allFiles.length + ' arquivos · ' + (zip.length / 1024).toFixed(1) + ' KB\n');

// ═══════════════════════════════════════════════════════════════════════════
// SERVIDOR DE DOWNLOAD + PREVIEW
// ═══════════════════════════════════════════════════════════════════════════
const PAGE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Eventos Acadêmicos — Download</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#0a0e1a,#0f172a,#0a0e1a);
color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
.card{background:#131c33;border-radius:24px;padding:40px 32px;text-align:center;
max-width:520px;width:100%;border:1px solid rgba(148,163,184,.15);
box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
.icon{font-size:56px;margin-bottom:20px}
h1{font-size:24px;font-weight:800;margin-bottom:10px;letter-spacing:-.02em}
p{color:#94a3b8;font-size:14px;line-height:1.7;margin-bottom:24px}
.btn{display:block;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;
text-decoration:none;border-radius:14px;padding:16px 32px;font-weight:700;font-size:15px;
box-shadow:0 12px 32px -8px rgba(59,130,246,.6);transition:.15s;margin-bottom:10px}
.btn:hover{transform:translateY(-2px)}
.btn.ghost{background:transparent;border:1.5px solid rgba(148,163,184,.25);box-shadow:none}
.btn.ghost:hover{background:rgba(148,163,184,.1)}
.steps{text-align:left;background:#0a0e1a;border-radius:14px;padding:18px 22px;
margin-top:20px;font-size:12.5px;color:#94a3b8;line-height:2}
.steps strong{color:#e2e8f0;display:block;margin-bottom:6px}
.steps code{background:#1e293b;padding:2px 6px;border-radius:4px;color:#7dd3fc;font-size:11.5px}
small{display:block;color:#475569;font-size:11px;margin-top:16px}
</style>
</head>
<body>
<div class="card">
  <div class="icon">📱</div>
  <h1>Eventos Acadêmicos</h1>
  <p>App mobile completo — pronto para hospedar no GitHub Pages e instalar como PWA.</p>
  <a class="btn" href="/download">⬇️ Baixar projeto (.zip)</a>
  <a class="btn ghost" href="/preview" target="_blank">👁️ Abrir preview mobile</a>
  <div class="steps">
    <strong>Como usar:</strong>
    1. Baixe o ZIP e extraia<br>
    2. Suba o conteúdo no GitHub Pages<br>
    3. Abra no celular → "Adicionar à tela inicial"<br>
    4. Login: <code>admin@eventos.com</code> / <code>Admin@123</code>
  </div>
  <small>Servidor em http://localhost:${PORT} · Ctrl+C para encerrar</small>
</div>
</body>
</html>`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.css':  'text/css; charset=utf-8',
  '.md':   'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Download do ZIP
  if (req.url === '/download') {
    const stat = fs.statSync(OUT);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="eventos-academicos-app.zip"',
      'Content-Length': stat.size
    });
    fs.createReadStream(OUT).pipe(res);
    console.log('📥 Download iniciado.');
    return;
  }

  // Preview: serve os arquivos do projeto
  if (req.url === '/preview' || req.url.startsWith('/preview/')) {
    const rel = req.url === '/preview' || req.url === '/preview/'
      ? 'viewer.html'
      : req.url.replace('/preview/', '');
    const full = path.join(ROOT, rel);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(full).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
    return;
  }

  // Home
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(PAGE);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🌐 Servidor ativo!');
  console.log('   ➜  Home:    http://localhost:' + PORT);
  console.log('   ➜  Preview: http://localhost:' + PORT + '/preview');
  console.log('   ➜  Ctrl+C para encerrar.\n');
});