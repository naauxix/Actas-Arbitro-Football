# ⚽ ActaFútbol

Aplicación web SPA para gestionar actas de fútbol.

## ▶️ Ejecutar

1. Descargar archivos
2. Abrir `index.html`
3. Recomendado usar VSCode + Live Server

---

## 🧱 Arquitectura

Se utiliza arquitectura modular:

- models/
- services/
- repositories/
- views/

La persistencia se abstrae mediante repositorios.

---

## 💾 Persistencia

Actualmente:
- LocalStorage

Fácil migración futura:
- API REST
- Firebase
- Supabase
- Node.js backend

Solo sería necesario reemplazar:
- LocalStorageRepository.js

---

## 📄 PDF

Se usa:
- jsPDF

Compatible con:
- descarga
- Web Share API
- AirDrop en iOS Safari

---

## 🌙 Extras incluidos

✅ Modo oscuro  
✅ Undo/Redo  
✅ Exportación PDF  
✅ Persistencia  
✅ Validaciones  
✅ Timeline cronológico  
✅ Arquitectura escalable  

---

## 🔮 Extensiones futuras

- Login usuarios
- Backend real
- Tiempo real
- Estadísticas avanzadas
- Árbitros oficiales
- Firma digital
- IndexedDB
- Sincronización cloud