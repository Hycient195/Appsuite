// import { CSSProperties } from "react"
import { CSSProperties } from "react";
// import googleIcon from "@ images/shared/google-icon.png"
import googleIcon from "@/../public/images/shared/google-icon.png";
import Image from "next/image";

export const LogoIcon = ({ width = 30, height = 30,  className }: { width?: number, height?: number, className?: string}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="black"
      className={`animate-spin [animation-duration:4s] ${className}`}
      >

      <circle cx="50" cy="50" r="12" fill="black" />

      <path d="M50,10 A40,40 0 0,1 90,50" fill="none" stroke="black" strokeWidth="6" />
      <path d="M90,50 A40,40 0 0,1 50,90" fill="none" stroke="black" strokeWidth="6" />
      <path d="M50,90 A40,40 0 0,1 10,50" fill="none" stroke="black" strokeWidth="6" />
      <path d="M10,50 A40,40 0 0,1 50,10" fill="none" stroke="black" strokeWidth="6" />

      <circle cx="50" cy="10" r="6" fill="black" />
      <circle cx="90" cy="50" r="6" fill="black" />
      <circle cx="50" cy="90" r="6" fill="black" />
      <circle cx="10" cy="50" r="6" fill="black" />
    </svg>
  )
}

import { useEffect, useState } from 'react';

