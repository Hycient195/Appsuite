import Link from "next/link";
import { CloseIcon } from "./CustomIcons";
import { motion, useDragControls, useMotionValue } from "motion/react"
import { FormText, FormTextArea } from "./FormInputs";
import Image from "next/image";
import { useState } from "react";


interface IProps {
  handleModalClose?: () => void;
  modalClassName?: string;
  children: React.ReactNode;
  isModalOpen?: boolean;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((arg: boolean) => void);
  modalData?: any
}

export default function CustomModal({ handleModalClose, modalClassName, children, isModalOpen, setIsModalOpen, modalData }: IProps) {
  const controls = useDragControls();
  const motionY = useMotionValue(0);

  const closeModal = () => {
    if (handleModalClose) {
      handleModalClose()
    } else if (setIsModalOpen) {
      setIsModalOpen(false)
    }
  }

  return (
    <ModalContextProvider handleModalClose={closeModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} modalData={modalData}>
       <section  className="screen-no-scroll slide-over fixed min-h-[100dvh] h-[100dvh] w-full top-0 left-0 flex z-[3] overflow-y-scroll">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 100 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed top-0 left-0 min-h-[100dvh] h-[100dvh] w-full bg-black/50" />
        <div  className={`md:px-3 lg:px-4 z-[1] mt-auto md:mb-auto w-full max-w-2xl mx-auto ${modalClassName}`}>
          <motion.div
            initial={{ translateY: "100%" }}
            animate={{ translateY: 0 }}
            exit={{ translateY: "100%" }}
            dragControls={controls}
            dragListener={false}
            style={{ y: motionY }}
            dragConstraints={{
              top: 0,
              bottom: 0
            }}
            dragElastic={{
              top: 0,
              bottom: 1
            }}
            onDragEnd={() => {
              if (motionY.get() > 80) {
                closeModal();
              }
            }}
            drag="y"
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="w-full relative animate-slide-in-botto md:animate-fade-in max-md:pt-7 flex flex-col overflow-y-auto max-md:rounded-t-2xl md:rounded-lg lg:rounded-xl bg-white p-5 md:p-6 md:max-w-screen-xl md:mx-auto"
          >
            <button onPointerDown={(e) => controls.start(e)} className="absolute touch-none cursor-grab left-0 right-0 top-0 w-max mx-auto px-8 py-3">
              <div className="h-1.5 md:hidden rounded-full bg-slate-400 w-24" />
            </button>
            <button onClick={closeModal} className={`md:absolute max-md:hidden ml-auto w-max top-3 right-3 bg-white rounded-full p-1.5 md:p-1.5 border border-zinc-400`} >
              <CloseIcon className="!size-3" />
            </button>            
            <div className=" h-max">
              {children}
            </div>

          </motion.div>
        </div>
      </section>
    </ModalContextProvider>
  )
}

import React, { createContext, useContext, ReactNode } from 'react';

interface ModalContextType<T> {
  isModalOpen?: boolean;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((arg: boolean) => void)
  handleModalClose: () => void;
  modalData?: T;
}

const ModalContext = createContext<ModalContextType<any> | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalContextProvider: React.FC<ModalProviderProps & ModalContextType<any>> = ({ children, isModalOpen, setIsModalOpen, handleModalClose, modalData }) => {
  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen, handleModalClose, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useModalContext<T> (): ModalContextType<T> {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  return context;
};