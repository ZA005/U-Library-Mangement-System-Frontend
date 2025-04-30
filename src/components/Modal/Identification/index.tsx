import React, { useState, useEffect } from 'react';
import { ModalForm, AccessionNumber } from '../..';
import Borrow from '../../../pages/Circulation/Dialog/Borrow';
import { useDialog } from '../../../hooks/useDialog';
import { useModal } from '../../../hooks/Modal/useModal';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useFetchAccount } from './useFetchAccount';
import QrScanner from '../../QRScan';
interface IdentificationProps {
    refetch?: () => void;
    type?: "RESERVATION" | "BORROW";
    onClose: () => void;
}

const Identification: React.FC<IdentificationProps> = ({ refetch, type = "BORROW", onClose }) => {
    const showSnackbar = useSnackbarContext();

    const [userID, setUserID] = useState("");
    const [submittedUserID, setSubmittedUserID] = useState("");
    const [showIdentification, setShowIdentification] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [hasError, setHasError] = useState(false);

    const { data: account, error, isLoading } = useFetchAccount(submittedUserID);
    const { isOpen: isBorrowOpen, openDialog: openBorrow, closeDialog: closeBorrow } = useDialog();
    const { close: closeAccessionModal, isOpen: isAccessionModalOpen, open: openAccessionModal } = useModal();

    // Handle error once when it occurs
    useEffect(() => {
        if (error && !hasError) {
            showSnackbar(error.message, "error"); // Show error message
            setHasError(true); // Set error state to prevent snackbar from showing again
        }
    }, [error, showSnackbar, hasError]);

    // Conditionally open dialog or modal based on type (only when no error)
    useEffect(() => {
        if (account && submittedUserID && !hasError) {
            setShowIdentification(false);

            if (type === "BORROW") {
                openBorrow();
            } else if (type === "RESERVATION") {
                openAccessionModal();
            }
        }
    }, [account, submittedUserID, type, openBorrow, openAccessionModal, hasError]);

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
            setHasError(false); // Reset error state before submitting
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
                    onOptionalClick={() => setIsScanning(true)}
                    optionalText="Scan QR"
                    disabled={isLoading}
                />
            )}
            {isScanning && (
                <QrScanner
                    onScan={(value) => {
                        setUserID(value);
                        setIsScanning(false);
                    }}
                    onClose={() => setIsScanning(false)}
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
    );
}

export default Identification;