type StatusIconProps = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const StatusIcon: React.FC<StatusIconProps> = ({ isLoading, isSuccess, isError }) => {
  const [showDefaultIcon, setShowDefaultIcon] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setShowDefaultIcon(false);
    } else if (isSuccess && !isLoading) {
      setShowDefaultIcon(false);
    } else if (isError && !isLoading) {
      setShowDefaultIcon(false);
    }
  }, [isLoading, isSuccess, isError]);

  if (isLoading) {
    return (
      <div className="relative gri items-center justify-center h-max w-max">
        <svg width="45" height="45" viewBox="0 0 24 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
          <path d="M13.7507 3.74805C13.7507 2.78155 12.9672 1.99805 12.0007 1.99805C11.0342 1.99805 10.2507 2.78155 10.2507 3.74805C10.2507 4.71455 11.0342 5.49815 12.0007 5.49815C12.9672 5.49815 13.7507 4.71455 13.7507 3.74805Z" fill="#343C54"/>
          <path d="M18.366 6.69439C18.6589 6.4015 18.6589 5.92663 18.366 5.63373C18.0731 5.34084 17.5983 5.34084 17.3054 5.63373C17.0125 5.92663 17.0124 6.40157 17.3053 6.69446C17.5982 6.98736 18.0731 6.98729 18.366 6.69439Z" fill="#343C54"/>
          <path d="M21.1477 12C21.1477 12.4943 20.747 12.895 20.2527 12.895C19.7584 12.895 19.3576 12.4943 19.3576 12C19.3576 11.5057 19.7583 11.105 20.2526 11.105C20.7469 11.105 21.1477 11.5057 21.1477 12Z" fill="#343C54"/>
          <path d="M17.1003 18.5713C17.5064 18.9775 18.1649 18.9775 18.5711 18.5713C18.9772 18.1652 18.9772 17.5067 18.5711 17.1005C18.1649 16.6944 17.5064 16.6943 17.1002 17.1005C16.6941 17.5066 16.6942 18.1652 17.1003 18.5713Z" fill="#343C54"/>
          <path d="M12.0007 19.067C12.6552 19.067 13.1857 19.5975 13.1857 20.252C13.1857 20.9064 12.6552 21.4371 12.0007 21.4371C11.3463 21.4371 10.8157 20.9065 10.8157 20.2521C10.8157 19.5976 11.3463 19.067 12.0007 19.067Z" fill="#343C54"/>
          <path d="M7.10623 18.7764C7.62562 18.257 7.62562 17.4149 7.10623 16.8955C6.58683 16.3761 5.74472 16.3761 5.22532 16.8955C4.70592 17.4149 4.70585 18.2571 5.22525 18.7765C5.74465 19.2959 6.58683 19.2958 7.10623 18.7764Z" fill="#343C54"/>
          <path d="M5.22354 12C5.22354 12.8146 4.56316 13.475 3.74854 13.475C2.93392 13.475 2.27344 12.8146 2.27344 12C2.27344 11.1854 2.93382 10.525 3.74844 10.525C4.56306 10.525 5.22354 11.1854 5.22354 12Z" fill="#343C54"/>
          <path d="M5.02026 7.30958C5.65291 7.94222 6.67864 7.94222 7.31129 7.30958C7.94394 6.67693 7.94394 5.6512 7.31129 5.01855C6.67864 4.3859 5.65284 4.38583 5.02019 5.01848C4.38754 5.65113 4.38761 6.67693 5.02026 7.30958Z" fill="#343C54"/>
        </svg>

        <svg width="25" height="25" viewBox="0 0 25 25" fill="#343C54" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 bottom-0 my-auto left-0 right-0 translate-x-[0.5px] translate-y-[0.8px] bg-test50 mx-auto">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.3135 10.3086C10.1955 10.3086 8.47852 12.0256 8.47852 14.1436C8.47852 16.2616 10.1955 17.9786 12.3135 17.9786C14.4315 17.9786 16.1485 16.2616 16.1485 14.1436C16.1485 12.0256 14.4315 10.3086 12.3135 10.3086ZM9.97852 14.1436C9.97852 12.854 11.0239 11.8086 12.3135 11.8086C13.6031 11.8086 14.6485 12.854 14.6485 14.1436C14.6485 15.4332 13.6031 16.4786 12.3135 16.4786C11.0239 16.4786 9.97852 15.4332 9.97852 14.1436Z" fill="#343C54"></path>
          <path fillRule="evenodd" clipRule="evenodd" d="M15.6934 3.47852H5.8125C4.56986 3.47852 3.5625 4.48587 3.5625 5.72852V18.7285C3.5625 19.9712 4.56986 20.9785 5.8125 20.9785H18.8124C20.055 20.9785 21.0624 19.9712 21.0624 18.7285L21.0624 8.8427C21.0624 8.24536 20.8249 7.67254 20.4022 7.25049L17.2832 4.1363C16.8613 3.71509 16.2895 3.47852 15.6934 3.47852ZM5.8125 4.97852C5.39829 4.97852 5.0625 5.3143 5.0625 5.72852V18.7285C5.0625 19.1427 5.39829 19.4785 5.8125 19.4785H18.8124C19.2266 19.4785 19.5624 19.1427 19.5624 18.7285L19.5624 8.8427C19.5624 8.64359 19.4832 8.45265 19.3423 8.31196L16.2233 5.19778C16.0827 5.05737 15.8921 4.97852 15.6934 4.97852H14.0625L14.0625 5.72851C14.0625 6.97115 13.0551 7.97852 11.8125 7.97852H8.8125C7.56986 7.97852 6.5625 6.97116 6.5625 5.72852V4.97852H5.8125ZM8.0625 4.97852H12.5625L12.5625 5.72851C12.5625 6.14273 12.2267 6.47852 11.8125 6.47852H8.8125C8.39829 6.47852 8.0625 6.14273 8.0625 5.72852V4.97852Z" fill="#343C54"></path>
        </svg>
      </div>
    );
  }

  if (isError) {
    return (
      <svg width="35" height="35" viewBox="0 0 25 25" fill="#343C54" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.5625 4.97852C4.14829 4.97852 3.8125 5.3143 3.8125 5.72852V18.7285C3.8125 19.1427 4.14829 19.4785 4.5625 19.4785H6.31251L6.3125 15.7285C6.3125 14.4859 7.31986 13.4785 8.5625 13.4785H10.9464C10.6819 13.9471 10.4707 14.4499 10.3212 14.9785H8.5625C8.14829 14.9785 7.8125 15.3143 7.8125 15.7285L7.81251 19.4785H10.5813C10.8036 20.0163 11.0922 20.5197 11.4369 20.9785H4.5625C3.31986 20.9785 2.3125 19.9712 2.3125 18.7285V5.72852C2.3125 4.48587 3.31986 3.47852 4.5625 3.47852H14.4434C15.0395 3.47852 15.6113 3.71509 16.0332 4.1363L19.1522 7.25049C19.5749 7.67254 19.8124 8.24536 19.8124 8.8427L19.8124 10.6067C19.339 10.3884 18.8365 10.2224 18.3124 10.116L18.3124 8.8427C18.3124 8.64359 18.2332 8.45265 18.0923 8.31196L14.9733 5.19778C14.8327 5.05737 14.6421 4.97852 14.4434 4.97852H12.8125L12.8125 5.72851C12.8125 6.97115 11.8051 7.97852 10.5625 7.97852H7.5625C6.31986 7.97852 5.3125 6.97116 5.3125 5.72852V4.97852H4.5625ZM6.8125 4.97852V5.72852C6.8125 6.14273 7.14829 6.47852 7.5625 6.47852H10.5625C10.9767 6.47852 11.3125 6.14273 11.3125 5.72851L11.3125 4.97852H6.8125Z" fill="rgb(220 38 38)"></path>
        <path d="M14.9853 15.9622C14.6924 15.6693 14.6924 15.1945 14.9853 14.9016C15.2782 14.6087 15.7531 14.6087 16.046 14.9016L16.9372 15.7929L17.8285 14.9016C18.1214 14.6087 18.5962 14.6087 18.8891 14.9016C19.182 15.1945 19.182 15.6694 18.8891 15.9623L17.9979 16.8535L18.8891 17.7448C19.182 18.0377 19.182 18.5125 18.8891 18.8054C18.5962 19.0983 18.1214 19.0983 17.8285 18.8054L16.9372 17.9142L16.046 18.8055C15.7531 19.0983 15.2782 19.0983 14.9853 18.8055C14.6924 18.5126 14.6924 18.0377 14.9853 17.7448L15.8766 16.8535L14.9853 15.9622Z" fill="rgb(220 38 38)"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.5625 16.8535C11.5625 13.885 13.969 11.4785 16.9375 11.4785C19.906 11.4785 22.3125 13.885 22.3125 16.8535C22.3125 19.822 19.906 22.2285 16.9375 22.2285C13.969 22.2285 11.5625 19.822 11.5625 16.8535ZM16.9375 12.9785C14.7974 12.9785 13.0625 14.7134 13.0625 16.8535C13.0625 18.9936 14.7974 20.7285 16.9375 20.7285C19.0776 20.7285 20.8125 18.9936 20.8125 16.8535C20.8125 14.7134 19.0776 12.9785 16.9375 12.9785Z" fill="rgb(220 38 38)"></path>
      </svg>
    );
  }

  if (isSuccess && !isLoading && !showDefaultIcon) {
    return (
      <svg width="35" height="35" viewBox="0 0 25 25" fill="#343C54" xmlns="http://www.w3.org/2000/svg" className="animate-fade-in">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.5625 4.97852C4.14829 4.97852 3.8125 5.3143 3.8125 5.72852V18.7285C3.8125 19.1427 4.14829 19.4785 4.5625 19.4785H6.31251L6.3125 15.7285C6.3125 14.4859 7.31986 13.4785 8.5625 13.4785H10.9464C10.6819 13.9471 10.4707 14.4499 10.3212 14.9785H8.5625C8.14829 14.9785 7.8125 15.3143 7.8125 15.7285L7.81251 19.4785H10.5813C10.8036 20.0163 11.0922 20.5197 11.4369 20.9785H4.5625C3.31986 20.9785 2.3125 19.9712 2.3125 18.7285V5.72852C2.3125 4.48587 3.31986 3.47852 4.5625 3.47852H14.4434C15.0395 3.47852 15.6113 3.71509 16.0332 4.1363L19.1522 7.25049C19.5749 7.67254 19.8124 8.24536 19.8124 8.8427L19.8124 10.6067C19.339 10.3884 18.8365 10.2224 18.3124 10.116L18.3124 8.8427C18.3124 8.64359 18.2332 8.45265 18.0923 8.31196L14.9733 5.19778C14.8327 5.05737 14.6421 4.97852 14.4434 4.97852H12.8125L12.8125 5.72851C12.8125 6.97115 11.8051 7.97852 10.5625 7.97852H7.5625C6.31986 7.97852 5.3125 6.97116 5.3125 5.72852V4.97852H4.5625ZM6.8125 4.97852V5.72852C6.8125 6.14273 7.14829 6.47852 7.5625 6.47852H10.5625C10.9767 6.47852 11.3125 6.14273 11.3125 5.72851L11.3125 4.97852H6.8125Z" fill="rgb(22 190 74)"></path>
        <path d="M18.9678 15.3694C19.2607 15.6622 19.2607 16.1371 18.9678 16.43L17.0602 18.3377C16.9195 18.4783 16.7288 18.5574 16.5298 18.5574C16.3309 18.5574 16.1402 18.4783 15.9995 18.3377L14.9072 17.2453C14.6143 16.9525 14.6143 16.4776 14.9072 16.1847C15.2001 15.8918 15.675 15.8918 15.9678 16.1847L16.5298 16.7467L17.9072 15.3694C18.2001 15.0765 18.675 15.0765 18.9678 15.3694Z" fill="rgb(22 190 74)"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.5625 16.8535C11.5625 13.885 13.969 11.4785 16.9375 11.4785C19.906 11.4785 22.3125 13.885 22.3125 16.8535C22.3125 19.822 19.906 22.2285 16.9375 22.2285C13.969 22.2285 11.5625 19.822 11.5625 16.8535ZM16.9375 12.9785C14.7974 12.9785 13.0625 14.7134 13.0625 16.8535C13.0625 18.9936 14.7974 20.7285 16.9375 20.7285C19.0776 20.7285 20.8125 18.9936 20.8125 16.8535C20.8125 14.7134 19.0776 12.9785 16.9375 12.9785Z" fill="rgb(22 190 74)"></path>
      </svg>
    );
  }

  return (
    // <svg width="25" height="25" className=" animate-fade-in" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <rect x="2" y="2" width="16" height="16" rx="2" ry="2" fill="rgb(82 82 91)" stroke="#000" strokeWidth="0.5"/>
    //   <rect x="5" y="3" width="10" height="4" fill="#e6e6e6"/>
    //   <rect x="6" y="4" width="3" height="2" fill="#333"/>
    //   <rect x="5" y="10" width="10" height="7" fill="#e6e6e6" stroke="#333" strokeWidth="0.1"/>
    //   <rect x="9" y="11" width="2" height="2" fill="#333"/>
    // </svg>
    <svg width="35" height="35" viewBox="0 0 25 25" fill="#343C54" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.3135 10.3086C10.1955 10.3086 8.47852 12.0256 8.47852 14.1436C8.47852 16.2616 10.1955 17.9786 12.3135 17.9786C14.4315 17.9786 16.1485 16.2616 16.1485 14.1436C16.1485 12.0256 14.4315 10.3086 12.3135 10.3086ZM9.97852 14.1436C9.97852 12.854 11.0239 11.8086 12.3135 11.8086C13.6031 11.8086 14.6485 12.854 14.6485 14.1436C14.6485 15.4332 13.6031 16.4786 12.3135 16.4786C11.0239 16.4786 9.97852 15.4332 9.97852 14.1436Z" fill="#343C54"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.6934 3.47852H5.8125C4.56986 3.47852 3.5625 4.48587 3.5625 5.72852V18.7285C3.5625 19.9712 4.56986 20.9785 5.8125 20.9785H18.8124C20.055 20.9785 21.0624 19.9712 21.0624 18.7285L21.0624 8.8427C21.0624 8.24536 20.8249 7.67254 20.4022 7.25049L17.2832 4.1363C16.8613 3.71509 16.2895 3.47852 15.6934 3.47852ZM5.8125 4.97852C5.39829 4.97852 5.0625 5.3143 5.0625 5.72852V18.7285C5.0625 19.1427 5.39829 19.4785 5.8125 19.4785H18.8124C19.2266 19.4785 19.5624 19.1427 19.5624 18.7285L19.5624 8.8427C19.5624 8.64359 19.4832 8.45265 19.3423 8.31196L16.2233 5.19778C16.0827 5.05737 15.8921 4.97852 15.6934 4.97852H14.0625L14.0625 5.72851C14.0625 6.97115 13.0551 7.97852 11.8125 7.97852H8.8125C7.56986 7.97852 6.5625 6.97116 6.5625 5.72852V4.97852H5.8125ZM8.0625 4.97852H12.5625L12.5625 5.72851C12.5625 6.14273 12.2267 6.47852 11.8125 6.47852H8.8125C8.39829 6.47852 8.0625 6.14273 8.0625 5.72852V4.97852Z" fill="#343C54"></path>
    </svg>

  );
};

