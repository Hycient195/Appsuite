import { handleInputChange, replaceJSXRecursive } from "@/utils/miscelaneous";
import { MenuItem, Select } from "@mui/material";
import { Country, State } from "country-state-city";
import Image from "next/image";
import { ChangeEvent, CSSProperties, FC, LegacyRef, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";

type TElementTypes = HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement

interface IProps {
  labelText?: string;
  value?: (string|number);
  defaultValue?: (string|number|boolean);
  // options?: { value: (string|number), text: (string|JSX.Element|React.ReactNode) }[];
  options?: { value: any, text: (string|JSX.Element|React.ReactNode) }[];
  onChange?: (arg?: { target: { value: string }} | any) => void;  // onChange?: ((e: ChangeEvent<HTMLTextAreaElement>) => void | ((e: ChangeEvent<HTMLInputElement>) => void) | ((e: ChangeEvent<HTMLSelectElement>) => void) | ((e: SelectChangeEvent<string|number>) => void));
  footerText?: string;
  name?: string;
  id?: string;
  placeholder?: string
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rows?: number;
  charactersRemaining?: string|number;
  type?: ("text"|"password"|"number"|"email"|"date"|"time");
  isLoading?: boolean;
  disabled?: boolean;
  required?: boolean;
  style?: CSSProperties;
  ref?: MutableRefObject<TElementTypes>|LegacyRef<TElementTypes>|RefObject<TElementTypes>|undefined
  icon?: JSX.Element|React.ReactNode;
  iconPosition?: ("left"|"right")
}

export const FormSelect = ({ labelText, ref, value, defaultValue, options, onChange, footerText, name, id, wrapperClassName, labelClassName, inputClassName, isLoading = false, disabled = false, icon, required }: IProps) => {
  return (
    <label htmlFor={id} className={`${wrapperClassName}`}>
      { labelText && <p className={`${isLoading ? "text-zinc-400" : "text-zinc-700"} duration-700 text-sm  mb-1.5 ${labelClassName}`}>{labelText}</p> }
      <div className="relative">
        <Select ref={ref as RefObject<unknown>} defaultValue={defaultValue} onChange={(e) => onChange && onChange(e)} name={name} value={value} id={id} displayEmpty disabled={isLoading||disabled} required={required} className={`${isLoading ? "!bg-gray-300/70 !animate-pulse" : "!bg-white"} ${icon && "[&>*]:!pl-9"} w-full !border !font-lexend !font-light !rounded-md !border-zinc-300 [&>*]:!border-none [&>*]:!py-2.5 [&>*]:!text-zinc-500 focus:[&>*]:!rounded-md focus:[&>*]:!ring-2 focus:[&>*]:!ring-zinc-300 ${inputClassName}`}>
          { !isLoading && <MenuItem value="" className={``}>{defaultValue}</MenuItem> }
          {
            options && options.map((option, index: number) => (
              <MenuItem key={`${labelText}-${index}`} value={option.value} className="!font-lexend !font-zinc-600 !font-light">{option.text}</MenuItem>
            ))
          }
        </Select>
        { icon && <span className="absolute top-0 bottom-0 h-max my-auto left-3">{icon}</span> }
      </div>
      { footerText && <p className={`${isLoading ? "text-zinc-300" : "text-zinc-400"} font-light text-xs mt-1.5`}>{footerText}</p> }
    </label>
  )
}

export const FormCountrySelect: FC<IProps & {showFlag?: boolean}> = (props) => {
  return (
    <FormSelect {...props} options={Country.getAllCountries().map(c => { return { text: props.showFlag ? <span className="flex flex-row items-center gap-2"><Image className="mr-0.5" width={30} height={17} src={`/images/country-flag/${c?.isoCode}.svg`} alt={c.name as string} />{c.name}</span>  :  c.name, value: c.isoCode } })} />
  )
}

export const FormRegionSelect: FC<IProps & {countryCode: string}> = (props) => {
  return (
    <FormSelect {...props} options={State.getStatesOfCountry(props.countryCode).map(s => { return { text: s.name, value: s.name }})} />
  )
}

export const FormText = ({ labelText, ref, value, onChange, footerText, name, id, placeholder, type = "text", wrapperClassName, labelClassName, inputClassName, isLoading = false, disabled = false, icon, iconPosition = "left", required }: IProps) => {
  return (
    <label htmlFor={id} className={`${wrapperClassName}`}>
      { labelText && <p className={`${isLoading ? "text-zinc-400" : "text-zinc-700"} duration-700 text-sm mb-1.5 ${labelClassName}`}>{labelText}</p> }
      <div className="relative">
        <input value={value} ref={ref as LegacyRef<HTMLInputElement>} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(e)} name={name} id={id} placeholder={!isLoading ? placeholder : ""} type={type} disabled={isLoading||disabled} required={required} className={`${isLoading ? "bg-gray-300/70 animate-pulse" : "bg-white"} ${icon && (iconPosition === "left" ? "!pl-9" : "!pr-9")} px-3 lg:px-3.5 py-2.5 w-full text-zinc-500 font-light rounded-md border border-zinc-300 outline-none focus:ring-1 focus:ring-slate-300 ${inputClassName}`} />
        { icon && <span className={`absolute top-0 bottom-0 h-max my-auto flex items-center ${iconPosition === "left" ? "left-3" : "right-3"}`}>{icon}</span> }
      </div>
      { footerText && <p className={`${isLoading ? "text-zinc-300" : "text-zinc-400"} font-light text-xs mt-1.5`}>{footerText}</p> }
    </label>
  )
}

export const FormPhoneField = (props: IProps) => {
  return (
    <FormText {...props} type="number" value={(props.value as string)?.replace(/^0/, '').replace(/[a-zA-Z]/g, '')} />
  )
}

