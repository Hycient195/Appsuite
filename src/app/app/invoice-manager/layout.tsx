import { ThemeProvider } from "./_contexts/ThemeProvider"

interface IProps {
  children: React.ReactNode|JSX.Element
}

export default function BalanceSheetAppLayout({ children }: IProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}