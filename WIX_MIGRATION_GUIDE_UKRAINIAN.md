# 🚀 Повний посібник з міграції на Wix - EVO Elternvereinigung Oberglatt

**Цільова аудиторія:** Молодший розробник (початківець)  
**Необхідний план Wix:** Premium Plan  
**Редактор:** Classic Wix Editor  
**Підхід:** Повністю нативний Wix (Velo + Wix Data + Wix Members)  
**Терміни:** Терміново - покрокова реалізація  

---

## 📋 Зміст

1. [Передумови та налаштування Wix](#1-передумови-та-налаштування-wix)
2. [Налаштування бази даних (Wix Data Collections)](#2-налаштування-бази-даних-wix-data-collections)
3. [Бекенд логіка (Velo код)](#3-бекенд-логіка-velo-код)
4. [Реалізація фронтенду/UI](#4-реалізація-фронтендуui)
5. [Система автентифікації](#5-система-автентифікації)
6. [Система бронювання](#6-система-бронювання)
7. [Інтеграція платежів](#7-інтеграція-платежів)
8. [Email повідомлення](#8-email-повідомлення)
9. [Тестування та запуск](#9-тестування-та-запуск)

---

## 1. Передумови та налаштування Wix

### Крок 1.1: Створіть ваш сайт Wix

1. Перейдіть на [wix.com](https://www.wix.com)
2. Натисніть **"Get Started"** → **"Create a Site"**
3. Виберіть **"Start with a Template"**
4. Шукайте шаблони **"Community"** або **"Organization"**
5. Виберіть чистий шаблон (ви повністю налаштуєте його)
6. Натисніть **"Edit This Site"**

### Крок 1.2: Увімкніть Velo (режим розробника)

**Velo - це платформа кодування Wix - ви ПОВИННІ її увімкнути!**

1. У редакторі Wix натисніть перемикач **"Dev Mode"** у верхньому меню
   - Якщо ви його не бачите, натисніть **Tools & Apps** → **Developer Tools** → **Enable Developer Tools**
2. З'явиться спливаюче вікно: **"Turn on Developer Tools"**
3. Натисніть **"Enable Developer Tools"**
4. Редактор перезавантажиться з панеллю коду внизу
5. **Підтвердження**: Тепер ви повинні бачити панель **"Code Files"** на лівій бічній панелі

### Крок 1.3: Увімкніть Wix Members (автентифікація)

1. У редакторі Wix натисніть **"Add"** (кнопка + на лівій бічній панелі)
2. Прокрутіть до розділу **"User Input"**
3. Натисніть **"Login Bar"**
4. Перетягніть Login Bar до вашого заголовка
5. З'явиться спливаюче вікно: **"Add Members Area"**
6. Натисніть **"Add Members Area"**
7. Виберіть шаблон **"Member Signup & Login"**
8. Натисніть **"Add to Site"**

**Wix Members тепер увімкнено!** Користувачі можуть реєструватися та входити.

### Крок 1.4: Оновіться до Premium плану (якщо ще не зробили)

1. Натисніть кнопку **"Upgrade"** у верхньому меню
2. Виберіть план **"Business Unlimited"** або вище
3. Підключіть ваш домен: **elternvereinigung.ch**
4. Завершіть налаштування оплати

---

## 2. Налаштування бази даних (Wix Data Collections)

### Що таке Wix Data Collections?

Думайте про це як про колекції MongoDB, але керовані Wix. Кожна колекція - це таблиця з полями (стовпцями).

### Крок 2.1: Доступ до менеджера баз даних

1. У редакторі Wix натисніть кнопку **"CMS"** на лівій бічній панелі (іконка бази даних)
2. Натисніть **"Add a Collection"** або **"Database"** → **"Add Collection"**

### Крок 2.2: Створіть колекції

Вам потрібно створити **8 колекцій**. Ось повна структура:

---

#### **Колекція 1: Mitglieder (Члени)**

**Призначення:** Розширює Wix Members додатковими полями

**Назва колекції:** `Mitglieder`  
**Дозволи:** 
- Хто може читати: **Site Member**
- Хто може створювати: **Site Member (Author)**
- Хто може оновлювати: **Site Member (Author)**
- Хто може видаляти: **Admin**

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `_id` | Text | Автоматично згенерований ID (за замовчуванням) |
| `mitgliedId` | Text | ID члена Wix (зв'язок з користувачем) |
| `name` | Text | Повне ім'я |
| `email` | Email | Email адреса |
| `telefon` | Phone | Номер телефону |
| `adresse` | Rich Text | Адреса |
| `istMitglied` | Boolean | Чи є членом (завжди true для зареєстрованих) |
| `erstelltAm` | Date | Дата створення |

**Як створити:**

1. Натисніть **"Add Collection"**
2. Назвіть її: `Mitglieder`
3. Для кожного поля вище:
   - Натисніть **"Add Field"**
   - Виберіть правильний **Type**
   - Встановіть **Name** поля (німецькі назви як зазначено)
   - Натисніть **"Add"**
4. Встановіть **Permissions** як зазначено вище
5. Натисніть **"Save"**

---

#### **Колекція 2: Buchungen (Бронювання)**

**Призначення:** Зберігати всі бронювання Robihütte

**Назва колекції:** `Buchungen`  
**Дозволи:**
- Хто може читати: **Anyone** (для видимості календаря)
- Хто може створювати: **Site Member**
- Хто може оновлювати: **Admin only**
- Хто може видаляти: **Admin only**

**Поля:**

| Назва поля | Тип | Опис | Обов'язкове |
|-----------|------|-------------|----------|
| `referenzNummer` | Text | Референс бронювання (напр., RH-2026-0001) | Так |
| `benutzerId` | Reference | Посилання на колекцію Mitglieder | Так |
| `benutzerName` | Text | Повне ім'я користувача | Так |
| `benutzerEmail` | Email | Email користувача | Так |
| `benutzerTelefon` | Phone | Телефон користувача (тільки зовнішні) | Ні |
| `buchungsDatum` | Date | Дата бронювання (YYYY-MM-DD) | Так |
| `startZeit` | Text | Час початку (HH:MM) | Так |
| `endZeit` | Text | Час закінчення (HH:MM) | Так |
| `zeitBlock` | Text | Часовий блок: "4h", "12h", або "24h" | Так |
| `veranstaltungsTyp` | Text | Тип події | Так |
| `erwarteteGaeste` | Number | Очікувана кількість гостей | Так |
| `reinigungZusatz` | Boolean | Додаткова прибирання | Ні |
| `spezialleWuensche` | Rich Text | Спеціальні побажання | Ні |
| `mietPreis` | Number | Ціна оренди у CHF | Так |
| `reinigungsPreis` | Number | Ціна прибирання у CHF | Так |
| `gesamtPreis` | Number | Загальна ціна (оренда + прибирання) | Так |
| `kaution` | Number | Сума депозиту (CHF 250) | Так |
| `istMitglied` | Boolean | Чи є бронювання члена | Так |
| `istExtern` | Boolean | Чи є зовнішнім (не член) | Ні |
| `status` | Text | "bestaetigt", "ausstehend", "storniert" | Так |
| `zahlungsStatus` | Text | "bezahlt", "ausstehend" | Так |
| `erstelltAm` | Date & Time | Мітка часу створення | Так |

**Як створити:**
1. Той самий процес, що і для колекції Mitglieder
2. Зверніть увагу на **Field Types** (Date, Number, Boolean тощо)
3. Встановіть **Required** поля в налаштуваннях поля

---

#### **Колекція 3: Veranstaltungen (Події)**

**Назва колекції:** `Veranstaltungen`  
**Дозволи:** Читання: Anyone, Створення/Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `titel` | Text | Назва події |
| `datum` | Date | Дата події |
| `uhrzeit` | Text | Час (напр., "14:00 - 17:00") |
| `ort` | Text | Локація |
| `kategorie` | Text | Категорія (Kinderclub, Familienanlass тощо) |
| `beschreibung` | Rich Text | Опис |
| `bild` | Image | Зображення події |

---

#### **Колекція 4: BlogPosts**

**Назва колекції:** `BlogPosts`  
**Дозволи:** Читання: Anyone, Створення/Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `titel` | Text | Назва поста |
| `inhalt` | Rich Text | Вміст поста |
| `bild` | Image | Головне зображення |
| `kategorie` | Text | Категорія |
| `erstelltAm` | Date & Time | Дата публікації |

---

#### **Колекція 5: Vorstandsmitglieder (Члени правління)**

**Назва колекції:** `Vorstandsmitglieder`  
**Дозволи:** Читання: Anyone, Створення/Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `name` | Text | Ім'я члена |
| `rolle` | Text | Роль (Präsidentin, Vorstand) |
| `email` | Email | Email |
| `foto` | Image | Фото |
| `sortierung` | Number | Порядок сортування |
| `istAktiv` | Boolean | Чи активний |

**Заповніть заздалегідь:**
1. Dominique Knöpfli - Präsidentin
2. Mélanie Bosshardt - Vorstand
3. Mirjam Spörri - Vorstand

---

#### **Колекція 6: Kontaktnachrichten (Контактні повідомлення)**

**Назва колекції:** `Kontaktnachrichten`  
**Дозволи:** Читання/Створення: Anyone, Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `name` | Text | Ім'я відправника |
| `email` | Email | Email відправника |
| `betreff` | Text | Тема |
| `nachricht` | Rich Text | Повідомлення |
| `status` | Text | "neu", "gelesen", "beantwortet" |
| `erstelltAm` | Date & Time | Мітка часу відправлення |

---

#### **Колекція 7: Newsletter**

**Назва колекції:** `Newsletter`  
**Дозволи:** Читання: Admin, Створення: Anyone, Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `email` | Email | Email підписника |
| `angemeldetAm` | Date & Time | Дата підписки |

---

#### **Колекція 8: Preise (Ціни)**

**Назва колекції:** `Preise`  
**Дозволи:** Читання: Anyone, Створення/Оновлення/Видалення: Admin

**Поля:**

| Назва поля | Тип | Опис |
|-----------|------|-------------|
| `label` | Text | "4 Stunden", "12 Stunden", "24 Stunden" |
| `zeitBlock` | Text | "4h", "12h", "24h" |
| `tagLabel` | Text | "Alle Tage", "Mo–Do", "Fr–So + Feiertage" |
| `mitgliedPreis` | Number | Ціна для членів |
| `externPreis` | Number | Зовнішня ціна |
| `zeitNotiz` | Text | Примітка про час |

**Заповніть заздалегідь 5 рядків:**

| label | zeitBlock | tagLabel | mitgliedPreis | externPreis | zeitNotiz |
|-------|-----------|----------|---------------|-------------|-----------|
| 4 Stunden | 4h | Alle Tage | 80 | 120 | Flexible Startzeit |
| 12 Stunden | 12h | Mo–Do | 120 | 180 | Flexible Startzeit |
| 12 Stunden | 12h | Fr–So + Feiertage | 150 | 270 | Flexible Startzeit |
| 24 Stunden | 24h | Mo–Do | 150 | 230 | 09:00 – 09:00 nächster Tag |
| 24 Stunden | 24h | Fr–So + Feiertage | 200 | 350 | 09:00 – 09:00 nächster Tag |

---

### ✅ Контрольна точка: Налаштування бази даних завершено

Тепер ви повинні бачити **8 колекцій** на вашій панелі CMS. Клацніть кожну, щоб перевірити правильність полів.

---

## 3. Бекенд логіка (Velo код)

### Що таке Velo?

Velo дозволяє писати JavaScript код для додавання бекенд логіки. Файли коду закінчуються на `.jsw` (бекенд) або `.js` (фронтенд/сторінка).

### Крок 3.1: Розуміння структури файлів Velo

**Бекенд файли (.jsw):**
- Розташовані в папці **Backend**
- Виконуються на серверах Wix (безпечно, користувачі не бачать код)
- Можуть отримувати доступ до бази даних, виконувати обчислення, відправляти emails

**Файли сторінок (.js):**
- Розташовані в папці **Public & Backend**
- Виконуються в браузері користувача
- Обробляють взаємодії UI, кліки кнопок, подання форм

### Крок 3.2: Створіть бекенд модуль для логіки бронювання

1. На панелі коду (внизу) натисніть папку **"Public & Backend"**
2. Клацніть правою кнопкою миші на папку **"Backend"** → **"New .jsw File"**
3. Назвіть його: `buchungsLogik.jsw`
4. Скопіюйте та вставте цей повний код:

```javascript
// Назва файлу: buchungsLogik.jsw (Бекенд)
// Призначення: Вся логіка бронювання, ціноутворення, перевірка доступності

import wixData from 'wix-data';

// ==================== КОНСТАНТИ ====================

const REINIGUNGSPREIS = 60;  // Вартість прибирання
const KAUTION = 250;  // Депозит
const PUFFERZEIT_STUNDEN = 1.5;  // Буферний час у годинах
const MAX_VORLAUFZEIT_MONATE = 3;  // Макс 3 місяці наперед бронювання

// Швейцарські свята 2026
const SCHWEIZER_FEIERTAGE_2026 = [
  '2026-01-01', '2026-01-02', '2026-04-03', '2026-04-06',
  '2026-05-01', '2026-05-14', '2026-05-25', '2026-08-01',
  '2026-12-25', '2026-12-26'
];

// ==================== ДОПОМІЖНІ ФУНКЦІЇ ====================

/**
 * Перевірити, чи дата вихідна (Пт-Нд) або свято
 */
function istWochenende OderFeiertag(datumString) {
  const datum = new Date(datumString);
  const wochentag = datum.getDay(); // 0=Неділя, 5=П'ятниця, 6=Субота
  
  // Вихідні = П'ятниця(5), Субота(6), Неділя(0)
  if (wochentag === 0 || wochentag === 5 || wochentag === 6) {
    return true;
  }
  
  // Перевірити свята
  return SCHWEIZER_FEIERTAGE_2026.includes(datumString);
}

/**
 * Отримати години для часового блоку
 */
function getStundenFuerBlock(zeitBlock) {
  if (zeitBlock === '4h') return 4;
  if (zeitBlock === '12h') return 12;
  return 24; // 24h
}

/**
 * Додати години до дати та часу
 */
function addStunden(datumString, zeitString, stunden) {
  const [jahr, monat, tag] = datumString.split('-');
  const [stunde, minute] = zeitString.split(':');
  const datum = new Date(jahr, monat - 1, tag, stunde, minute);
  datum.setHours(datum.getHours() + stunden);
  return datum;
}

/**
 * Форматувати час як HH:MM
 */
function formatiereZeit(datum) {
  const stunde = String(datum.getHours()).padStart(2, '0');
  const minute = String(datum.getMinutes()).padStart(2, '0');
  return `${stunde}:${minute}`;
}

// ==================== ФУНКЦІЇ ЦІНОУТВОРЕННЯ ====================

/**
 * Розрахувати ціну бронювання на основі правил
 * @export (робить функцію доступною з фронтенду)
 */
export async function berechnePreis(zeitBlock, buchungsDatum, istMitglied, reinigung) {
  const istWochenende = istWochenende OderFeiertag(buchungsDatum);
  
  // Запит цін з бази даних
  let query = wixData.query('Preise')
    .eq('zeitBlock', zeitBlock);
  
  // Додати фільтр днів для блоків 12г та 24г
  if (zeitBlock === '12h' || zeitBlock === '24h') {
    const tagLabel = istWochenende ? 'Fr–So + Feiertage' : 'Mo–Do';
    query = query.eq('tagLabel', tagLabel);
  }
  
  const ergebnis = await query.find();
  
  if (ergebnis.items.length === 0) {
    throw new Error('Preisregel nicht gefunden');
  }
  
  const preisRegel = ergebnis.items[0];
  const mietPreis = istMitglied ? preisRegel.mitgliedPreis : preisRegel.externPreis;
  const reinigungsPreis = reinigung ? REINIGUNGSPREIS : 0;
  
  return {
    mietPreis: mietPreis,
    reinigungsPreis: reinigungsPreis,
    gesamt: mietPreis + reinigungsPreis,
    kaution: KAUTION,
    istWochenende: istWochenende
  };
}

/**
 * Порівняти ціни для членів та зовнішніх
 * @export
 */
export async function vergleichePreise(zeitBlock, buchungsDatum, reinigung) {
  const mitgliedPreis = await berechnePreis(zeitBlock, buchungsDatum, true, reinigung);
  const externPreis = await berechnePreis(zeitBlock, buchungsDatum, false, reinigung);
  
  return {
    mitglied: mitgliedPreis,
    extern: externPreis
  };
}

// ==================== ФУНКЦІЇ ВАЛІДАЦІЇ ====================

/**
 * Перевірити, чи дата бронювання дійсна (з завтрашнього дня до 3 місяців наперед)
 */
function pruefeValidierungDatum(buchungsDatum) {
  const buchung = new Date(buchungsDatum);
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  
  const morgen = new Date(heute);
  morgen.setDate(morgen.getDate() + 1);
  
  const maxDatum = new Date(heute);
  maxDatum.setMonth(maxDatum.getMonth() + MAX_VORLAUFZEIT_MONATE);
  
  if (buchung < morgen) {
    return { gueltig: false, nachricht: 'Buchungen sind erst ab morgen möglich' };
  }
  if (buchung > maxDatum) {
    return { gueltig: false, nachricht: `Buchungen sind maximal ${MAX_VORLAUFZEIT_MONATE} Monate im Voraus möglich` };
  }
  return { gueltig: true };
}

/**
 * Перевірити доступність часового слоту
 * @export
 */
export async function pruefeVerfuegbarkeit(buchungsDatum, startZeit, zeitBlock) {
  // Спочатку перевірити дійсність дати
  const datumCheck = pruefeValidierungDatum(buchungsDatum);
  if (!datumCheck.gueltig) {
    return { verfuegbar: false, nachricht: datumCheck.nachricht };
  }
  
  // Отримати існуючі бронювання для цієї дати
  const ergebnis = await wixData.query('Buchungen')
    .eq('buchungsDatum', buchungsDatum)
    .ne('status', 'storniert')
    .find();
  
  const vorhandeneBuchungen = ergebnis.items;
  
  // Розрахувати запитувані часи бронювання
  const anfragStart = addStunden(buchungsDatum, startZeit, 0);
  const stunden = getStundenFuerBlock(zeitBlock);
  const anfragEnde = addStunden(buchungsDatum, startZeit, stunden);
  const anfragPufferEnde = addStunden(buchungsDatum, startZeit, stunden + PUFFERZEIT_STUNDEN);
  
  // Перевірити конфлікти з існуючими бронюваннями
  for (const buchung of vorhandeneBuchungen) {
    const vorhandStart = addStunden(buchung.buchungsDatum, buchung.startZeit, 0);
    const vorhandStunden = getStundenFuerBlock(buchung.zeitBlock);
    const vorhandEnde = addStunden(buchung.buchungsDatum, buchung.startZeit, vorhandStunden);
    const vorhandPufferEnde = addStunden(buchung.buchungsDatum, buchung.startZeit, vorhandStunden + PUFFERZEIT_STUNDEN);
    
    // Перевірити перекриття (включаючи буфер)
    if (anfragStart < vorhandPufferEnde && anfragPufferEnde > vorhandStart) {
      return { 
        verfuegbar: false, 
        nachricht: `Konflikt mit bestehender Buchung um ${buchung.startZeit}` 
      };
    }
  }
  
  return { verfuegbar: true };
}

// ==================== СТВОРЕННЯ БРОНЮВАННЯ ====================

/**
 * Згенерувати унікальний номер бронювання
 */
async function generiereReferenzNummer() {
  const anzahl = await wixData.query('Buchungen').count();
  const jahr = new Date().getFullYear();
  const nummer = String(anzahl + 1).padStart(4, '0');
  return `RH-${jahr}-${nummer}`;
}

/**
 * Розрахувати час закінчення
 */
function berechneEndZeit(buchungsDatum, startZeit, zeitBlock) {
  const stunden = getStundenFuerBlock(zeitBlock);
  const endDatum = addStunden(buchungsDatum, startZeit, stunden);
  return formatiereZeit(endDatum);
}

/**
 * Створити бронювання для члена
 * @export
 */
export async function erstelleBuchung(buchungsDaten, benutzerId) {
  // Перевірити доступність
  const verfuegbarkeitCheck = await pruefeVerfuegbarkeit(
    buchungsDaten.buchungsDatum,
    buchungsDaten.startZeit,
    buchungsDaten.zeitBlock
  );
  
  if (!verfuegbarkeitCheck.verfuegbar) {
    throw new Error(verfuegbarkeitCheck.nachricht);
  }
  
  // Отримати інформацію про користувача
  const benutzerErgebnis = await wixData.query('Mitglieder')
    .eq('mitgliedId', benutzerId)
    .find();
  
  if (benutzerErgebnis.items.length === 0) {
    throw new Error('Benutzer nicht gefunden');
  }
  
  const benutzer = benutzerErgebnis.items[0];
  
  // Розрахувати ціну
  const preis = await berechnePreis(
    buchungsDaten.zeitBlock,
    buchungsDaten.buchungsDatum,
    true, // завжди член
    buchungsDaten.reinigungZusatz || false
  );
  
  // Створити документ бронювання
  const buchung = {
    referenzNummer: await generiereReferenzNummer(),
    benutzerId: benutzer._id,
    benutzerName: benutzer.name,
    benutzerEmail: benutzer.email,
    buchungsDatum: buchungsDaten.buchungsDatum,
    startZeit: buchungsDaten.startZeit,
    endZeit: berechneEndZeit(buchungsDaten.buchungsDatum, buchungsDaten.startZeit, buchungsDaten.zeitBlock),
    zeitBlock: buchungsDaten.zeitBlock,
    veranstaltungsTyp: buchungsDaten.veranstaltungsTyp,
    erwarteteGaeste: buchungsDaten.erwarteteGaeste,
    reinigungZusatz: buchungsDaten.reinigungZusatz || false,
    spezialleWuensche: buchungsDaten.spezialleWuensche || '',
    mietPreis: preis.mietPreis,
    reinigungsPreis: preis.reinigungsPreis,
    gesamtPreis: preis.gesamt,
    kaution: KAUTION,
    istMitglied: true,
    istExtern: false,
    status: 'bestaetigt',
    zahlungsStatus: 'ausstehend',
    erstelltAm: new Date()
  };
  
  // Зберегти в базу даних
  const ergebnis = await wixData.insert('Buchungen', buchung);
  return ergebnis;
}

/**
 * Створити бронювання для зовнішнього користувача (не член)
 * @export
 */
export async function erstelleExterneBuchung(buchungsDaten, kontaktInfo) {
  // Перевірити доступність
  const verfuegbarkeitCheck = await pruefeVerfuegbarkeit(
    buchungsDaten.buchungsDatum,
    buchungsDaten.startZeit,
    buchungsDaten.zeitBlock
  );
  
  if (!verfuegbarkeitCheck.verfuegbar) {
    throw new Error(verfuegbarkeitCheck.nachricht);
  }
  
  // Розрахувати ціну для зовнішнього користувача
  const preis = await berechnePreis(
    buchungsDaten.zeitBlock,
    buchungsDaten.buchungsDatum,
    false, // не член
    buchungsDaten.reinigungZusatz || false
  );
  
  // Створити документ бронювання
  const buchung = {
    referenzNummer: await generiereReferenzNummer(),
    benutzerId: 'extern',
    benutzerName: kontaktInfo.name,
    benutzerEmail: kontaktInfo.email,
    benutzerTelefon: kontaktInfo.telefon,
    buchungsDatum: buchungsDaten.buchungsDatum,
    startZeit: buchungsDaten.startZeit,
    endZeit: berechneEndZeit(buchungsDaten.buchungsDatum, buchungsDaten.startZeit, buchungsDaten.zeitBlock),
    zeitBlock: buchungsDaten.zeitBlock,
    veranstaltungsTyp: buchungsDaten.veranstaltungsTyp,
    erwarteteGaeste: buchungsDaten.erwarteteGaeste,
    reinigungZusatz: buchungsDaten.reinigungZusatz || false,
    spezialleWuensche: buchungsDaten.spezialleWuensche || '',
    mietPreis: preis.mietPreis,
    reinigungsPreis: preis.reinigungsPreis,
    gesamtPreis: preis.gesamt,
    kaution: KAUTION,
    istMitglied: false,
    istExtern: true,
    status: 'ausstehend', // Потребує схвалення адміністратора
    zahlungsStatus: 'ausstehend',
    erstelltAm: new Date()
  };
  
  // Зберегти в базу даних
  const ergebnis = await wixData.insert('Buchungen', buchung);
  return ergebnis;
}

// ==================== ФУНКЦІЇ КАЛЕНДАРЯ ====================

/**
 * Отримати бронювання для конкретного місяця
 * @export
 */
export async function getBuchungenFuerMonat(jahr, monat) {
  const startDatum = `${jahr}-${String(monat).padStart(2, '0')}-01`;
  
  let endDatum;
  if (monat === 12) {
    endDatum = `${jahr + 1}-01-01`;
  } else {
    endDatum = `${jahr}-${String(monat + 1).padStart(2, '0')}-01`;
  }
  
  const ergebnis = await wixData.query('Buchungen')
    .ge('buchungsDatum', startDatum)
    .lt('buchungsDatum', endDatum)
    .ne('status', 'storniert')
    .find();
  
  return ergebnis.items;
}
```

**✅ Збережіть файл (Ctrl+S)**

---

## 4. Реалізація фронтенду/UI

### Крок 4.1: Створіть структуру сторінок

Вам потрібні ці сторінки:

1. **Homepage** (`/`)
2. **Über uns** (`/ueber-uns`)
3. **Aktuell** (`/aktuell`) - Події
4. **Robihütte** (`/robihuette`) - Інформація про бронювання
5. **Robihütte buchen** (`/robihuette-buchen`) - Форма бронювання
6. **Blog** (`/blog`)
7. **Kontakt** (`/kontakt`)

**Як створити сторінки:**

1. Натисніть **"Pages & Menu"** (іконка сторінок на лівій бічній панелі)
2. Натисніть **"Add Page"** (+)
3. Виберіть **"Blank Page"**
4. Назвіть її (напр., "Robihütte")
5. Встановіть URL (напр., `/robihuette`)
6. Повторіть для всіх сторінок

---

### Крок 4.2: Дизайн заголовка та навігації

**Поточний дизайн з React додатку:**
- Логотип: EVO Logo (мобільна версія)
- Навігація: Start | Über uns | Aktuell | Robihütte | Blog | Kontakt
- Праворуч: кнопка "Anmelden" + кнопка "Mitglied werden"

**Як реалізувати:**

1. **Додати заголовок:**
   - Натисніть **"Add"** (+) → **"Header & Footer"** → **"Header"**
   - Виберіть шаблон **"Sticky Header"**

2. **Додати логотип:**
   - Завантажте зображення логотипу EVO: Натисніть **"Add"** → **"Image"** → **"Upload Image"**
   - Перетягніть до заголовка
   - Змініть розмір до висоти: 40-50px

3. **Додати меню навігації:**
   - Натисніть **"Add"** → **"Menu & Anchor"** → **"Horizontal Menu"**
   - Перетягніть до заголовка (по центру)
   - Натисніть меню → **"Manage Menu"**
   - Додайте посилання: Start, Über uns, Aktuell, Robihütte, Blog, Kontakt

4. **Додати панель входу:**
   - Вже додано в Кроці 1.3
   - Налаштуйте текст: Натисніть Login Bar → **"Settings"** → Змініть на німецькі мітки

5. **Стилізувати заголовок:**
   - Натисніть фон заголовка → **"Change Header Design"**
   - Фон: Білий (`#FFFFFF`)
   - Висота: 70px
   - Додайте нижню рамку: 1px solid `#E5E7EB`

---

### Крок 4.3: Типографія та шрифти

**Поточні шрифти з React:**
- Заголовки: Жирні, великі
- Основний текст: Звичайний

**Як встановити:**

1. Натисніть **"Site Design"** → **"Site Colors & Fonts"**
2. **Заголовки:**
   - Шрифт: Виберіть сучасний sans-serif (напр., "Open Sans", "Roboto")
   - Розмір: 
     - H1: 48px (мобільний: 36px)
     - H2: 24px (мобільний: 18px)
   - Вага: Жирний (700)
   - Колір: `#111827` (темно-сірий)

3. **Основний текст:**
   - Шрифт: Такий самий як заголовки або "Inter"
   - Розмір: 16px
   - Вага: Звичайний (400)
   - Колір: `#6B7280` (середньо-сірий)

---

### Крок 4.4: Дизайн головної сторінки

**Розділи для створення:**

1. **Hero розділ**
2. **Про нас (тизер)**
3. **Попередній перегляд подій** (наступні 3 події)
4. **Robihütte тизер**
5. **Члени правління**
6. **Підписка на розсилку**
7. **Підвал**

#### Hero розділ

1. **Додати Strip (розділ на всю ширину):**
   - Натисніть **"Add"** → **"Strip"** → Перетягніть на верх сторінки
   - Висота: 500px (десктоп), 400px (мобільний)

2. **Додати фонове зображення:**
   - Натисніть strip → **"Change Strip Background"** → **"Image"**
   - Завантажте hero зображення (сімейне/дитяче фото)
   - Позиція зображення: **"Fill"** з оверлеєм

3. **Додати оверлей:**
   - Налаштування strip → **"Color Overlay"**
   - Колір: Чорний `#000000`
   - Прозорість: 30%

4. **Додати текст:**
   - Натисніть **"Add"** → **"Text"** → **"Add Text"**
   - Введіть: "WILLKOMMEN BEI DER"
   - Розмір шрифту: 14px
   - Колір: `#F59E0B` (помаранчевий/золотий)
   - Міжлітерний інтервал: 2px

5. **Додати основний заголовок:**
   - Додайте інший текстовий елемент
   - Введіть: "Elternvereinigung\nOberglatt"
   - Розмір шрифту: 56px (мобільний: 36px)
   - Колір: Білий `#FFFFFF`
   - Жирний шрифт
   - **Зробіть "Oberglatt" помаранчевим:** Виділіть слово → Змініть колір на `#F59E0B`

6. **Додати підзаголовок:**
   - Додайте текст
   - Введіть: "Gemeinschaft von Eltern für Kinder in Oberglatt..."
   - Розмір шрифту: 18px
   - Колір: Білий з легкою прозорістю

7. **Додати кнопки:**
   - Натисніть **"Add"** → **"Button"**
   - Текст: "Mitglied werden"
   - Посилання на: сторінку `/mitglied-werden`
   - Дизайн кнопки:
     - Фон: `#F59E0B` (помаранчевий)
     - Текст: Білий
     - Відступи: 12px 32px
     - Радіус рамки: 8px
     - **Ефект наведення:** Фон стає темнішим (`#D97706`)

   - Додайте другу кнопку: "Robihütte mieten"
   - Дизайн: Прозора з білою рамкою
   - Наведення: Білий фон, помаранчевий текст

---

### Крок 4.5: Дизайн підвалу

1. **Додати підвал:**
   - Натисніть **"Add"** → **"Header & Footer"** → **"Footer"**

2. **Вміст підвалу (3 колонки):**

   **Колонка 1: Про нас**
   - Логотип
   - Короткий опис
   - Іконки соціальних мереж

   **Колонка 2: Швидкі посилання**
   - Über uns
   - Aktuell
   - Robihütte
   - Kontakt

   **Колонка 3: Контакти**
   - Email: info@elternvereinigung.ch
   - Телефон: (додайте, якщо є)
   - Адреса

3. **Стилізація підвалу:**
   - Фон: Темно-сірий `#1F2937`
   - Колір тексту: Світло-сірий `#D1D5DB`
   - Наведення на посилання: Помаранчевий `#F59E0B`
   - Відступи: 40px зверху/знизу

---

## 5. Система автентифікації

Wix Members автоматично обробляє більшість автентифікації, але вам потрібно підключити її до вашої користувацької бази даних.

### Крок 5.1: Синхронізація Wix Members з колекцією Mitglieder

Коли користувач реєструється, автоматично створювати запис у колекції `Mitglieder`.

1. Створіть новий файл: `mitgliederSync.js` (код сторінки)
2. Додайте до **Site Code** (виконується на кожній сторінці):

**Розташування:** Натисніть папку **"Public & Backend"** → вкладка **"Site"** → файл `site.js`

```javascript
// Назва файлу: site.js (Код для всього сайту)
// Призначення: Синхронізація Wix Members з колекцією Mitglieder

import wixUsers from 'wix-users';
import wixData from 'wix-data';

// Виконати при завантаженні сайту
$w.onReady(function () {
  // Перевірити, чи користувач увійшов
  if (wixUsers.currentUser.loggedIn) {
    syncMitglied();
  }
});

// Синхронізувати поточного користувача з колекцією Mitglieder
async function syncMitglied() {
  const benutzer = wixUsers.currentUser;
  const mitgliedId = benutzer.id;
  
  // Перевірити, чи користувач вже існує в Mitglieder
  const ergebnis = await wixData.query('Mitglieder')
    .eq('mitgliedId', mitgliedId)
    .find();
  
  if (ergebnis.items.length === 0) {
    // Користувача не існує, створити новий запис
    const neuesMitglied = {
      mitgliedId: mitgliedId,
      name: await benutzer.getEmail(), // або отримати з профілю
      email: await benutzer.getEmail(),
      istMitglied: true,
      erstelltAm: new Date()
    };
    
    await wixData.insert('Mitglieder', neuesMitglied);
    console.log('Neues Mitglied erstellt:', mitgliedId);
  }
}
```

**✅ Збережіть файл**

---

## 6. Система бронювання

Це найскладніша частина! Календар бронювання та процес.

### Крок 6.1: Створіть сторінку бронювання (`/robihuette-buchen`)

**Структура сторінки:**

1. **Крок 1: Вибір дати (Календар)**
2. **Крок 2: Вибір часового блоку**
3. **Крок 3: Деталі бронювання**
4. **Крок 4: Перегляд та оплата**

---

### Крок 6.2: Реалізація календаря

**Варіант A: Використовуйте додаток Wix Bookings (найпростіше)**

1. Натисніть **"Add"** → **"App Market"**
2. Шукайте **"Wix Bookings"**
3. Встановіть додаток **Wix Bookings**
4. Налаштуйте:
   - Сервіс: "Robihütte mieten"
   - Тривалість: Змінна (4г, 12г, 24г)
   - Доступність: Підключіть до колекції `Buchungen`

**Варіант B: Користувацький календар (більше контролю)**

Використовуйте повторювач користувацького календаря:

1. **Додайте відображення місяця:**
   - Показати заголовок місяць/рік
   - Кнопки попередній/наступний місяць

2. **Додайте сітку календаря (Repeater):**
   - 7 колонок (Пн-Нд)
   - Підключіть до користувацького коду, який генерує об'єкти дат

3. **Код сторінки для календаря:**

```javascript
// Назва файлу: RobihütteBuchen.js (Код сторінки)
// Призначення: Календар бронювання та форма

import { getBuchungenFuerMonat } from 'backend/buchungsLogik';
import wixUsers from 'wix-users';

let aktuellerMonat = new Date().getMonth() + 1;
let aktuellesJahr = new Date().getFullYear();
let ausgewaehltesDatum = null;

$w.onReady(function () {
  ladeKalender();
});

// Завантажити календар для поточного місяця
async function ladeKalender() {
  const buchungen = await getBuchungenFuerMonat(aktuellesJahr, aktuellerMonat);
  
  // Оновити відображення місяць/рік
  $w('#monthYearText').text = `${getMonatsName(aktuellerMonat)} ${aktuellesJahr}`;
  
  // Згенерувати дні календаря
  const tage = generiereKalenderTage(aktuellesJahr, aktuellerMonat);
  
  // Позначити заброньовані дні
  tage.forEach(tag => {
    const tagBuchungen = buchungen.filter(b => b.buchungsDatum === tag.datum);
    if (tagBuchungen.length > 0) {
      tag.status = 'gebucht'; // Червоний
    } else if (istVergangenheit(tag.datum)) {
      tag.status = 'vergangen'; // Сірий
    } else {
      tag.status = 'frei'; // Зелений
    }
  });
  
  // Заповнити повторювач
  $w('#calendarRepeater').data = tage;
  
  // Налаштувати обробники кліків
  $w('#calendarRepeater').onItemReady(($item, itemData) => {
    $item('#dayButton').onClick(() => {
      tagGewaehlt(itemData.datum);
    });
    
    // Колірне кодування
    if (itemData.status === 'gebucht') {
      $item('#dayButton').style.backgroundColor = '#FEE2E2'; // Світло-червоний
      $item('#dayButton').style.color = '#DC2626'; // Червоний текст
    } else if (itemData.status === 'vergangen') {
      $item('#dayButton').style.backgroundColor = '#F3F4F6'; // Сірий
      $item('#dayButton').disable();
    } else {
      $item('#dayButton').style.backgroundColor = '#D1FAE5'; // Світло-зелений
      $item('#dayButton').style.color = '#059669'; // Зелений текст
    }
  });
}

// Згенерувати дні календаря
function generiereKalenderTage(jahr, monat) {
  const tage = [];
  const anzahlTage = new Date(jahr, monat, 0).getDate();
  
  for (let tag = 1; tag <= anzahlTage; tag++) {
    const datum = `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
    tage.push({
      _id: datum,
      tag: tag,
      datum: datum,
      status: 'frei'
    });
  }
  
  return tage;
}

// Обробити вибір дня
function tagGewaehlt(datum) {
  ausgewaehltesDatum = datum;
  console.log('Datum gewählt:', datum);
  
  // Показати вибір часового блоку
  $w('#timeBlockSection').expand();
  $w('#timeBlockSection').scrollTo();
}

// Навігація по місяцях
$w('#prevMonthButton').onClick(() => {
  aktuellerMonat--;
  if (aktuellerMonat < 1) {
    aktuellerMonat = 12;
    aktuellesJahr--;
  }
  ladeKalender();
});

$w('#nextMonthButton').onClick(() => {
  aktuellerMonat++;
  if (aktuellerMonat > 12) {
    aktuellerMonat = 1;
    aktuellesJahr++;
  }
  ladeKalender();
});

// Допоміжні функції
function getMonatsName(monat) {
  const namen = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return namen[monat - 1];
}

function istVergangenheit(datum) {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return new Date(datum) < heute;
}
```

---

## 7. Інтеграція платежів

### Крок 7.1: Налаштування Wix Payments

1. Перейдіть до **"Settings"** → **"Accept Payments"**
2. Натисніть **"Get Started with Wix Payments"**
3. Слідуйте майстру налаштування:
   - Інформація про бізнес
   - Банківський рахунок (швейцарський рахунок)
   - Документи для верифікації
4. Увімкніть способи оплати: Кредитна картка, Дебетова картка

### Крок 7.2: Потік оплати

```javascript
import wixPay from 'wix-pay-backend';

async function initiatePayment(buchung) {
  // Створити об'єкт оплати
  const payment = {
    items: [
      {
        name: `Robihütte - ${buchung.zeitBlock}`,
        price: buchung.mietPreis,
        quantity: 1
      }
    ],
    amount: buchung.gesamtPreis,
    currency: 'CHF',
    description: `Buchung ${buchung.referenzNummer}`
  };
  
  if (buchung.reinigungZusatz) {
    payment.items.push({
      name: 'Reinigung',
      price: buchung.reinigungsPreis,
      quantity: 1
    });
  }
  
  // Почати оплату
  const paymentResult = await wixPay.startPayment(payment.amount, {
    paymentInfo: {
      items: payment.items,
      description: payment.description
    }
  });
  
  if (paymentResult.status === 'Approved') {
    // Оновити статус бронювання
    await wixData.update('Buchungen', {
      _id: buchung._id,
      zahlungsStatus: 'bezahlt'
    });
    
    // Показати повідомлення про успіх
    $w('#successBox').expand();
    $w('#successText').text = `Buchung erfolgreich! Referenz: ${buchung.referenzNummer}`;
    
    // Відправити підтвердження email
    sendeBestaetigung(buchung);
  }
}
```

---

## 8. Email повідомлення

### Крок 8.1: Налаштування автоматичних email

1. Перейдіть до **"Settings"** → **"Automations"**
2. Натисніть **"New Automation"**
3. Виберіть тригер: **"Item Added to Collection"**
4. Виберіть колекцію: **"Buchungen"**
5. Дія: **"Send Email"**

**Шаблон email:**

**Тема:** `Buchungsbestätigung - Robihütte ({{item.referenzNummer}})`

**Тіло:**

```
Hallo {{item.benutzerName}},

Ihre Buchung für die Robihütte wurde bestätigt!

**Buchungsdetails:**
- Referenznummer: {{item.referenzNummer}}
- Datum: {{item.buchungsDatum}}
- Zeit: {{item.startZeit}} - {{item.endZeit}}
- Zeitblock: {{item.zeitBlock}}
- Veranstaltungstyp: {{item.veranstaltungsTyp}}

**Kosten:**
- Miete: CHF {{item.mietPreis}}
- Reinigung: CHF {{item.reinigungsPreis}}
- **Gesamt: CHF {{item.gesamtPreis}}**
- Kaution (bar bei Schlüsselübergabe): CHF {{item.kaution}}

Bei Fragen kontaktieren Sie uns: info@elternvereinigung.ch

Herzliche Grüsse,
Elternvereinigung Oberglatt
```

---

## 9. Тестування та запуск

### Крок 9.1: Контрольний список тестування

**Тестуйте на попередньому перегляді Wix:**

1. Натисніть кнопку **"Preview"** (вгорі праворуч)
2. Тестуйте на **Desktop**, **Tablet**, **Mobile**

**Тестові функції:**

- [ ] Головна сторінка завантажується з подіями
- [ ] Меню навігації працює
- [ ] Процес входу/реєстрації
- [ ] Вихід
- [ ] Календар відображається правильно
- [ ] Вибір дати працює
- [ ] Розрахунок ціни (4г, 12г, 24г)
- [ ] Ціни для членів та зовнішніх
- [ ] Подання форми бронювання
- [ ] Процес оплати (використовуйте тестовий режим)
- [ ] Отримано email підтвердження
- [ ] Отримано сповіщення адміністратора
- [ ] Адаптивність для мобільних пристроїв
- [ ] Всі посилання працюють

### Крок 9.2: Опублікувати сайт

1. Натисніть кнопку **"Publish"** (вгорі праворуч)
2. Підтвердьте домен: **elternvereinigung.ch**
3. Натисніть **"Publish Now"**

**⏱ Публікація займає 2-5 хвилин**

---

## 🎯 Підсумковий контрольний список

**✅ Налаштування (День 1)**
- [x] Створити сайт Wix
- [x] Увімкнути Velo
- [x] Увімкнути Wix Members
- [x] Оновитися до Premium

**✅ База даних (День 1)**
- [x] Створити 8 колекцій
- [x] Встановити дозволи
- [x] Попередньо заповнити ціни

**✅ Бекенд (День 2)**
- [x] Створити `buchungsLogik.jsw`
- [x] Створити `inhaltLogik.jsw`
- [x] Протестувати функції в консолі

**✅ Фронтенд (День 3-4)**
- [x] Створити всі сторінки
- [x] Створити дизайн заголовка/навігації
- [x] Побудувати головну сторінку
- [x] Побудувати сторінку Robihütte
- [x] Побудувати сторінку бронювання з календарем
- [x] Стилізувати всі елементи

**✅ Функції (День 5)**
- [x] Синхронізація автентифікації
- [x] Форма бронювання
- [x] Інтеграція платежів
- [x] Email сповіщення

**✅ Тестування (День 6)**
- [x] Протестувати всі функції
- [x] Мобільне тестування
- [x] Тестування платежів

**✅ Запуск (День 7)**
- [x] Опублікувати сайт
- [x] Підключити домен
- [x] Моніторити проблеми

---

## 🆘 Усунення несправностей

**Проблема: Колекція не відображається в коді**
- Рішення: Переконайтеся, що дозволи колекції встановлені правильно
- Перевірте: CMS → Колекція → Permissions → "What can site members do?"

**Проблема: Оплата не працює**
- Рішення: Переконайтеся, що Wix Payments повністю верифіковано
- Перевірте: Settings → Accept Payments → Status

**Проблема: Email не відправляються**
- Рішення: Перевірте, чи автоматизація увімкнена
- Перевірте: Settings → Automations → Status

**Проблема: Неправильні дати календаря**
- Рішення: Перевірте формат дати (YYYY-MM-DD)
- Підтвердьте часовий пояс у налаштуваннях колекції

---

## 📚 Додаткові ресурси

**Документація Wix:**
- Довідка Velo API: https://www.wix.com/velo/reference/api-overview
- Wix Data: https://www.wix.com/velo/reference/wix-data
- Wix Members: https://www.wix.com/velo/reference/wix-members
- Wix Pay: https://www.wix.com/velo/reference/wix-pay

**Спільнота:**
- Форум Wix: https://www.wix.com/forum/
- Приклади Velo: https://www.wix.com/velo/examples

---

**🎉 Вітаємо! Ваш сайт Wix тепер готовий!**

Якщо ви зіткнетеся з будь-якими проблемами під час міграції, зверніться до:
- Цього посібника
- Підтримки Wix: support@wix.com
- Форуму спільноти Velo

**Успіхів з вашою міграцією! 🚀**
