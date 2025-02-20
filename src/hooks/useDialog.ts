import { useState, useCallback } from "react";

export const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{
        title: string;
        content: string;
        confirmText?: string;
        cancelText?: string;
    }>({ title: "", content: "" });

    // Open dialog with specific content
    const openDialog = useCallback((title: string, content: string, confirmText?: string, cancelText?: string) => {
        setDialogContent({ title, content, confirmText, cancelText });
        setIsOpen(true);
    }, []);

    // Close dialog
    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        dialogContent,
        openDialog,
        closeDialog,
    };
};