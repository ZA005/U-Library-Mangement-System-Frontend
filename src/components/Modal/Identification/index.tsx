import React, { useState } from 'react';
import { ModalForm } from '../..';
import Borrow from '../../../pages/Circulation/Dialog/Borrow';
import { useDialog } from '../../../hooks/useDialog';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useFetchAccount } from './useFetchAccount';

interface IdentificationProps {
    refetchLoans: () => void;
    onClose: () => void;
}

const Identification: React.FC<IdentificationProps> = ({ refetchLoans, onClose }) => {
    const showSnackbar = useSnackbarContext()

    const [userID, setUserID] = useState("");
    const [submittedUserID, setSubmittedUserID] = useState("");
    const [showIdentification, setShowIdentification] = useState(true);

    const { data: account, error, isLoading } = useFetchAccount(submittedUserID);
    const { isOpen, openDialog, closeDialog } = useDialog();

    // Handle error immediately when it occurs
    if (error) {
        showSnackbar(error.message, "error");
    }

    // Conditionally open dialog and hide identification when account is fetched
    const handleAccountFetch = () => {
        if (account && submittedUserID && !isOpen) {
            setShowIdentification(false);
            openDialog();
        }
        return null;
    };

    const fields = [
        {
            label: "ID Number",
            type: "text" as const,
            value: userID,
            onChange: setUserID,
        },
    ];

    const handleSubmit = () => {
        if (userID) {
            setSubmittedUserID(userID);
        }
    };

    const handleBorrowClose = () => {
        closeDialog();
        onClose();
    };

    // Call the handler immediately after rendering
    handleAccountFetch();

    return (
        <>
            {showIdentification && (
                <ModalForm
                    open={true}
                    handleClose={onClose}
                    title="Enter ID Number"
                    fields={fields}
                    onConfirm={handleSubmit}
                    confirmText="Submit"
                    onOptionalClick={() => { }}
                    optionalText="Scan QR"
                    disabled={isLoading}
                />
            )}
            {isOpen && account && (
                <Borrow accountData={account} onClose={handleBorrowClose} refetchLoans={refetchLoans} />
            )}
        </>
    )
}

export default Identification;