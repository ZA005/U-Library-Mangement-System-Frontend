import React, { useState } from "react";
import ModalForm from "../CirculationModal/CirculationModalForm";
import { fetchBookDetails, fetchBorrowerDetails, saveLoanDetails } from "../../services/CirculationApi";

interface CirculationIssueBookModalProps {
  open: boolean;
  handleClose: () => void;
  // onBookIssue: (data: {
  //   accessionNo: string;
  //   title: string;
  //   callNumber: string;
  //   authorName: string;
  //   borrower: string;
  //   departmentName: string;
  //   borrowDate: Date;
  //   returnDate: Date | null;
  //   dueDate: Date;
  //   status: string;
  // }) => void;
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

  const handleNext = async () => {
    if (step === 1) {
      try {
        const { department } = await fetchBorrowerDetails(libraryCardNumber);
        setDepartment(department);
        setStep(2);
      } catch (error) {
        console.error("Error fetching borrower details:", error);
        alert("Borrower details not found!");
      }
    } else if (step === 2) {
      try {
        const { accessionNo, title, callNumber, authors } = await fetchBookDetails(barcode);
        setAccessionNo(accessionNo);
        setCallNumber(callNumber);
        setTitle(title);
        setAuthors(authors);
        const now = new Date();
        const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
        setDue(dueDate);
        setStep(3);
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Book details not found!");
      }
    }
  };

  const handleConfirm = async () => {
    const now = new Date();

    const newCirculationData = {
      accessionNo: accessionNo,
      title: title,
      callNumber,
      authorName: Array.isArray(authors) ? authors.join(", ") : authors, // Convert to string
      borrower: libraryCardNumber,
      departmentName: department,
      borrowDate: now,
      returnDate: null,
      dueDate: due!,
      status: "Borrowed",
    };
    try {
      await saveLoanDetails(newCirculationData);
      // onBookIssue(newCirculationData);
      handleClose();
    } catch (error) {
      console.error("Error saving loan information:", error);
      alert("Failed to save loan information!");
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
          type: 'text',
          value: barcode,
          onChange: setBarcode,
          readOnly: false,
        },
      ];
    } else if (step === 3) {
      return [
        {
          label: "Accession Number",
          type: 'text',
          value: accessionNo,
          readOnly: true,
        },
        {
          label: "Book Title",
          type: 'text',
          value: title,
          readOnly: true,
        },
        {
          label: "Call Number",
          type: 'text',
          value: callNumber,
          readOnly: true,
        },
        {
          label: "Author",
          type: 'text',
          value: authors,
          readOnly: true,
        },
        {
          label: "Borrower",
          type: 'text',
          value: libraryCardNumber,
          readOnly: true,
        },
        {
          label: "Department",
          type: 'text',
          value: department,
          readOnly: true,
        },
        {
          label: "Due",
          type: 'text',
          value: due ? due.toLocaleString() : "",
          readOnly: true,
        },
      ];
    }
    return [];
  };

  return (
    <ModalForm
      open={open}
      handleClose={handleClose}
      title="Issue A Book"
      fields={getFieldsForStep()}
      onConfirm={step === 3 ? handleConfirm : handleNext}
      confirmText={step === 3 ? "Save" : "Next"}
    />
  );
};

export default CirculationIssueBookModal;