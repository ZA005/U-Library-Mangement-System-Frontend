import React, { useState } from "react";
import ModalForm from "../CirculationModal/CirculationModalForm";
import { checkBookLoanStatus, fetchBookDetails, fetchBorrowerDetails, saveLoanDetails } from "../../../services/CirculationApi";

interface CirculationIssueBookModalProps {
  open: boolean;
  handleClose: () => void;
}

const CirculationIssueBookModal: React.FC<CirculationIssueBookModalProps> = ({
  open,
  handleClose,
}) => {
  const [step, setStep] = useState(1);
  const [libraryCardNumber, setLibraryCardNumber] = useState("");
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [accessionNo, setAccessionNo] = useState("");
  const [authors, setAuthors] = useState("");
  const [department, setDepartment] = useState("");
  const [due, setDue] = useState<Date>(new Date());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const resetState = () => {
    setStep(1);
    setLibraryCardNumber("");
    setBarcode("");
    setTitle("");
    setCallNumber("");
    setAccessionNo("");
    setAuthors("");
    setDepartment("");
    setDue(new Date());
    setErrorMessage(null);
  };

  const handleNext = async () => {
    setErrorMessage(null);
    if (step === 1) {
      try {
        const { department } = await fetchBorrowerDetails(libraryCardNumber);
        setDepartment(department);
        setStep(2);
      } catch (error) {
        console.error("Error fetching borrower details:", error);
        setErrorMessage("Borrower details not found. Please verify the Library Card Number.");
      }
    } else if (step === 2) {
      try {
        const { accessionNo, title, callNumber, authors } = await fetchBookDetails(barcode);
        setAccessionNo(accessionNo);
        setCallNumber(callNumber);
        setTitle(title);
        setAuthors(authors);

        // Check if the book is already loaned out
        const isBookLoaned = await checkBookLoanStatus(barcode);
        if (isBookLoaned) {
          setErrorMessage("This book is already loaned out. Please choose another book.");
        } else {
          const manilaDate = new Date(manilaTime.replace(',', ''));

          // Add 24 hours
          const dueDate = new Date(manilaDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
          setDue(dueDate);
          setStep(3);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setErrorMessage("Book details not found. Please verify the Barcode.");
      }
    }
  };

  const handleConfirm = async () => {
    setErrorMessage(null);
    console.log("now", manilaTime);

    const newCirculationData = {
      accessionNo: accessionNo,
      title: title,
      callNumber,
      authorName: Array.isArray(authors) ? authors.join(", ") : authors,
      borrower: libraryCardNumber,
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
    console.log("newCirculationData", newCirculationData.dueDate);
    try {
      await saveLoanDetails(newCirculationData);
      handleClose();
      resetState();
    } catch (error) {
      console.error("Error saving loan information:", error);
      setErrorMessage("Failed to save loan information. Please try again.");
    }
  };

  const getFieldsForStep = () => {
    if (step === 1) {
      return [
        {
          label: "Library Card Number",
          type: "text",
          value: libraryCardNumber,
          onChange: setLibraryCardNumber,
          readOnly: false,
        },
      ];
    } else if (step === 2) {
      return [
        {
          label: "Barcode",
          type: "text",
          value: barcode,
          onChange: setBarcode,
          readOnly: false,
        },
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
          value: libraryCardNumber,
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
    return [];
  };

  return (
    <>
      <ModalForm
        open={open}
        handleClose={() => {
          handleClose();
          resetState();
        }}
        title="Issue A Book"
        fields={getFieldsForStep()}
        onConfirm={step === 3 ? handleConfirm : handleNext}
        confirmText={step === 3 ? "Save" : "Next"}
        errorMessage={errorMessage} // Display error message if present
      />
    </>
  );
};

export default CirculationIssueBookModal;
