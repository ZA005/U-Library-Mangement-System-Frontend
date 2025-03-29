import React, { useState, useEffect } from 'react';
import { ModalForm } from '../..';
import { useSnackbarContext } from '../../../contexts/SnackbarContext';
import { useFetchBookByAccessionNumber } from './useFetchBookByAccessionNumber';
import { Books, AccountData } from '../../../types';
import ConfirmReservation from '../../../pages/Circulation/Reservation/Dialog/ConfirmReservation';

interface AccessionNumberProps {
    accountData: AccountData
    refetch: () => void;
    onClose: () => void;
    onBookFetched?: (book: Books) => void;
}

const AccessionNumber: React.FC<AccessionNumberProps> = ({ accountData, refetch, onClose, onBookFetched }) => {
    const showSnackbar = useSnackbarContext();
    const [accessionNumber, setAccessionNumber] = useState("");
    const [shouldFetch, setShouldFetch] = useState(false);
    const [showConfirmReservation, setShowConfirmReservation] = useState(false);
    const [fetchedBook, setFetchedBook] = useState<Books | null>(null);

    const { data: book, error, isLoading } = useFetchBookByAccessionNumber(
        shouldFetch ? accessionNumber : ""
    );

    useEffect(() => {
        if (book) {
            // Console log the fetched book
            console.log("Fetched Book:", book);

            // Book successfully fetched
            showSnackbar("Book found successfully!", "success");
            onBookFetched?.(book);
            setFetchedBook(book);
            setShowConfirmReservation(true);
            setShouldFetch(false);
        }
    }, [book, onBookFetched, showSnackbar]);

    useEffect(() => {
        if (error) {
            // Handle fetch error
            showSnackbar("Failed to find book with this accession number", "error");
            setShouldFetch(false);
        }
    }, [error, showSnackbar]);

    const fields = [
        {
            label: "Accession Number",
            type: "text" as const,
            value: accessionNumber,
            onChange: setAccessionNumber,
        },
    ];

    const handleSubmit = () => {
        if (accessionNumber) {
            setShouldFetch(true);
        } else {
            showSnackbar("Please enter an accession number", "warning");
        }
    }

    const handleConfirmReservationClose = () => {
        setShowConfirmReservation(false);
        onClose();
    }

    return (
        <>
            <ModalForm
                open={!showConfirmReservation}
                handleClose={onClose}
                title="Enter Accession Number"
                fields={fields}
                onConfirm={handleSubmit}
                confirmText="Submit"
                onOptionalClick={() => { }}
                optionalText="Scan QR"
                disabled={isLoading}
            />

            {showConfirmReservation && fetchedBook && (
                <ConfirmReservation
                    bookData={fetchedBook}
                    account_id={accountData.account_id}
                    user_id={accountData.user_id}
                    refetchReservations={refetch}
                    onClose={handleConfirmReservationClose}
                />
            )}
        </>
    )
}

export default AccessionNumber;