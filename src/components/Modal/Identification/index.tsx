import React, { useState, useEffect } from 'react';
import { ModalForm, AccessionNumber } from '../..';
import Borrow from '../../../pages/Circulation/Dialog/Borrow';
import { useDialog } from '../../../hooks/useDialog';
import { useModal } from '../../../hooks/Modal/useModal';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useFetchAccount } from './useFetchAccount';

interface IdentificationProps {
    refetch?: () => void;
    type?: "RESERVATION" | "BORROW";
    onClose: () => void;
}

const Identification: React.FC<IdentificationProps> = ({ refetch, type = "BORROW", onClose }) => {
    const showSnackbar = useSnackbarContext()

    const [userID, setUserID] = useState("");
    const [submittedUserID, setSubmittedUserID] = useState("");
    const [showIdentification, setShowIdentification] = useState(true);

    const { data: account, error, isLoading } = useFetchAccount(submittedUserID);
    const { isOpen: isBorrowOpen, openDialog: openBorrow, closeDialog: closeBorrow } = useDialog();
    const { close: closeAccessionModal, isOpen: isAccessionModalOpen, open: openAccessionModal } = useModal();

    // Handle error immediately when it occurs
    useEffect(() => {
        if (error) {
            showSnackbar(error.message, "error");
        }
    }, [error, showSnackbar]);

    // Conditionally open dialog or modal based on type
    useEffect(() => {
        if (account && submittedUserID) {
            setShowIdentification(false);

            if (type === "BORROW") {
                openBorrow();
            } else if (type === "RESERVATION") {
                openAccessionModal();
            }
        }
    }, [account, submittedUserID, type, openBorrow, openAccessionModal]);

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

    const handleClose = () => {
        if (type === "BORROW") {
            closeBorrow();
        } else if (type === "RESERVATION") {
            closeAccessionModal();
        }
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
            {isBorrowOpen && account && type === "BORROW" && (
                <Borrow accountData={account} onClose={handleClose} refetch={refetch} />
            )}
            {isAccessionModalOpen && account && type === "RESERVATION" && (
                <AccessionNumber
                    accountData={account}
                    onClose={handleClose}
                    refetch={() => { }}
                />
            )}
        </>
    )
}

export default Identification;