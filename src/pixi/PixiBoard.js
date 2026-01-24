// PixiBoard — это не React-компонент, а класс, управляющий PixiJS Application
// mount(host) —создает app и монтирует canvas в host
// destroy() — удаляет canvas, чтобы освободить ресурсы PixiJS


import { Application } from 'pixi.js'

export class PixiBoard {
    constructor() {
        this.app = null // ссылка на PixiJS Application
        this.host = null // ссылка на div контейнер для canvas
        this.canvas = null // ссылка на canvas элемент
    }

    async mount(hostElement) {
        if (!hostElement) return; // проверка на существование div контейнера
        if (this.app) return; // уже смонтировано


        this.isMounting = true; // флаг процесса монтирования

        // используем  try...finally чтобы сбросить флаг монтирования в случае ошибки
        try{

            this.host = hostElement // сохраняем ссылку на контейнер для canvas
            const app = new Application() // создаем PixiJS Application
    
            // инициализация приложения с опциями
            await app.init({
                backgroundAlpha: 0, // прозрачный фон
                resizeTo: this.host, // автоматическое изменение размера под контейнер
            });
    
    
            const canvas = app.canvas // получаем canvas из PixiJS Application
            canvas.style.display = 'block' // убираем отступы вокруг canvas
            canvas.style.width = '100%' // делаем canvas адаптивным по ширине
            canvas.style.height = '100%' // делаем canvas адаптивным по высоте
    
    
            this.host.appendChild(canvas)  // добавляем canvas в контейнер
    
            // сохраняем ссылки для дальнейшего использования
            this.app = app;
            this.canvas = canvas;
        } finally {
            this.isMounting = false; // сбрасываем флаг процесса монтирования
        }
    }

    destroy() {
        if (!this.app) return; // если не смонтировано, ничего не делаем

        // уничтожаем PixiJS Application и освобождаем ресурсы
        this.app.destroy(true)

        this.canvas?.remove() // удаляем canvas с проверкой на существование

        // очищаем ссылки
        this.app = null
        this.canvas = null
        this.host = null
    }
}