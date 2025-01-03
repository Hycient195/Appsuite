import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sharedComponents/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sharedConstants/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "slide-in-right": "slide-in-right 500ms ease-in-out",
        "slide-in-left": "slide-in-left 500ms ease-in-out",
        "screen-slide-in-right": "screen-slide-in-right 1s ease-in-out",
        "screen-slide-out-right": "screen-slide-out-right 1s ease-in-out",
        "screen-slide-in-left": "screen-slide-in-left 1s ease-in-out",
        "screen-slide-in-top": "screen-slide-in-top 700ms ease-in-out",
        "screen-slide-in-bottom": "screen-slide-in-bottom 700ms ease-in-out",
        "eye-disappear": "disappear 2s",
        "fade-in": "fade-in 500ms ease-in",
        float: 'float 3s ease-in-out infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
      },
      colors: {
        primary: "#002037",
        secondary: colors.zinc[600],
        tertiary: colors.zinc[300],
        "dark-blue": "#043665",
        // blue: "#2381D9",
        "light-blue": "#519CF6",
        "sky-blue": "#E2ECF9",
        "pale-blue": "#F7F8FC",
        pink: "#E11D91",
        "pale-pink": "#FFEEF4",
        "pale-rose": "#FFEEF4",
        "pale-green": "#E3F6E3",
        "dark-gray": "#262626",
        test: "red"
      },
      fontFamily: {
        helvetica: ["Helvetica"],
        "work-sans": [ "Work-Sans"]
      },
      keyframes: {
        "slide-in-right": {
          from: {
            transform: "translateX(-100%)"
          },
          to: {
            transform: "translateX(0)"
          }
        },
        "slide-in-left": {
          from: {
            transform: "translateX(100%)"
          },
          to: {
            transform: "translateX(0)"
          }
        },
        "screen-slide-in-right": {
          from: {
            transform: "translateX(-100vw)"
          },
          to: {
            transform: "translateX(0)"
          }
        },
        "screen-slide-out-right": {
          from: {
            transform: "translateX(0)"
          },
          to: {
            transform: "translateX(100vw)"
          }
        },
        "screen-slide-in-left": {
          from: {
            transform: "translateX(100vw)"
          },
          to: {
            transform: "translateX(0)"
          }
        },
        "screen-slide-in-top": {
          from: {
            transform: "translateY(-100vh)"
          },
          to: {
            transform: "translateY(0)"
          }
        },
        "screen-slide-in-bottom": {
          from: {
            transform: "translateY(100vh)"
          },
          to: {
            transform: "translateY(0)"
          }
        },
        disappear: {
          // "0%": { display: "inline-flex" },
          "0%,100%": {"background-color": "red" }
        },
        "fade-in": {
          from: {
            opacity: "0"
          },
          to: {
            opacity: "100"
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Scroll halfway, because the image set is duplicated
        },
      }
    },
  },
  plugins: [],
};
export default config;
