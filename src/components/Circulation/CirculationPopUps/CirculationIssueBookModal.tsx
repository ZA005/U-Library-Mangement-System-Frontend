/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { fetchBookDetails, fetchBorrowerDetails, saveLoanDetails } from "../../../services/Circulation/CirculationApi";
import { Alert, Button, Snackbar } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackbar";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import CirculationModalForm from "../CirculationModal/CirculationModalForm";

interface CirculationIssueBookModalProps {
  open: boolean;
  handleClose: () => void;
  onLoanSuccess: (updatedLoan: unknown) => void;
}

const CirculationIssueBookModal: React.FC<CirculationIssueBookModalProps> = ({
  open,
  handleClose,
  onLoanSuccess
}) => {
  const [step, setStep] = useState(1);
  const [idNumber, setIdNumber] = useState(""); // Change libraryCardNumber to idNumber
  const [title, setTitle] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [accessionNo, setAccessionNo] = useState("");
  const [authors, setAuthors] = useState("");
  const [department, setDepartment] = useState("");
  const [due, setDue] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Get the current time in Manila timezone
  const now = new Date();
  const manilaTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarStatus,
    openSnackbar,
    closeSnackbar,
  } = useSnackbar();


  const resetState = () => {
    setStep(1);
    setIdNumber(""); // Change libraryCardNumber to idNumber
    setTitle("");
    setCallNumber("");
    setAccessionNo("");
    setAuthors("");
    setDepartment("");
    setDue(new Date());
    setErrorMessage(null);
  };

  const handleScan = (err: any, result: any) => {
    if (result) {
      if (step === 1) {
        setIdNumber(result.text);
      } else if (step === 2) {
        setAccessionNo(result.text);
      }
      setIsScanning(false);
    }
  };

  const handleNext = async () => {
    setErrorMessage(null);
    if (step === 1) {
      try {
        // Fetch borrower details based on ID number
        const { department, hasCurrentBorrowedBook, registered } = await fetchBorrowerDetails(idNumber); // Fetch based on idNumber

        if (!registered) {
          setErrorMessage("This borrower is not registered. Please verify the ID number.");
          return; // Prevent moving to the next step if not registered
        }

        if (hasCurrentBorrowedBook) {
          setErrorMessage("This borrower already has a current borrowed book. They cannot borrow another one.");
          return; // Prevent moving to the next step if the borrower has a current book
        }

        setDepartment(department);
        setStep(2);
      } catch (error) {
        console.error("Error fetching borrower details:", error);
        setErrorMessage("Borrower details not found. Please verify the ID number.");
      }
    } else if (step === 2) {
      try {
        const { title, callNumber, authors, bookStatus } = await fetchBookDetails(accessionNo);
        setCallNumber(callNumber);
        setTitle(title);
        setAuthors(authors);

        // Check if the book status is "Loaned Out"
        if (bookStatus === "Loaned Out") {
          setErrorMessage("This book is already loaned out. Please choose another book.");
        } else {
          const manilaDate = new Date(manilaTime.replace(',', ''));

          // Add 24 hours to due date
          const dueDate = new Date(manilaDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
          setDue(dueDate);
          setStep(3); // Proceed to the confirmation step
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setErrorMessage("Book details not found. Please verify the Accession number.");
      }
    }

  };

  const handleConfirm = async () => {
    setErrorMessage(null);

    const newCirculationData = {
      accessionNo: accessionNo,
      title: title,
      callNumber,
      authorName: Array.isArray(authors) ? authors.join(", ") : authors,
      borrower: idNumber, // Use idNumber instead of libraryCardNumber
      departmentName: department,
      borrowDate: manilaTime,
      returnDate: null,
      dueDate: new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(due!),
      status: "Borrowed",
    };

    try {
      const savedLoan = await saveLoanDetails(newCirculationData);
      openSnackbar(`Successfully borrowed ${title}.`, "success");
      handleClose();
      resetState();
      onLoanSuccess(savedLoan);
    } catch (error) {
      console.error("Error saving loan information:", error);
      setErrorMessage("Failed to save loan information. Please try again.");
    }
  };

  interface Field {
    label: string;
    type: "text" | "button";
    value?: string;
    onChange?: React.Dispatch<React.SetStateAction<string>>;
    readOnly?: boolean;
    onClick?: () => void;
  }

  const getFieldsForStep = (): Field[] => {
    let fields: Field[] = [];
    if (step === 1) {
      fields = [
        {
          label: "ID Number",
          type: "text",
          value: idNumber,
          onChange: setIdNumber,
          readOnly: false,
        },
        {
          label: 'Scan ID',
          type: "button",
          onClick: () => setIsScanning(true),
        }
      ];
    } else if (step === 2) {
      fields = [
        {
          label: "Accession Number",
          type: "text",
          value: accessionNo,
          onChange: setAccessionNo,
          readOnly: false,
        },
        {
          label: 'Scan Accession',
          type: 'button',
          onClick: () => setIsScanning(true),
        }
      ];
    } else if (step === 3) {
      return [
        {
          label: "Accession Number",
          type: "text",
          value: accessionNo,
          readOnly: true,
        },
        {
          label: "Book Title",
          type: "text",
          value: title,
          readOnly: true,
        },
        {
          label: "Call Number",
          type: "text",
          value: callNumber,
          readOnly: true,
        },
        {
          label: "Author",
          type: "text",
          value: authors,
          readOnly: true,
        },
        {
          label: "Borrower",
          type: "text",
          value: idNumber,
          readOnly: true,
        },
        {
          label: "Department",
          type: "text",
          value: department,
          readOnly: true,
        },
        {
          label: "Due",
          type: "text",
          value: due ? due.toLocaleString() : "",
          readOnly: true,
        },
      ];
    }
    return fields;
  };

  return (
    <>
      <CirculationModalForm
        open={open}
        handleClose={() => {
          handleClose();
          resetState();
        }}
        title={step === 1 ? "Enter ID Number" : step === 2 ? "Enter Accession Number" : "Confirm Loan"}
        fields={getFieldsForStep()}
        onConfirm={step === 3 ? handleConfirm : handleNext}
        confirmText={step === 3 ? "Save" : "Next"}
        errorMessage={errorMessage}
      />
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={handleScan}
            />
            <Button
              variant="contained"
              onClick={() => setIsScanning(false)}
              style={{ marginTop: '20px' }}
            >
              Close Scanner
            </Button>
          </div>
        </div>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
        <Alert onClose={closeSnackbar} severity={snackbarStatus}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>

  );
};

export default CirculationIssueBookModal;
