// создание холста для рисования
import { useEffect, useRef, useState } from 'react'
import { PixiBoard } from '../pixi/PixiBoard'
import { Toolbar } from './Toolbar'

export const CanvasStage = () => {

    const [tool, setTool] = useState('draw') // режим доски: 'draw' — рисование, 'erase' — ластик
    const [size, setSize] = useState(8) // размер кисти/ластика
    const [brushColor, setBrushColor] = useState(0x000000) // цвет кисти (черный по умолчанию)

    const hostRef = useRef(null) // зафиксируем div контейнер для canvas
    const boardRef = useRef(null) // зафиксируем экземпляр PixiBoard

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

    // изменение размера кисти/ластика
    const handleSizeChange = (nextSize) => {
        setSize(nextSize)
    }

    // изменение цвета кисти
    const handleBrushColorChange = (nextColor) => {
        setBrushColor(nextColor)
    }


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

    // обновление размера кисти/ластика в PixiBoard при изменении состояния size
    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.setToolSize(size)
        }
    }, [size])

    // обновление цвета кисти в PixiBoard при изменении состояния brushColor
    useEffect(() => {
        if (boardRef.current) {
            boardRef.current.setBrushColor(brushColor)
        }
    }, [brushColor])


    return (
        <div className='flex h-full w-full flex-col bg-bg overflow-hidden'>
            <Toolbar
                tool={tool}
                onSelectTool={handleSelectTool}
                onClear={handleClear}
                size={size}
                onSizeChange={handleSizeChange}
                brushColor={brushColor}
                onBrushColorChange={handleBrushColorChange}

            />

            <div className='relative flex-1 bg-white'>
                <div ref={hostRef} className='absolute inset-0' />
            </div>
        </div>
    )
}
