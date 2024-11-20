import { useThemeContext } from "@/app/app/invoice-manager/_contexts/themeContext";
import { ITemplateThemeColor } from "@/app/app/invoice-manager/_types/types";
import { handleUpdateStateProperty } from "@/utils/miscelaneous";

interface IThemePickerProps<T> {
  templateId: string;
  stateObject: T|any;
  setStateObject: React.Dispatch<React.SetStateAction<T>>;
  callback?: any;
}

export default function TemplateThemeColorPicker<T>({ templateId, stateObject, setStateObject, callback }: IThemePickerProps<T>) {
  const { getThemes, setTheme, getSelectedTheme } = useThemeContext();
  const themes = getThemes(templateId);

  const updateState = (theme: ITemplateThemeColor) => {
    
    handleUpdateStateProperty(stateObject, setStateObject, theme, "branding.themeColor");
    handleUpdateStateProperty(stateObject, setStateObject, templateId, "templateId");
    setTheme(templateId, theme, );
    // if (callback) callback()
  }

  const selectedTheme = getSelectedTheme(templateId);

  return (
    <div  className=" !z-[1]   bg-te  left-0  right-0 w-ma left- mx-auto my-auto mb-2 ">
      <div className="overflow-x-auto bg-tes w-full">
        <div className="flex flex-row items-center gap-1">
          {
            themes?.map((theme, index) => (
              <button onClick={() => updateState(theme)} key={`theme-picker-${index}`} style={{ backgroundColor: theme.display}} className={`h-10 w-10 rounded-ful border  ${JSON.stringify(theme) === JSON.stringify(stateObject?.branding?.themeColor) ? "border-2 border-slate-600" : "border-slate-400"}`}></button>
            ))
          }
        </div>
      </div>
    </div>
  )
}