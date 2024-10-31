// type TProps = {
//   className?: string;
//   style?: React.CSSProperties;
//   reflect?: boolean;
// };

// export default function PlainSkeleton({
//   className = "",
//   style = {},
//   reflect = false,
// }: TProps) {
//   return (
//     <div style={style} className={` ${className}  grid h-full w-full bg-zinc-30 relative overflow-hidden`}>
//       <div className={`${reflect ? "!animate-wave-color" : "animate-pulse"} h-full w-full absolut inset- ![background-size:300%] ![background:linear-gradient(-55deg,rgb(228 228 231),rgb(228 228 231),rgb(228 228 231),white,rgb(228 228 231),rgb(228 228 231),rgb(228 228 231),rgb(228 228 231))]`}></div>
//     </div>
//   );
// }

type TProps = {
  className?: string;
  style?: React.CSSProperties;
  reflect?: boolean;
};

export default function PlainSkeleton({
  className = "",
  style = {},
  reflect = false,
}: TProps) {
  return (
    <div
    style={{
      ...style,
      backgroundSize: "300%", 
      background: !reflect ?
        "rgb(212 212 216/0.8)" :
        "linear-gradient(-55deg, rgb(228 228 231), rgb(228 228 231), rgb(228 228 231), white, rgb(228 228 231), rgb(228 228 231), rgb(228 228 231), rgb(228 228 231))"
    }}
      className={`${className} ${reflect ? "!animate-wave-color" : "animate-pulse"} grid h-full w-full bg-zinc-30 relative overflow-hidden`}
    >
      {/* <div
        className={` absolute inset-0`}
        
      ></div> */}
    </div>
  );
}
