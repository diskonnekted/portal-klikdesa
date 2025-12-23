import type { ImageProps } from "next/image";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageFallbackProps extends Omit<ImageProps, "src"> {
    src?: string | null;
    _fallbackSrc?: string;
    iconSize?: number;
}

export default function ImageFallback({
    src,
    _fallbackSrc,
    iconSize = 48,
    alt = "",
    className = "",
    ...props
}: ImageFallbackProps) {
    // Validate and normalize the source URL
    const normalizeSrc = (url: string | null | undefined) => {
        if (!url || typeof url !== "string") return null;
        const trimmed = url.trim().replace(/^[)\s]+|[)\s]+$/g, "");
        if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return null;
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return null;
        try {
            const parsed = new URL(trimmed);
            const host = parsed.hostname.toLowerCase();
            if (host !== "sijenggung-banjarnegara.desa.id" && host !== "localhost") {
                return null;
            }
            return parsed.toString();
        } catch {
            return null;
        }
    };

    const [imgSrc, setImgSrc] = useState(normalizeSrc(src));
    const [hasError, setHasError] = useState(!normalizeSrc(src));

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(null);
        }
    };

    // If no image or error occurred, show fallback
    if (hasError || !imgSrc) {
        return (
            <div
                className={`flex items-center justify-center bg-[#1f2b44] text-green-100 ${className}`}
                style={props.style}
            >
                <ImageOff size={iconSize} />
            </div>
        );
    }

    return <Image src={imgSrc} alt={alt} className={className} onError={handleError} {...props} />;
}
