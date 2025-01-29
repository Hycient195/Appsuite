interface IProps {
  children: React.ReactNode|JSX.Element
}

export default function BalanceSheetAppLayout({ children }: IProps) {
  // return <div className="w-full h-full grid">
  //   {children}
  // </div>
  return children
}