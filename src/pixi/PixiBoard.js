// PixiBoard — это не React-компонент, а класс, управляющий PixiJS Application
// mount(host) — создает app и монтирует canvas в host
// destroy() — удаляет canvas, чтобы освободить ресурсы PixiJS

import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';


export class PixiBoard {
    constructor() {
        this.app = null // ссылка на PixiJS Application
        this.host = null // ссылка на div контейнер для canvas
        this.canvas = null // ссылка на canvas элемент
        this.resizeObserver = null // ссылка на ResizeObserver(отслеживает размер контейнера)
        this.inputLayer = null; // слой для обработки ввода(ловит события указателя)
        this.cursorGraphics = null; // графика курсора(грубо говоря точка, рисуемая при движении мыши)

        this.isMounting = false // флаг процесса монтирования

        this.destroyRequested = false; // флаг запроса на уничтожение

        this.initPromise = null; // обещание инициализации приложения(pixi еще загружается, т.е. ждем await)

        this.isPointerDown = false; // флаг состояния указателя (нажата ли кнопка мыши)

        this.debugText = null; // текст для отладки     
    }



    // Асинхронный метод, который инициализирует и монтирует PixiJS Application
    async mount(hostElement) {
        if (this.app) return; // проеверяем, не смонтировано ли уже приложение, если да, то выходим
        if (!hostElement) return; // проверяем, что ссылка на контейнер передана, если нет, то выходим


        this.host = hostElement; // сохраняем ссылку на контейнер для canvas
        this.destroyRequested = false; // сбрасываем флаг запроса на уничтожение


        this.isMounting = true; // устанавливаем флаг процесса монтирования

        // Основная логика монтирования PixiJS Application
        try {
            const app = new Application() // создаем PixiJS Application(pixi еще не готов, т.е. canvas не добавлен в DOM и рендерер не инициализирован)

            // ждем инициализации приложения(создание рендерера и canvas)
            this.initPromise = app.init({ backgroundAlpha: 0 }); // 
            await this.initPromise;
            this.initPromise = null; // сбрасываем обещание инициализации после завершения

            // проверяем, не был ли вызван destroy во время инициализации
            if (this.destroyRequested) {
                // если во время инициализации был вызван destroy, то сразу уничтожаем приложение и выходим
                app.destroy(true);
                return;
            }

            // если все нормально, сохраняем ссылку на приложение
            this.app = app;

            const style = new TextStyle({
                fontSize: 16,
                fill: '#ffffff',
            });

            this.debugText = new Text('debug info', style);
            this.debugText.x = 12;
            this.debugText.y = 12;
            this.app.stage.addChild(this.debugText);


            // создаем слой для обработки ввода (ловит события указателя)
            this.inputLayer = new Container(); // создаем слой для обработки ввода
            this.inputLayer.eventMode = 'static'; // включаем обработку событий
            this.inputLayer.hitArea = this.app.renderer.screen; // задаем область для событий на весь экран(разрешение на клики по всему canvas)
            this.app.stage.addChild(this.inputLayer); // добавляем слой ввода на сцену(чтобы он был поверх других слоев)


            // создаем графику для курсора (точка, рисуемая при движении мыши)
            this.cursorGraphics = new Graphics(); // создаем графику для курсора
            this.inputLayer.addChild(this.cursorGraphics); // добавляем графику курсора на слой ввода

            // добавляем подписки на события указателя(т.е. если пользователь кликает или двигает мышью, то вызываются соответствующие методы)
            this.onPointerDown = (e) => this._handlePointerDown(e);
            this.onPointerMove = (e) => this._handlePointerMove(e);
            this.onPointerUp = (e) => this._handlePointerUp(e);

            // Регистрируем обработчики событий на слой ввода
            this.inputLayer.on('pointerdown', this.onPointerDown);
            this.inputLayer.on('pointermove', this.onPointerMove);
            this.inputLayer.on('pointerup', this.onPointerUp);
            this.inputLayer.on('pointerupoutside', this.onPointerUp);


            // настраиваем стили для canvas, чтобы он занимал весь контейнер
            const canvas = app.canvas // получаем canvas из PixiJS Application
            canvas.style.display = 'block' // убираем отступы вокруг canvas
            canvas.style.width = '100%' // делаем canvas адаптивным по ширине
            canvas.style.height = '100%' // делаем canvas адаптивным по высоте

            // сохраняем ссылки для дальнейшего использования
            this.canvas = canvas;

            // добавляем canvas на страницу(т.е. в host элемент)
            this.host.appendChild(canvas)


            // настраиваем ResizeObserver для отслеживания изменений размера контейнера
            this.setupResizeObserver();


        } finally {
            this.isMounting = false; // сбрасываем флаг процесса монтирования
            this.initPromise = null; // сбрасываем обещание инициализации на всякий случай
        }
    }