export default StatusIcon;

export const SaveLoadingSpinner = ({ height = 30, width = 30, className }: { width?: number, height?: number, className?: string }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" className={`animate-spin ${className}`}>
      <path d="M13.7507 3.74805C13.7507 2.78155 12.9672 1.99805 12.0007 1.99805C11.0342 1.99805 10.2507 2.78155 10.2507 3.74805C10.2507 4.71455 11.0342 5.49815 12.0007 5.49815C12.9672 5.49815 13.7507 4.71455 13.7507 3.74805Z" fill="#343C54"/>
      <path d="M18.366 6.69439C18.6589 6.4015 18.6589 5.92663 18.366 5.63373C18.0731 5.34084 17.5983 5.34084 17.3054 5.63373C17.0125 5.92663 17.0124 6.40157 17.3053 6.69446C17.5982 6.98736 18.0731 6.98729 18.366 6.69439Z" fill="#343C54"/>
      <path d="M21.1477 12C21.1477 12.4943 20.747 12.895 20.2527 12.895C19.7584 12.895 19.3576 12.4943 19.3576 12C19.3576 11.5057 19.7583 11.105 20.2526 11.105C20.7469 11.105 21.1477 11.5057 21.1477 12Z" fill="#343C54"/>
      <path d="M17.1003 18.5713C17.5064 18.9775 18.1649 18.9775 18.5711 18.5713C18.9772 18.1652 18.9772 17.5067 18.5711 17.1005C18.1649 16.6944 17.5064 16.6943 17.1002 17.1005C16.6941 17.5066 16.6942 18.1652 17.1003 18.5713Z" fill="#343C54"/>
      <path d="M12.0007 19.067C12.6552 19.067 13.1857 19.5975 13.1857 20.252C13.1857 20.9064 12.6552 21.4371 12.0007 21.4371C11.3463 21.4371 10.8157 20.9065 10.8157 20.2521C10.8157 19.5976 11.3463 19.067 12.0007 19.067Z" fill="#343C54"/>
      <path d="M7.10623 18.7764C7.62562 18.257 7.62562 17.4149 7.10623 16.8955C6.58683 16.3761 5.74472 16.3761 5.22532 16.8955C4.70592 17.4149 4.70585 18.2571 5.22525 18.7765C5.74465 19.2959 6.58683 19.2958 7.10623 18.7764Z" fill="#343C54"/>
      <path d="M5.22354 12C5.22354 12.8146 4.56316 13.475 3.74854 13.475C2.93392 13.475 2.27344 12.8146 2.27344 12C2.27344 11.1854 2.93382 10.525 3.74844 10.525C4.56306 10.525 5.22354 11.1854 5.22354 12Z" fill="#343C54"/>
      <path d="M5.02026 7.30958C5.65291 7.94222 6.67864 7.94222 7.31129 7.30958C7.94394 6.67693 7.94394 5.6512 7.31129 5.01855C6.67864 4.3859 5.65284 4.38583 5.02019 5.01848C4.38754 5.65113 4.38761 6.67693 5.02026 7.30958Z" fill="#343C54"/>
    </svg>
  )
}

