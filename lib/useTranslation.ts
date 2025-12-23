import { useState, useEffect, useCallback } from "react";

// Import translations
import translations from "./translation.json";

// Type definitions for translations
type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

/**
 * Custom hook for accessing translations
 * Supports nested keys and parameter interpolation
 */
export function useTranslation() {
    const [currentLanguage, setCurrentLanguage] = useState<"id" | "en">("id");

    /**
     * Get translation by key with optional parameter interpolation
     * @param key - Translation key (supports dot notation for nested keys)
     * @param params - Object with parameters to interpolate into the translation
     * @param fallback - Fallback text if translation is not found
     * @returns Translated string
     */
    const t = useCallback((key: TranslationKey, params?: TranslationParams, fallback?: string): string => {
        // Split key into parts for nested access
        const keys = key.split(".");
        let value: unknown = translations;

        // Navigate through nested object
        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                // Return fallback or key if not found
                return fallback ?? key;
            }
        }

        // Handle function values (for dynamic translations)
        if (typeof value === "function") {
            return value(params);
        }

        // Handle string values with parameter interpolation
        if (typeof value === "string" && params) {
            return interpolateParams(value, params);
        }

        // Return the value if it's a string, otherwise return fallback or key
        return typeof value === "string" ? value : (fallback ?? key);
    }, []);

    /**
     * Check if a translation key exists
     * @param key - Translation key to check
     * @returns Boolean indicating if translation exists
     */
    const has = useCallback((key: TranslationKey): boolean => {
        const keys = key.split(".");
        let value: unknown = translations;

        for (const k of keys) {
            if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return false;
            }
        }

        return typeof value === "string";
    }, []);

    /**
     * Get all translation keys for a specific namespace
     * @param namespace - Namespace to get keys from
     * @returns Object with all translations in the namespace
     */
    const getNamespace = useCallback((namespace: string): Record<string, string> => {
        if (
            (translations as Record<string, unknown>)[namespace] &&
            typeof (translations as Record<string, unknown>)[namespace] === "object"
        ) {
            return flattenObject((translations as Record<string, unknown>)[namespace] as Record<string, unknown>);
        }
        return {};
    }, []);

    /**
     * Change current language
     * @param lang - Language code ('id' or 'en')
     */
    const setLanguage = (lang: "id" | "en") => {
        setCurrentLanguage(lang);
        // Store preference in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("language", lang);
        }
    };

    // Load language preference from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedLanguage = localStorage.getItem("language") as "id" | "en" | null;
            if (savedLanguage && (savedLanguage === "id" || savedLanguage === "en")) {
                // Use setTimeout to defer the setState call
                setTimeout(() => {
                    setCurrentLanguage(savedLanguage);
                }, 0);
            }
        }
    }, []);

    return {
        t,
        has,
        getNamespace,
        currentLanguage,
        setLanguage,
        isIndonesian: currentLanguage === "id",
        isEnglish: currentLanguage === "en",
    };
}

/**
 * Interpolate parameters into a translation string
 * @param str - String with parameters in {{param}} format
 * @param params - Object with parameter values
 * @returns String with interpolated parameters
 */
function interpolateParams(str: string, params: TranslationParams): string {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return params[key]?.toString() ?? match;
    });
}

/**
 * Flatten nested object into dot notation keys
 * @param obj - Object to flatten
 * @param prefix - Prefix for nested keys
 * @returns Flattened object
 */
function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
    const flattened: Record<string, string> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (value && typeof value === "object" && !Array.isArray(value)) {
                // Recursively flatten nested objects
                Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey));
            } else if (typeof value === "string") {
                flattened[newKey] = value;
            }
        }
    }

    return flattened;
}

/**
 * Server-side translation function (for SSR)
 * @param key - Translation key
 * @param params - Optional parameters
 * @param fallback - Optional fallback text
 * @returns Translated string
 */
export function getServerTranslation(key: TranslationKey, params?: TranslationParams, fallback?: string): string {
    const keys = key.split(".");
    let value: unknown = translations;

    for (const k of keys) {
        if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
            value = (value as Record<string, unknown>)[k];
        } else {
            return fallback ?? key;
        }
    }

    if (typeof value === "function") {
        return value(params);
    }

    if (typeof value === "string" && params) {
        return interpolateParams(value, params);
    }

    return typeof value === "string" ? value : (fallback ?? key);
}

/**
 * Type-safe translation keys
 */
export const translationKeys = {
    navigation: {
        beranda: "navigation.beranda",
        berita: "navigation.berita",
        profilDesa: "navigation.profilDesa",
        layanan: "navigation.layanan",
        cari: "navigation.cari",
        login: "navigation.login",
    },
    hero: {
        judul1: "hero.judul1",
        deskripsi1: "hero.deskripsi1",
        ctaLayananDigital: "hero.ctaLayananDigital",
    },
    forms: {
        namaLengkap: "forms.namaLengkap",
        email: "forms.email",
        submit: "forms.submit",
        cancel: "forms.cancel",
    },
    messages: {
        success: "messages.success",
        error: "messages.error",
        loading: "messages.loading",
        noData: "messages.noData",
    },
    errors: {
        validation: {
            required: "errors.validation.required",
            email: "errors.validation.email",
        },
    },
} as const;

/**
 * Default export for convenience
 */
export default useTranslation;
