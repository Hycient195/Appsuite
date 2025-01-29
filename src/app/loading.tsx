import { LogoIcon } from "@/sharedComponents/CustomIcons";

export default function Loading() {
  return (
    <main className="bg-white fixed flex h-[100dvh] z-[5] top-0 left-0 w-full p-5 items-center justify-center">
      <div className="w-max z-[-2] h-auto aspect-square relative flex items-center justify-center p-10">
        <div className="absolute p-10 z-[-1] flex animate-spin [animation-duration:500ms] bg-primary-red h-full w-full aspect-square rounded-full after:w-[98%] after:h-[98%] after:bg-white after:absolute after:my-auto after:mx-auto after:rounded-full after:top-0 after:bottom-0 after:left-0 after:right-0" style={{ background: "conic-gradient(#EDF6F9 0.55% 50.08%, #002037 60.08% 200.68%)"}} />
        <div className="w-max h-auto aspect-square">
          {/* <LogoIcon className="!size-16 lg:!size-20" /> */}
          {/* <svg width="78" height="72" viewBox="0 0 78 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6_3875)">
            <path d="M63.0091 0.0837402C65.0013 0.0837402 66.6172 1.69969 66.6172 3.69184V14.5384H59.4733V7.30179H33.859V25.2904C33.859 29.2765 30.627 32.5084 26.6409 32.4825H11.5173C9.52513 32.5066 7.90918 30.8925 7.90918 28.8985V25.2904H26.639V3.69184C26.639 1.69969 28.255 0.0837402 30.2471 0.0837402H63.0073H63.0091Z" fill="#29ABE2" style="fill:#29ABE2;fill:color(display-p3 0.1608 0.6706 0.8863);fill-opacity:1;"/>
            <path d="M14.7163 71.916C12.7242 71.916 11.1082 70.3 11.1082 68.3079L11.1045 57.5021H18.3318V64.7294L43.8683 64.6998V42.9159C43.8683 40.9238 45.4843 39.3078 47.4764 39.3078H69.8162V14.6034H59.4367V7.28155H73.4243C75.4183 7.1963 77.0324 8.81225 77.0324 10.8044V42.9159C77.0324 44.9099 75.4165 46.524 73.4243 46.524H51.0845V68.3079C51.0845 70.3019 49.4686 71.916 47.4764 71.916H14.7163Z" fill="#002037" style="fill:#002037;fill:color(display-p3 0.0000 0.1255 0.2157);fill-opacity:1;"/>
            <path d="M26.671 32.4827H7.96522V57.4188L18.3318 57.4521V64.6702L4.35712 64.6368C2.36498 64.6368 0.749023 63.0208 0.749023 61.0287V28.9172C0.749023 26.9232 2.36498 25.3091 4.35712 25.3091H26.671V32.4845V32.4827Z" fill="#29ABE2" style="fill:#29ABE2;fill:color(display-p3 0.1608 0.6706 0.8863);fill-opacity:1;"/>
            </g>
            <defs>
            <clipPath id="clip0_6_3875">
            <rect width="76.2871" height="71.8321" fill="white" style={{ fill: "white", fillOpacity: 1 }} transform="translate(0.748047 0.0839844)"/>
            </clipPath>
            </defs>
          </svg> */}
          <svg
            width={78}
            height={72}
            viewBox="0 0 78 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_6_3875)">
              <path
                d="M63.0091 0.0837402C65.0013 0.0837402 66.6172 1.69969 66.6172 3.69184V14.5384H59.4733V7.30179H33.859V25.2904C33.859 29.2765 30.627 32.5084 26.6409 32.4825H11.5173C9.52513 32.5066 7.90918 30.8925 7.90918 28.8985V25.2904H26.639V3.69184C26.639 1.69969 28.255 0.0837402 30.2471 0.0837402H63.0073H63.0091Z"
                style={{
                  fill: "#29ABE2",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M14.7163 71.916C12.7242 71.916 11.1082 70.3 11.1082 68.3079L11.1045 57.5021H18.3318V64.7294L43.8683 64.6998V42.9159C43.8683 40.9238 45.4843 39.3078 47.4764 39.3078H69.8162V14.6034H59.4367V7.28155H73.4243C75.4183 7.1963 77.0324 8.81225 77.0324 10.8044V42.9159C77.0324 44.9099 75.4165 46.524 73.4243 46.524H51.0845V68.3079C51.0845 70.3019 49.4686 71.916 47.4764 71.916H14.7163Z"
                style={{
                  fill: "#002037",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M26.671 32.4827H7.96522V57.4188L18.3318 57.4521V64.6702L4.35712 64.6368C2.36498 64.6368 0.749023 63.0208 0.749023 61.0287V28.9172C0.749023 26.9232 2.36498 25.3091 4.35712 25.3091H26.671V32.4845V32.4827Z"
                style={{
                  fill: "#29ABE2",
                  fillOpacity: 1,
                }}
              />
            </g>
            <defs>
              <clipPath id="clip0_6_3875">
                <rect
                  width={76.2871}
                  height={71.8321}
                  style={{
                    fill: "white",
                    fillOpacity: 1,
                  }}
                  transform="translate(0.748047 0.0839844)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </main>
  )
}