export const FilledStar = ({ className }: { className?: string}) => {
  return (
    <li className={`${className} bg-zinc-600`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2381D9" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
      </svg>
    </li>
  )
};

export const EmptyStar = ({ className }: { className?: string}) => {
  return (
    <div className={`${className} text-gray-400`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    </div>
  )
};

export const RatingStars = ({ rating, className}: { rating: number, className?: string}) => {
  return (
    <ul className={`flex flex-row gap-2 items-center flex-wrap mr-2 ${className}`}>
      { Array.from({ length: rating }).map((_, avgRateIndex: number) => (<FilledStar className="!scale-150" key={`product-rating-${avgRateIndex}`} />))}
      { Array.from({ length: (5 - rating) }).map((_, avgRateIndex: number) => (<EmptyStar className="!scale-150" key={`product-rating-${avgRateIndex}`} />))}
    </ul>
  )
}

export function TickIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`size-4 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

export function GoogleIcon({ className, style }: { className?: string, style?: CSSProperties }) {
  return (
    <figure style={style} className={`size-7 h-7 w-7 relative ${className}`}>
      <Image alt="google icon" fill src={googleIcon} />
    </figure>
  )
}

export const FacebookIcon = () => {
  return (
    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect width="29" height="29" fill="url(#pattern0_316_1242)"/>
      <defs>
      <pattern id="pattern0_316_1242" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_316_1242" transform="scale(0.01)"/>
      </pattern>
      <image id="image0_316_1242" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
      </defs>
    </svg>
  )
}
export function PinIcon({ className }: { className?: string }) {
  return (
    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className={`${className}`}>
    <rect y="0.5" width="25" height="25" fill="url(#pattern0_414_4328)"/>
    <defs>
    <pattern id="pattern0_414_4328" patternContentUnits="objectBoundingBox" width="1" height="1">
    <use xlinkHref="#image0_414_4328" transform="scale(0.01)"/>
    </pattern>
    <image id="image0_414_4328" width="100" height="100" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEt0lEQVR4nO2cX2hbVRzHo7hNQX1Q35w25yRrXAdC6RiCuDIQFIU5H+45aetwTNchrOoUpx1zBSezK4VtDv+s4KSyDa2I+jKEzYH7ZdmS1RetPgzU+WKTOHyZDwqmX7kpSG5vu7YzueeX5feBA4HcNuf3/eTc32lOaCwmCIIgCE0CYrEb4CU6YNVLMOpDWP0NrBqfHpXHRyrPpZPt/rWu53vdgg333Qmrd8PoX2A1Fjh+htWvw1t+h+v5XzfAa1sKo/ph1ZVFiJgxKj/7Kno7lriup6GBbYnD6PPXLiIk5lt4iaTruhoSeGoNjPp9znA33Q+8th54owcY3goMbgY2t88vxeg/YPSDrutrKGBaHoDRf4bCTCeAlx8BDu8Exg4Anx4MjiMDC7+FeWqN6zobAnj6Xlh1ORTis6uBw/1hCTNHT2qhUkqwiXtc18saDMRuhFFnQ+E9vw44PjS/jPd2LK6nGH3Gf03XdbMFVj8XCm1bJzC2f3YBRweB/duAvZuA/icWsTqqhhff4rpuluDplpth9G+BsJ5pB47tC4v4YADY/jCQTtZi9zUJb/ktrutnB2yiNxTWoe1hGf6OqntFjbbBskquIkRlg7eqtWEZ/u3J32nVUsZ0g89E+eZrjI9FjC4HQjrQF5Qx+ibQ3VoHGZXmXkZX612uc2AD0vrJQEDdrcDHw0Eh/h+B9ZDxn5TEBtc5sKHyAWB1OH0zblf+LmvjyvoKsWqn6xzYAKtHAuG88nhQyMiuOsuoCHnfdQ5sgFXHA+Hs9oJC3n6x/kKMPuY6BzbA6I8C4ex4LChkz1NRrJBR1zmwAUYfCoTTlQCGtgCje6Z3WxvbIlgh6qDrHNgAq1+o/wrQ8whJ9LnOgQ0w8bXOhVj1kOsc2IBHk8tmPf+wkcm44h8Vu86B907LRjqOuq6fHTCJdc6EePFO1/WzBLMdTtV7GH3Gdd1sQVqvhtX/RCijLGfr80mxal+EK2RvNG+1Bga9HUtg1ekIZJxEZ+dNruttCNCTvB1GXaijjLz/Gq7rbCiwPnUbrP6q9n1DnYDXdqvr+hr4a0F6F6z6+//LUH/5Zx7ytZ9aiPHiKVj1OayeugYZUzDqM1jVWou5CFXAS7bBqKFyd+rX+USUu1KXpndsLSurf4dQByg3uWr86+/w4ydf4KeRd3HpneHK8B//MPYlLpz+Hv41En5EUG5y1dl8EVcbIiRCSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC9IhPCCRAgvSITwgkQIL0iE8IJECC+y2ct3Z3KFqbn+NZP/nH+N63k2FZl88dTcQoonXc+v6aBcycwlJJsrea7n13RMTEwszeSLhZCQXLF04uLFZa7n15Rk8oXB0O0qX3jL9byaFsoXdCZXKFc383PnSitcz6upyVQ1d2nmzJp7Vpo5o+aek2bOqrlnpJnzITNeTPjD9TwEQRAEIeaQfwH+mOQr4oLODQAAAABJRU5ErkJggg=="/>
    </defs>
    </svg>
  )
}


export function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className={`${className}`}>
      <rect y="0.5" width="21" height="21" fill="url(#pattern0_414_4326)"/>
      <defs>
      <pattern id="pattern0_414_4326" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlinkHref="#image0_414_4326" transform="scale(0.01)"/>
      </pattern>
      <image id="image0_414_4326" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
      </defs>
    </svg>
  )
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

export function PlusIcon({ className }: { className?: string }) {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

export function MinusIcon({ className }: { className?: string }) {
  return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
  )
}

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

export function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"  className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}

export function VisibleEyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export function HiddenEyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export const LinkIcon = ({ className }: { className?: string }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M20.5245 20.661H27.2391V23.3468H23.2104V27.3756H20.5245V20.661ZM7.09525 7.23172H0.380615V4.54587H4.40939V0.51709H7.09525V7.23172ZM22.3563 18.6949L20.4574 16.7934L22.3563 14.8945C22.9843 14.2719 23.4831 13.5315 23.8242 12.7157C24.1652 11.8999 24.3418 11.0247 24.3438 10.1405C24.3457 9.2562 24.173 8.38028 23.8355 7.56296C23.498 6.74565 23.0024 6.00305 22.3771 5.37779C21.7518 4.75253 21.0092 4.25692 20.1919 3.91943C19.3746 3.58193 18.4987 3.4092 17.6144 3.41113C16.7302 3.41307 15.855 3.58964 15.0392 3.93071C14.2234 4.27178 13.4829 4.77063 12.8604 5.39863L10.9615 7.29887L9.06129 5.39997L10.9629 3.50107C12.7259 1.73805 15.1171 0.747593 17.6104 0.747593C20.1036 0.747593 22.4948 1.73805 24.2578 3.50107C26.0209 5.26409 27.0113 7.65527 27.0113 10.1486C27.0113 12.6418 26.0209 15.033 24.2578 16.796L22.3563 18.6949ZM18.5585 22.4927L16.6582 24.3916C14.8952 26.1547 12.504 27.1451 10.0107 27.1451C7.51745 27.1451 5.12628 26.1547 3.36325 24.3916C1.60023 22.6286 0.609776 20.2374 0.609776 17.7441C0.609776 15.2509 1.60023 12.8597 3.36325 11.0967L5.26349 9.19776L7.16239 11.0993L5.26349 12.9982C4.6355 13.6208 4.13665 14.3612 3.79558 15.177C3.45451 15.9928 3.27794 16.868 3.276 17.7523C3.27407 18.6365 3.4468 19.5124 3.7843 20.3297C4.12179 21.1471 4.61739 21.8897 5.24266 22.5149C5.86792 23.1402 6.61052 23.6358 7.42783 23.9733C8.24514 24.3108 9.12107 24.4835 10.0053 24.4816C10.8896 24.4796 11.7647 24.3031 12.5806 23.962C13.3964 23.6209 14.1368 23.1221 14.7593 22.4941L16.6582 20.5952L18.5585 22.4927ZM17.6077 8.24832L19.5079 10.1486L10.0121 19.643L8.11184 17.7441L17.6077 8.24832Z" fill="black"/>
    </svg>
  )
}
