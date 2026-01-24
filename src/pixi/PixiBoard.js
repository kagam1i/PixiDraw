// PixiBoard — это не React-компонент, а класс, управляющий PixiJS Application
// mount(host) —создает app и монтирует canvas в host
// destroy() — удаляет canvas, чтобы освободить ресурсы PixiJS


import { Application } from 'pixi.js'

export class PixiBoard {
    constructor() {
        this.app = null // ссылка на PixiJS Application
        this.host = null // ссылка на div контейнер для canvas
        this.canvas = null // ссылка на canvas элемент
        this.isMounting = false // флаг процесса монтирования
        this.resizeObserver = null // ссылка на ResizeObserver
    }

    async mount(hostElement) {
        if (!hostElement) return; // проверка на существование div контейнера
        if (this.app) return; // уже смонтировано
        if (this.isMounting) return; // уже в процессе монтирования

        this.isMounting = true; // устанавливаем флаг процесса монтирования
        
        // Основная логика монтирования
        try {
            this.host = hostElement // сохраняем ссылку на контейнер для canvas
            const app = new Application() // создаем PixiJS Application

            // сохраняем ссылку на приложение до await, чтобы избежать проблем с асинхронностью
            this.app = app;


            // инициализация приложения с опциями
            await app.init({
                backgroundAlpha: 0, // прозрачный фон
            });


            const canvas = app.canvas // получаем canvas из PixiJS Application
            canvas.style.display = 'block' // убираем отступы вокруг canvas
            canvas.style.width = '100%' // делаем canvas адаптивным по ширине
            canvas.style.height = '100%' // делаем canvas адаптивным по высоте


            this.host.appendChild(canvas)  // добавляем canvas в контейнер

            // сохраняем ссылки для дальнейшего использования
            this.canvas = canvas;

            // настраиваем ResizeObserver для отслеживания изменений размера контейнера
            this.setupResizeObserver();

        } finally {
            this.isMounting = false; // сбрасываем флаг процесса монтирования
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


    destroy() {
        if (!this.app) return; // если не смонтировано, ничего не делаем

        // Отключаем ResizeObserver
        if (this.resizeObserver && this.host) {
            this.resizeObserver.unobserve(this.host);
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }


        // уничтожаем PixiJS Application и освобождаем ресурсы
        this.app.destroy(true)

        this.canvas?.remove() // удаляем canvas с проверкой на существование


        // очищаем ссылки
        this.app = null
        this.canvas = null
        this.host = null
    }
}