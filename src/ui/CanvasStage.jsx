// создание холста для рисования
import { useEffect, useRef, useState } from 'react'
import { PixiBoard } from '../pixi/PixiBoard'
import { Toolbar } from './Toolbar'

export const CanvasStage = () => {

    const [tool, setTool] = useState('draw') // режим доски: 'draw' — рисование, 'erase' — ластик


    // выбор инструмента (переключение между рисованием и ластиком)
    const handleSelectTool = (nextTool) => {
        setTool(nextTool)
    }

    // очистка доски
    const handleClear = () => {
        // очищаем доску через метод PixiBoard
        if (boardRef.current) {
            boardRef.current.clear()
        }
    }

    const hostRef = useRef(null) // зафиксируем div контейнер для canvas
    const boardRef = useRef(null) // зафиксируем экземпляр PixiBoard

    // инициализация PixiBoard при монтировании CanvasStage
    useEffect(() => {
        // создаем новый экземпляр PixiBoard
        boardRef.current = new PixiBoard()

        // монтируем PixiBoard в div контейнер при первом рендере
        boardRef.current.mount(hostRef.current)

        // когда CanvasStage размонтируется, удаляем PixiBoard и очищаем ссылку
        return () => {
            boardRef.current?.destroy()
            boardRef.current = null
        }
    }, [])

    // обновление режима доски в PixiBoard при изменении состояния mode
    useEffect(() => {
        // при изменении режима обновляем режим доски в PixiBoard
        if (boardRef.current) {
            boardRef.current.setTool(tool)
        }
    }, [tool])

    return (
        <div className='relative w-full h-full bg-surface overflow-hidden'>
            {/* слой для Pixi canvas */}
            <div ref={hostRef} className='absolute inset-0' />

            {/* Toolbar поверх canvas (overlay) */}
            <div className='absolute left-3 top-3 z-20 pointer-events-auto'>
                <Toolbar
                    tool={tool}
                    onSelectTool={handleSelectTool}
                    onClear={handleClear}
                />
            </div>
        </div>
    )
}
