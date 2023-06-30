import { ProviderProps, createContext, useContext, useEffect, useReducer } from "react";

const localStorageKey = () => window.APP.SETTINGS_STORE_KEY

export interface AppSettings {
    dev: boolean;
    theme: string;
    currentGameId?: string;
}

interface AppSettingsEntry {
  settings: AppSettings
  dispatch: (value: Partial<AppSettings>) => void
}

const SettingsContext = createContext<AppSettingsEntry | undefined>(undefined)

const settingsReducer = (oldSettings: AppSettings, action: Partial<AppSettings>) => {
  const { ...newSettings } = action

  return {
    ...oldSettings,
    ...newSettings,
  }
}

interface SettingsProviderProps {
  defaultValues: AppSettings
}

const SettingsProvider = ({ value: { defaultValues }, children }: ProviderProps<SettingsProviderProps>) => {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    Object.assign({}, defaultValues, JSON.parse(window.localStorage.getItem(localStorageKey()) || '{}'))
  )

  useEffect(() => {
    window.localStorage.setItem(localStorageKey(), JSON.stringify(settings))
  }, [settings])

  return <SettingsContext.Provider value={{ settings, dispatch }}>{children}</SettingsContext.Provider>
}

const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context.settings
}

const useSettingsDispatch = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettingsDispatch must be used within a SettingsProvider')
  }
  return context.dispatch
}

export { SettingsProvider, useSettings, useSettingsDispatch }