export const FormPhoneAndCountryField = ({ labelText, onChange, value, name, footerText, id, placeholder, type = "text", wrapperClassName, labelClassName, inputClassName, isLoading = false, disabled = false, icon, required }: IProps) => {
  const [ phone, setPhone ] = useState({ code: "234", number: "" });

  useEffect(() => {
    const number = String(value).slice(-10)
    setPhone({ code: String(value).split(number)[0]?.replace("+", ""), number });
  }, []);

  useEffect(() => {
    if (onChange) onChange({ target: { name, value: `+${phone.code}${phone.number}`}});
  }, [ phone, name ]);

  return (
    <label htmlFor={id} className={`${wrapperClassName}`}>
      { labelText && <p className={`${isLoading ? "text-zinc-400" : "text-zinc-700"} duration-700 text-sm mb-1.5 ${labelClassName}`}>{labelText}</p> }
      <div className="relative">
        <div className="relative grid grid-cols-[max-content_1fr] gap-1 h-full mt-1.5">
          <Select
            itemID="location"
            defaultValue="+234"
            className="[&>*]:!py-1 [&>*]:!pl-2 [&>*]:!pr-1.5 [&>*]:!rounded-md !min-w-[60px] [&>*]:!flex [&>*]:!items-center ring ring-1 ring-slate-300 !w-max text-lg placeholder:text-neutral-400 [&>*]:!border-none rounded text-slate-700"
            value={phone.code}
            disabled={disabled||isLoading}
            required={required}
            name="code"
            onChange={(e) => handleInputChange(e, phone, setPhone)}
          >
            <MenuItem className="!p-0 !hidden" value={10}>+234</MenuItem>
            {
              Country.getAllCountries().sort((a, b) => Number(a.phonecode) - Number(b.phonecode))?.map((country) => (
                <MenuItem key={`phone-${country.name}`} className="" value={country.phonecode}><span className="text-4xl"><Image className="mr-0.5" width={30} height={17} src={`/images/country-flag/${country?.isoCode}.svg`} alt={country.name as string} /></span>+{country.phonecode}</MenuItem>
              ))
            }
          </Select>
          <input onChange={(e) => handleInputChange(e, phone, setPhone)} name="number" value={phone.number.replace(/[A-Z]/ig, '').replace(/^0/, '')} type={type} required={required} placeholder={placeholder} id="business-name" disabled={disabled||isLoading} className={`${isLoading ? "bg-gray-300/70 animate-pulse" : "bg-white"} ${icon && "!pl-9"} px-3 lg:px-3.5 py-[0.57rem] w-full text-zinc-500 font-light rounded-md border border-zinc-300 outline-none focus:ring-1 focus:ring-slate-300 ${inputClassName}`} />
        </div>
        { icon && <span className="absolute top-0 bottom-0 h-max my-auto right-3">{icon}</span> }
      </div>
      { footerText && <p className={`${isLoading ? "text-zinc-300" : "text-zinc-400"} font-light text-xs mt-1.5`}>{footerText}</p> }
    </label>
  )
}


export const FormTextArea = ({ labelText, ref, value, onChange, footerText, name, id, placeholder, wrapperClassName, labelClassName, rows = 6, inputClassName, charactersRemaining, isLoading = false, disabled = false, required }: IProps) => {
  return (
    <label htmlFor={id} className={`${wrapperClassName}`}>
      { labelText && <p className={`${isLoading ? "text-zinc-400" : "text-zinc-700"} duration-700 text-sm ${labelClassName}`}>{labelText}</p> }
      <span className="relative">
        <textarea value={value} rows={rows} ref={ref as LegacyRef<HTMLTextAreaElement>} onChange={(e) => onChange && onChange(e)} name={name} id={id} placeholder={isLoading ? placeholder : ""} disabled={isLoading||disabled} required={required} className={`${isLoading ? "bg-gray-300/70 animate-pulse" : "bg-white"} px-3 lg:px-3.5 py-[0.57rem] mt-1.5 w-full text-zinc-500 font-light rounded-md border border-zinc-300 outline-none focus:ring-1 focus:ring-slate-300 ${inputClassName}`}></textarea>
        { charactersRemaining && <p className="text-zinc-400 text-xs absolute right-3 bottom-3">{charactersRemaining}</p>}
      </span>
      { footerText && <p className={`${isLoading ? "text-zinc-300" : "text-zinc-400"} font-light text-xs mt-1.5`}>{footerText}</p> }
    </label>
  )
}

interface IResponsiveProps {
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  ref?: MutableRefObject<any>
}

export const ResponsiveTextInput = ({ className, ...props }: IResponsiveProps & React.InputHTMLAttributes<HTMLInputElement|HTMLTextAreaElement>) => {
  return (
    <div className="relative w-full grid grid-cols-2 my-1 ">
      <div className={`${className} w-full min-w-[20px] `}>
        {!!props.href && <a rel={props.rel} target={props.target} href={props.href} className={`absolute w-full h-full top-0 left-0 ${className}`}>{replaceJSXRecursive(props.value, { "\n": <br /> })}</a>}
        <p className="text-transparent break-words !max-w-[200px] !block">{replaceJSXRecursive(props.value, { "\n": <br /> })}</p>
        <p className={`${(props.value || props.value === 0) && "!hidden"} text-transparent flex min-w-max flex-row items-center px-1 noExport`}>{props.placeholder?.split("")?.map((x, index) => <span key={`placeholder-char-${index}`}>{x}</span>)}..</p>
      </div>
      <textarea ref={props.ref} className={`absolute z-[2] bg-transparent resize-none no-scrollbar left-0 top-0 h-full w-full ${!!props.href && "noExport"} ${className}`} { ...props} value={props.value} />
    </div>
  )
}