import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';


const ItemType = {
  ROW: 'row',
};

interface IProps {
  row: any;
  pageIndex: number;
  index: number;
  moveRow: any;
  children: any
}

const DraggableRow = ({ row, pageIndex, index, moveRow, children }: IProps) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.ROW,
    hover(item: any) {
      if (item.index === index) return;
      moveRow(item.index, index, pageIndex);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.ROW,
    item: { index, pageIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="group/row relative">
      <td className="drag-handle -left-4 px-1.5 cursor-grab text-center absolute">☰</td> {/* Drag Handle */}
      {children}
    </tr>
  );
};

export default DraggableRow