    // Настраиваем ResizeObserver для отслеживания изменений размера контейнера
    setupResizeObserver() {
        if (!this.host) return; // если нет контейнера, ничего не делаем
        if (!this.app) return; // если нет приложения, ничего не делаем

        // Отключаем предыдущий наблюдатель, если он был
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Функция для применения нового размера
        const applyResize = () => {

            if (!this.host || !this.app) return; // проверка на существование ссылок и приложения

            const width = Math.max(1, Math.round(this.host.clientWidth)); // вычисляем новый размер и предотвращаем нулевые значения
            const height = Math.max(1, Math.round(this.host.clientHeight));
            this.app.renderer.resize(width, height); // изменяем размер рендерера


            // Обновляем область для событий ввода
            if (this.inputLayer) {
                this.inputLayer.hitArea = this.app.renderer.screen;
            }
        };

        // Создаем новый ResizeObserver
        this.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Проверяем, что изменение произошло для нашего контейнера
                if (entry.target === this.host) {
                    // Применяем новый размер к PixiJS Application
                    applyResize();
                }
            }
        });

        // Начинаем наблюдение за изменениями размера контейнера
        this.resizeObserver.observe(this.host);


        // Применяем начальный размер
        applyResize();
    }

    // Обработчики событий указателя
    _handlePointerDown(e) {
        this.isPointerDown = true;

        const global = e.global;
        const local = this.inputLayer.toLocal(global); // преобразуем глобальные координаты в локальные

        const gx = Math.round(global.x);
        const gy = Math.round(global.y);

        const lx = Math.round(local.x);
        const ly = Math.round(local.y);

        this.debugText.text = `global:${gx},${gy}\nlocal:${lx},${ly}\ndown:${this.isPointerDown}`
    }

    // Обработчик движения указателя
    _handlePointerMove(e) {
        const global = e.global;
        const local = this.inputLayer.toLocal(global);

        const gx = Math.round(global.x);
        const gy = Math.round(global.y);

        const lx = Math.round(local.x);
        const ly = Math.round(local.y);

        this.debugText.text = `global:${gx},${gy}\nlocal:${lx},${ly}\ndown:${this.isPointerDown}`

        if (this.cursorGraphics) {
            this.cursorGraphics.clear();
            // рисуем в global координатах (потому что cursorGfx на stage)
            this.cursorGraphics.circle(gx, gy, 3).fill(0x58e000);
        }

    }

    // Обработчик отпускания указателя
    _handlePointerUp(e) {
        this.isPointerDown = false;

        const global = e.global;
        const local = this.inputLayer.toLocal(global);

        const gx = Math.round(global.x);
        const gy = Math.round(global.y);

        const lx = Math.round(local.x);
        const ly = Math.round(local.y);

        this.debugText.text = `global:${gx},${gy}\nlocal:${lx},${ly}\ndown:${this.isPointerDown}`

    }



    destroy() {
        this.destroyRequested = true; // устанавливаем флаг запроса на уничтожение

        // если мы в процессе монтирования, ждем его завершения
        if (this.isMounting || this.initPromise) {
            return;
        }
        // Отключаем ResizeObserver
        if (this.resizeObserver && this.host) {
            this.resizeObserver.unobserve(this.host);
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Отсоединяем обработчики событий от слоя ввода
        if (this.inputLayer) {
            this.inputLayer.off('pointerdown', this.onPointerDown);
            this.inputLayer.off('pointermove', this.onPointerMove);
            this.inputLayer.off('pointerup', this.onPointerUp);
            this.inputLayer.off('pointerupoutside', this.onPointerUp);
        }
        // очищаем ссылки на обработчики
        this.onPointerDown = null;
        this.onPointerMove = null;
        this.onPointerUp = null;

        // уничтожаем графику курсора
        if (this.cursorGraphics) {
            this.cursorGraphics.destroy();
            this.cursorGraphics = null;
        }

        // уничтожаем слой ввода
        if (this.inputLayer) {
            this.inputLayer.destroy({ children: true });
            this.inputLayer = null;
        }

        this.debugText?.destroy(); // уничтожаем текст отладки
        
        this.canvas?.remove() // удаляем canvas с проверкой на существование
        this.app?.destroy(true) // уничтожаем PixiJS Application и освобождаем ресурсы
        
        
        
        // очищаем ссылки
        this.app = null
        this.canvas = null
        this.host = null
        this.debugText = null; // очищаем ссылку на текст отладки
    }



}