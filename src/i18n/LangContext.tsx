"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { type Lang } from "./translations";

type LangContextType = {
    lang: Lang;
    toggleLang: () => void;
    t: (obj: { en: string; zh: string }) => string;
};

const LangContext = createContext<LangContextType>({
    lang: "en",
    toggleLang: () => { },
    t: (obj) => obj.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");

    const toggleLang = useCallback(() => {
        setLang((prev) => (prev === "en" ? "zh" : "en"));
    }, []);

    const t = useCallback(
        (obj: { en: string; zh: string }) => obj[lang],
        [lang]
    );

    return (
        <LangContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
