// создание холста для рисования
import { useEffect, useRef } from 'react'
import { PixiBoard } from '../pixi/PixiBoard'

export const CanvasStage = () => {

    const hostRef = useRef(null) // зафиксируем div контейнер для canvas
    const boardRef = useRef(null) // зафиксируем экземпляр PixiBoard


    // создаем экземпляр PixiBoard один раз
    if (!boardRef.current) {
        boardRef.current = new PixiBoard();
    }

    useEffect(() => {
        // монтируем PixiBoard в div контейнер при первом рендере
        boardRef.current.mount(hostRef.current)
        // когда CanvasStage размонтируется, удаляем PixiBoard
        return () => {
            boardRef.current.destroy()
        }
    }, [])

  return (
    <div className='w-full h-full bg-surface'>
        <div ref={hostRef} className='w-full h-full overflow-hidden'></div>
    </div>
  )
}
