# Portfolio OS — Phase 7 Full Upgrade

Bu paket Phase 6'nın üstüne büyük özellik güncellemesi ve kritik maximize fix ekler.

## Eklenenler

- Maximize bug fix
  - Pencere artık bulunduğu yerde büyüyüp taşmıyor.
  - Drag sistemi Framer transform yerine gerçek `left/top` state mantığına geçirildi.

- Yeni uygulamalar
  - CV.app
  - Skills.app
  - Experience.app
  - System Monitor.app

- Project Viewer upgrade
  - What I built
  - What I learned
  - Fullscreen preview overlay
  - Project search
  - Tech filter

- Terminal upgrade
  - neofetch
  - projects
  - skills
  - contact
  - cv
  - about
  - socials
  - open catudy
  - open projects
  - open contact

- Wallpaper upgrade
  - Daha fazla built-in wallpaper
  - Custom wallpaper upload
  - Custom wallpaper localStorage kaydı

- OS feel upgrade
  - Ctrl + K command palette
  - Notification system
  - Desktop icon selection
  - Desktop context menu: Open Terminal Here
  - File Explorer file preview modal
  - Better responsive behavior

## Kurulum

Zip içindeki `portfolio-os-phase-7-full-upgrade` klasörünün içeriğini mevcut projenin üstüne kopyala.

```bash
npm install
npm run dev
```

## Test

- Pencereyi taşı, sonra maximize yap. Sol üstte düzgün full-screen olmalı.
- Project Viewer içinde preview aç, sonra fullscreen butonunu dene.
- Settings içinde custom wallpaper upload dene.
- Ctrl + K ile command palette aç.
- Terminalde `neofetch`, `projects`, `open catudy`, `contact`, `cv` dene.
