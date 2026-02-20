import Image from "next/image";

/**
 * Renders a heavily darkened, desaturated background photo for a section.
 * The image is almost invisible — just enough texture to break up flat black.
 * 
 * @param src - Unsplash or local image URL
 * @param opacity - 0-100, default 8 (very subtle)
 * @param position - CSS object-position, default "center"
 * @param overlay - extra gradient overlay direction
 */
export function SectionBackground({
    src,
    alt = "",
    opacity = 4,
    position = "center",
    overlay = "none",
}: {
    src: string;
    alt?: string;
    opacity?: number;
    position?: string;
    overlay?: "top" | "bottom" | "both" | "none";
}) {
    return (
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                style={{
                    objectPosition: position,
                    opacity: opacity / 100,
                    filter: "saturate(0.15) brightness(0.5)",
                }}
                sizes="100vw"
                unoptimized
                priority={false}
            />
            {/* Fade-out overlays for seamless blending */}
            {(overlay === "top" || overlay === "both") && (
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep-space to-transparent" />
            )}
            {(overlay === "bottom" || overlay === "both") && (
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-deep-space to-transparent" />
            )}
            {overlay === "none" && (
                <>
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-deep-space to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deep-space to-transparent" />
                </>
            )}
        </div>
    );
}
