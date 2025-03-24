import React, { useState, useEffect } from 'react';
import { ModalForm } from '../..';
import Borrow from '../../../pages/Circulation/Dialog/Borrow';
import { useDialog } from '../../../hooks/useDialog';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useFetchAccount } from './useFetchAccount';

interface IdentificationProps {
    onClose: () => void;
}

const Identification: React.FC<IdentificationProps> = ({ onClose }) => {
    const showSnackbar = useSnackbarContext()

    const [userID, setUserID] = useState("");
    const [submittedUserID, setSubmittedUserID] = useState("");
    const [showIdentification, setShowIdentification] = useState(true);

    const { data: account, error, isLoading } = useFetchAccount(submittedUserID);
    const { isOpen, openDialog, closeDialog } = useDialog();

    useEffect(() => {
        if (error) {
            showSnackbar(error.message, "error");
        }
    }, [error, showSnackbar]);

    useEffect(() => {
        if (account && submittedUserID && !isOpen) {
            setShowIdentification(false);
            openDialog();
        }
    }, [account, submittedUserID, isOpen, openDialog]);

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
                <Borrow accountData={account} onClose={handleBorrowClose} />
            )}
        </>
    )
}

export default Identification