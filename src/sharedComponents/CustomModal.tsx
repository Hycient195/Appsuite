import Link from "next/link";
import { CloseIcon } from "./CustomIcons";
import { motion, useDragControls, useMotionValue } from "motion/react"
import { FormText, FormTextArea } from "./FormInputs";
import Image from "next/image";
import { useState } from "react";


interface IProps {
  handleModalClose: () => void;
  modalClassName?: string;
  children: React.ReactNode
}

export default function CustomModal({ handleModalClose, modalClassName, children }: IProps) {
  const controls = useDragControls();
  const motionY = useMotionValue(0);

  return (
    <section  className="screen-no-scroll slide-over fixed h-[100dvh] w-full top-0 left-0 flex z-[2] ">
      <motion.div exit={{ opacity: 0 }} onClick={handleModalClose} style={{ WebkitBackdropFilter: "blur(5px)"}} className="absolute h-full w-full animate-fade-in bg-black/50 backdrop-blur-sm" />
      <div  className={`md:px-3 lg:px-4 z-[1] mt-auto md:mb-auto w-full max-w-2xl mx-auto ${modalClassName}`}>
        <motion.div
          initial={{ translateY: "100%" }}
          animate={{ translateY: "0%" }}
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
            bottom: 0.5
          }}
          onDragEnd={() => {
            if (motionY.get() > 80) {
              handleModalClose();
            }
          }}
          drag="y"
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="w-full relative animate-slide-in-botto md:animate-fade-in max-md:pt-7 flex flex-col max-md:rounded-t-3xl md:rounded-lg lg:rounded-xl bg-white p-5 md:p-6 md:max-w-screen-xl md:mx-auto">
            <button onPointerDown={(e) => controls.start(e)} className="h-1.5 md:hidden touch-none cursor-grab rounded-full bg-slate-400 w-24 absolute left-0 right-0 top-3 mx-auto" />
          <button onClick={handleModalClose} className={`md:absolute max-md:hidden ml-auto w-max top-3 right-3 bg-white rounded-full p-1.5 md:p-1.5 border border-zinc-400`} >
            <CloseIcon className="!size-3" />
          </button>
          {/* <h3 className="text-3xl font-semibold md:hidden">Find a space</h3> */}
          
          <div className="">
            {children}
          </div>

        </motion.div>
      </div>
    </section>
  )
}
