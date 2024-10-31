interface IProps {
  numCols: number;
  numRows?: number;
  children?: JSX.Element|React.ReactNode
  className?: string
}

export default function TableSkeleton({ numRows = 11, numCols, children, className }: IProps) {
  return (
    <>
      {
        Array.from({ length: numRows }).map((_, rowIndex) => (
          <tr key={`loader-row-${rowIndex}`} className="animate-pulse border-t border-t-white">
            {
              Array.from({ length: numCols }).map((_, colIndex) => (
                // <td style={{ animationDuration: `${((colIndex)*500)+1000}ms`}} key={`loader-col-${rowIndex}-${colIndex}`} className={`${rowIndex%2 === 0 && "bg-zinc-200 animate-pulse"}`}><span className="invisible">j</span></td>
                <td style={{ animationDuration: `${(Math.random()*1000)+1000}ms`}} key={`loader-col-${rowIndex}-${colIndex}`} className={`${rowIndex%2 === 0 ? "bg-zinc-300/80" : "bg-zinc-200/40"} ${className} cursor-progress animate-pulse`}>{children??<span className="invisible text-sm">j</span>}</td>
              ))
            }
          </tr>
        ))
      }
    </>
  )
}