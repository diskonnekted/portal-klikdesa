"use client";

import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Confirmation Dialog (non-closable on outside click)
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: "default" | "destructive";
}

const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    loading = false,
    variant = "default",
}: ConfirmDialogProps) => {
    const [isConfirming, setIsConfirming] = React.useState(false);

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isConfirming || loading}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={isConfirming || loading}
                        className={cn(variant === "destructive" && "bg-destructive hover:bg-destructive/90")}
                    >
                        {isConfirming || loading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Memproses...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Form Dialog for add/edit operations
interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    onSubmit?: () => void | Promise<void>;
    submitText?: string;
    cancelText?: string;
    loading?: boolean;
    showSubmitButton?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

const FormDialog = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSubmit,
    submitText = "Simpan",
    cancelText = "Batal",
    loading = false,
    showSubmitButton = true,
    size = "md",
}: FormDialogProps) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw]",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSubmit) return;

        setIsSubmitting(true);
        try {
            await onSubmit();
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(sizeClasses[size])}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
                    )}
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="max-h-[60vh] overflow-y-auto">{children}</div>

                    {showSubmitButton && (
                        <DialogFooter className="pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting || loading}
                            >
                                {cancelText}
                            </Button>
                            <Button type="submit" disabled={isSubmitting || loading}>
                                {isSubmitting || loading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    submitText
                                )}
                            </Button>
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Simple Dialog for general purpose
interface CustomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    _showCloseButton?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    footer?: React.ReactNode;
}

const CustomDialog = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    _showCloseButton = true,
    size = "md",
    footer,
}: CustomDialogProps) => {
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw]",
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(sizeClasses[size])} showCloseButton={_showCloseButton}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto">{children}</div>

                {footer && <DialogFooter className="pt-4 border-t">{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
};

// Hook for using dialogs
const useDialog = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);
    const toggleDialog = () => setIsOpen(!isOpen);

    return {
        isOpen,
        openDialog,
        closeDialog,
        toggleDialog,
        loading,
        setLoading,
    };
};

export { ConfirmDialog, FormDialog, CustomDialog, useDialog };

export type { ConfirmDialogProps, FormDialogProps, CustomDialogProps };

// Default exports
export default ConfirmDialog;
