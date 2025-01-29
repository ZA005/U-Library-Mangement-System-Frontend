import { useState } from "react";

export const useConfirmationDialog = (onConfirm: () => void, onCancel: () => void) => {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    const confirmAction = () => {
        onConfirm();
        closeDialog();
    };

    const cancelAction = () => {
        onCancel();
        closeDialog();
    };

    return { isOpen, openDialog, closeDialog, confirmAction, cancelAction };
};
