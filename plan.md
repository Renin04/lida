# LIDA - پلن اجرایی پروژه

## مرور کلی
پلتفرم B2B فروش AI Agent با سبک Pixel Art، دوزبانه (فارسی/انگلیسی)، فول‌استک با پنل ادمین، سیستم مدیریت شرکت‌ها و ایجنت‌ها، و چت اینترفیس.

---

## مرحله ۱: طراحی معماری و فلوهای بیزنسی
**هدف**: طراحی کامل فلوها، ساختار دیتابیس، API‌ها، و معماری سیستم

### فلوهای اصلی:
1. **Onboarding شرکت‌ها**: ثبت‌نام → تایید → ایجاد پروفایل → انتخاب ایجنت‌ها
2. **سیستم Agent**: کاتالوگ ایجنت‌ها → سفارش‌سازی per شرکت → اتصال دیتا → دیپلوی
3. **Chat Interface**: چت با هر ایجنت → گزارش‌گیری → اکشن‌سازی
4. **Admin Panel**: مدیریت شرکت‌ها → مدیریت ایجنت‌ها → مانیتورینگ → تنظیمات
5. **Billing & Subscription**: پلن‌ها → پرداخت → مصرف‌سنجی

### زیرساخت:
- **Frontend**: React + TypeScript + Tailwind + Pixel Art UI Kit
- **Backend**: Node.js + Express + MongoDB
- **Auth**: JWT + Role-based (Admin, Company Owner, Company Member)
- **AI Integration**: OpenAI/Claude API wrapper برای ایجنت‌ها
- **Security**: Rate limiting, input validation, CORS, helmet, etc.

---

## مرحله ۲: طراحی UI/UX و Identity بصری
**هدف**: طراحی کامل مؤلفه‌های بصری، لوگو، انیمیشن‌ها، و رابط کاربری

### تحویل‌ها:
- Logo LIDA (pixel art female character)
- Color system (B&W high contrast)
- Typography (pixel font)
- Component library (pixel styled)
- Animation specs (micro-interactions)
- Page layouts (all screens)

---

## مرحله ۳: توسعه Backend
**هدف**: API کامل، دیتابیس، احراز هویت، و لاجیک بیزنسی

### ماژول‌ها:
- Auth (register, login, JWT, roles)
- Companies (CRUD, profiles, settings)
- Agents (catalog, customization, deployment)
- Chat (WebSocket, history, context)
- Admin (dashboard, management)
- Billing (subscriptions, usage)

---

## مرحله ۴: توسعه Frontend
**هدف**: پیاده‌سازی کامل رابط کاربری با تمام صفحات

### صفحات:
- Landing Page (بازاریابی)
- Auth (Login/Register)
- Company Dashboard
- Agent Catalog & Store
- Chat Interface
- Agent Management
- Admin Panel
- Settings & Profile

---

## مرحله ۵: تست امنیت و دیپلوی
**هدف**: تست‌های امنیتی، باگ‌فیکس، و دیپلوی نهایی

---

## تکنولوژی‌ها
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io
- **AI**: OpenAI API
- **Security**: Helmet, Rate-limiter, Joi, bcrypt, JWT
- **Deploy**: Static hosting

## مهارت‌ها
- Stage 1-2: vibecoding-general-swarm (برای معماری و طراحی)
- Stage 3-4: vibecoding-webapp-swarm (برای توسعه فول‌استک)
- Stage 5: تست امنیت با ابزارهای اختصاصی
