import { MouseEventHandler, ReactNode, CSSProperties, useState, useEffect } from "react";

type TProps = {
  children: ReactNode;
  loading: boolean;
  success?: boolean;
  successText?: string;
  type?: "submit" | "button";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  style?: CSSProperties;
  accentColor?: string | null;
  successResetDuration?: number;
};

export default function LoadingButton({
  children,
  loading,
  successText,
  success = false,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  style,
  successResetDuration
}: TProps) {

  const [ isSuccess, setIsSuccess ] = useState(success);

  useEffect(() => {
    if (success) {
      setIsSuccess(success);
    }
    if (successResetDuration) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        clearTimeout(timeout);
      }, successResetDuration);
    }
  }, [ success ]);

  return (
    <>
      <style>
        {`
            .loader {
              display: inline-flex;
              gap: 5px;
            }
            .loader:before,
            .loader:after {
              content: "";
              width: 22px;
              aspect-ratio: 1;
              box-shadow: 0 0 0 3px inset #fff;
              animation: l4 1.5s infinite;
            }
            .loader:after {
              --s: -1;
              animation-delay: 0.75s;
            }
            @keyframes l4 {
              0%     {transform:scaleX(var(--s,1)) translate(0) rotate(0);}
              16.67% {transform:scaleX(var(--s,1)) translate(-50%) rotate(0);}
              33.33% {transform:scaleX(var(--s,1)) translate(-50%) rotate(90deg);}
              50%, 100% {transform:scaleX(var(--s,1)) translate(0) rotate(90deg);}
            }
        `}
      </style>
      <button
        disabled={disabled}
        type={type}
        style={style}
        onClick={onClick}
        className={`flex align-center group h-max max-h-m relative btn justify-center py-2 ${
          loading ? "cursor-progress" : ""
        } ${className} ${isSuccess ? "!bg-green-500 !text-white" : ""}`}
      >
        <div
          className={`${
            !loading && "!hidden"
          } absolute left-[50%] translate-x-[-20px] h-[18px] w-[40px] top-0 bottom-0 my-auto`}
        ></div>
        <span className={`${loading ? "invisible" : ""} py-0.5 animate-fade-in`}>
          {isSuccess && successText ? successText : children}
        </span>
        <div
          className={`${
            !loading && "hidden"
          } flex items-center duration-500 my-auto top-0 bottom-0 animate-fade-in justify-center absolute`}
        >
          <div className="loader"></div>
        </div>
      </button>
    </>
  );
}