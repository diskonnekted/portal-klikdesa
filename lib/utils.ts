import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeHtml(html: string): string {
    if (typeof window === "undefined") return html;
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        // Remove script, iframe, object, embed tags
        doc.querySelectorAll("script, iframe, object, embed").forEach((el) => el.remove());

        // Remove on* event handlers and javascript: URLs
        doc.querySelectorAll("*").forEach((el) => {
            const attrs = Array.from(el.attributes);
            for (const attr of attrs) {
                const attrName = attr.name.toLowerCase();
                if (attrName.startsWith("on")) {
                    el.removeAttribute(attr.name);
                }
                if (
                    (attrName === "href" || attrName === "src") &&
                    attr.value.toLowerCase().trim().startsWith("javascript:")
                ) {
                    el.removeAttribute(attr.name);
                }
            }
        });
        
        return doc.body.innerHTML;
    } catch (e) {
        console.error("HTML Sanitization failed:", e);
        return html;
    }
}
