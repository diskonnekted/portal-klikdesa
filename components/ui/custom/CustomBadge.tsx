import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
    CheckCircle,
    AlertCircle,
    XCircle,
    Info,
    AlertTriangle,
    Clock,
    Check,
    X,
    Star,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "pending";
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "default" | "lg";
    clickable?: boolean;
    onClick?: () => void;
    showCloseButton?: boolean;
    onClose?: () => void;
}

// Icon mapping for common variants
const iconMap: Record<string, LucideIcon> = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    destructive: XCircle,
    pending: Clock,
    default: Check,
    secondary: Minus,
    outline: Info,
};

// Color mappings for custom variants
const variantColors = {
    success: "bg-secondary-200 text-gray-900 border-secondary-300 hover:bg-green-200/80",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200/80",
    info: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200/80",
    pending: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200/80",
};

export const CustomBadge = React.forwardRef<HTMLSpanElement, CustomBadgeProps>(
    (
        {
            variant = "default",
            icon: PropIcon,
            children,
            className,
            size = "default",
            clickable = false,
            onClick,
            showCloseButton = false,
            onClose,
            ...props
        },
        ref
    ) => {
        // Use provided icon or fallback based on variant
        const Icon = PropIcon ?? iconMap[variant];

        // Determine if we should use outline variant for custom colors
        const badgeVariant = ["success", "warning", "info", "pending"].includes(variant) ? "outline" : variant;

        return (
            <Badge
                ref={ref}
                variant={badgeVariant as React.ComponentProps<typeof Badge>["variant"]}
                className={cn(
                    // Enhanced styling following design specifications
                    "flex items-center gap-1 transition-all duration-200",
                    // Custom variant colors
                    variantColors[variant as keyof typeof variantColors],
                    // Size variations
                    size === "sm" && "px-1.5 py-0.5 text-xs",
                    size === "lg" && "px-3 py-1 text-sm",
                    // Clickable styling
                    clickable && "cursor-pointer hover:opacity-80 active:scale-95",
                    // Default styling
                    className
                )}
                onClick={clickable ? onClick : undefined}
                {...props}
            >
                {/* Icon - mandatory per design requirements */}
                {Icon && <Icon className="h-3 w-3 shrink-0" />}

                {/* Badge content */}
                <span className="truncate max-w-32">{children}</span>

                {/* Close button */}
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose?.();
                        }}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                        aria-label="Remove"
                    >
                        <X className="h-3 w-3 shrink-0" />
                    </button>
                )}
            </Badge>
        );
    }
);

CustomBadge.displayName = "CustomBadge";

// Preset badge configurations for common use cases
export const BadgePresets = {
    // Status badges
    Active: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="success" icon={CheckCircle} {...props} />
    ),

    Inactive: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="secondary" icon={XCircle} {...props} />
    ),

    Pending: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="pending" icon={Clock} {...props} />
    ),

    Completed: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="success" icon={Check} {...props} />
    ),

    Failed: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="destructive" icon={XCircle} {...props} />
    ),

    // Priority badges
    High: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="destructive" icon={AlertTriangle} {...props} />
    ),

    Medium: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="warning" icon={AlertCircle} {...props} />
    ),

    Low: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="default" icon={Info} {...props} />
    ),

    // Status badges for documents/applications
    Draft: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="secondary" icon={Minus} {...props} />
    ),

    Published: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="success" icon={CheckCircle} {...props} />
    ),

    Archived: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="outline" icon={Clock} {...props} />
    ),

    // Trend badges
    TrendingUp: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="success" icon={TrendingUp} {...props} />
    ),

    TrendingDown: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="destructive" icon={TrendingDown} {...props} />
    ),

    // Featured badge
    Featured: (props: Omit<CustomBadgeProps, "variant" | "icon">) => (
        <CustomBadge variant="warning" icon={Star} {...props} />
    ),

    // Information badge
    New: (props: Omit<CustomBadgeProps, "variant" | "icon">) => <CustomBadge variant="info" icon={Info} {...props} />,

    // Closable badge
    Removable: (props: Omit<CustomBadgeProps, "showCloseButton">) => <CustomBadge showCloseButton {...props} />,
};

// Badge container for displaying multiple badges
export const BadgeGroup = ({
    badges,
    maxVisible = 3,
    className,
    size = "default",
}: {
    badges: Array<{
        label: string;
        variant?: CustomBadgeProps["variant"];
        icon?: LucideIcon;
        onClick?: () => void;
    }>;
    maxVisible?: number;
    className?: string;
    size?: CustomBadgeProps["size"];
}) => {
    const visibleBadges = badges.slice(0, maxVisible);
    const hiddenCount = badges.length - maxVisible;

    return (
        <div className={cn("flex flex-wrap gap-1", className)}>
            {visibleBadges.map((badge, index) => (
                <CustomBadge
                    key={index}
                    variant={badge.variant}
                    icon={badge.icon}
                    size={size}
                    clickable={!!badge.onClick}
                    onClick={badge.onClick}
                >
                    {badge.label}
                </CustomBadge>
            ))}

            {hiddenCount > 0 && (
                <CustomBadge variant="secondary" size={size}>
                    +{hiddenCount}
                </CustomBadge>
            )}
        </div>
    );
};
