# pixi-draw

Учебный проект-шаблон: простая **paint-like** доска для рисования на **PixiJS v8**, где **React управляет состоянием и UI**, а **Pixi исполняет (canvas, события, графика)**.

Цель проекта — закрепить правильную архитектуру *React ↔ Pixi* и иметь эталон, к которому можно вернуться через месяц и быстро всё вспомнить.

---

## Стек

- Vite
- React (JavaScript, без TypeScript)
- Tailwind CSS v3
- PixiJS v8

---

## Идея архитектуры

**React → управляет**: хранит state (tool/size/color), показывает UI (Toolbar), вызывает методы ядра.

**PixiJS → исполняет**: создает canvas, обрабатывает pointer-события, рисует Graphics.

Ключевое правило: **PixiBoard — НЕ React-компонент**. Это императивный класс (как “движок”).

```
Toolbar.jsx (UI)  →  CanvasStage.jsx (adapter/state)  →  PixiBoard.js (core)
```

Подробно: см. [`docs/PIXIDRAW_MEMO.md`](docs/PIXIDRAW_MEMO.md).

---

## Запуск проекта

```bash
npm install
npm run dev
```

Открой адрес из консоли (обычно http://localhost:5173).

---

## Реализованный функционал

- Toolbar (верхняя панель + ribbon)
- Инструменты:
  - Pen
  - Eraser (частичное стирание поверх уже нарисованного)
  - Clear
- Один общий **size slider** для Pen и Eraser
- Палитра 10 цветов (classic Paint vibe), дефолт — **чёрный**
- Cursor-indicator размера инструмента:
  - Pen → кольцо
  - Eraser → белый квадрат с чёрной обводкой
- Курсор:
  - обновляется при `pointermove`
  - **реагирует на смену tool/size/color без движения мыши** (через сохранение последней позиции)

---

## Для кого

- Для обучения PixiJS v8 “с нуля”
- Для закрепления “правильной” связки **React UI → Pixi core**
- Как reference/шаблон для будущих проектов Pixi + React (без сторонних библиотек)

---

## Структура проекта

```
src/
  app/App.jsx
  pixi/PixiBoard.js
  ui/CanvasStage.jsx
  ui/Toolbar.jsx
  index.css
  main.jsx
docs/
  PIXIDRAW_MEMO.md
  assets/
    architecture.png
    dataflow.png
```



