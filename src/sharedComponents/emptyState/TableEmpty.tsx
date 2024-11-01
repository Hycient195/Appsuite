

interface IProps {
  colSpan: number;
  children?: JSX.Element|React.ReactNode
  text?: string;
}

export default function TableEmpty({ colSpan, children, text = "No records to display in the table." }: IProps) {
  return (
    <tr className="border-y border-y-zinc-200 animate-fade-in">
      <td colSpan={colSpan} className="text-zinc-500 text-center">
        {children??text}
      </td>
    </tr>
  )
}