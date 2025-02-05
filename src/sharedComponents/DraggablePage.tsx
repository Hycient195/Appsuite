import { useDrag, useDrop } from 'react-dnd';
import React, { LegacyRef, useRef } from 'react';

const ItemTypes = {
  PAGE: 'page',
};

interface IProps {
  pageIndex: number;
  movePage: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode | JSX.Element;
  ref?: React.RefObject<HTMLDivElement|null>;
}

const DraggablePage: React.FC<IProps> = ({ pageIndex, movePage, children, ref }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.PAGE,
    item: { pageIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PAGE,
    hover: (draggedItem: { pageIndex: number }) => {
      if (draggedItem.pageIndex !== pageIndex) {
        movePage(draggedItem.pageIndex, pageIndex);
        draggedItem.pageIndex = pageIndex;
      }
    },
  });

  // Ref for the main container to receive the drop and preview refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Attach the drop and preview refs to the container element
  drop(preview(containerRef));

  return (
    <div
      ref={containerRef}
      // ref={(el: HTMLDivElement) => {(containerRef.current as HTMLDivElement) = el; (ref!.current as HTMLDivElement) = el }}
      // ref={ref as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="relative w-full max-w-[1080px] mx-auto "
    >
      {children}
      
      {/* Drag handle at the top right */}
      <div className="noExport absolute max-lg:hidden top-3 right-4 cursor-move" ref={drag as unknown as LegacyRef<HTMLDivElement>}>
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </div>
    </div>
  );
};

export default DraggablePage;