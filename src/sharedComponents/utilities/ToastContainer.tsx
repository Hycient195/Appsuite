'use client'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

interface ToastProviderProps {
  children: React.ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const contextClass = {
    success: 'border-green-600 bg-green-100 text-green-700 ',
    error: 'border-red-300 bg-red-100 text-red-500',
    info: 'bg-orange-100 text-orange-500',
    warning: 'bg-orange-400',
    default: 'bg-indigo-600',
    dark: 'bg-white-600 font-gray-300',
  }

  return (
    <div>
      {children}
      <ToastContainer
     
        toastClassName={(context) =>
          contextClass[context?.type || 'default'] +
          ' relative flex py-1 px-4 min-h-10 flex rounded-md shadow border border-test justify-between overflow-hidden cursor-pointer items-center'
        }
        // bodyClassName={() => 'text-sm font-md block p-3 flex'}
        position="top-right"
        autoClose={3000}
      />
    </div>
  )
}
