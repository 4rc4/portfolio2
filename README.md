# Portfolio OS — Phase 7 Terminal Layout Fix

Bu paket Phase 7 üstüne terminal açılınca ekranın bozulması sorununu düzeltir.

## Fix edilenler

- Taskbar artık `absolute` değil, `fixed bottom-0`.
- OS root artık `fixed inset-0`.
- Terminal prompt satırı uzun path yüzünden layout taşırmıyor.
- Terminal output satırları daha güvenli wrap ediyor.
- Pencereler `fixed` konumlandırmayla viewport içinde daha stabil davranıyor.

## Kurulum

Zip içindeki `portfolio-os-phase-7-terminal-layout-fix` klasörünün içeriğini mevcut projenin üstüne kopyala.

```bash
npm install
npm run dev
```
