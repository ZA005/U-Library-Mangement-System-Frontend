import React, { useEffect, useState } from "react";
import ModalForm from "../CirculationModal/CirculationModalForm";
import { Loan } from "../../../model/Loan";
import { updateLoanStatus } from "../../../services/CirculationApi";

interface CirculationUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  loanData: Loan[] | undefined; // Use Loan | undefined for stricter type checking
  onUpdateLoan: (updatedLoan: Loan) => void
}

const CirculationUpdateModal: React.FC<CirculationUpdateModalProps> = ({
  open,
  handleClose,
  loanData,
  onUpdateLoan,
}) => {
  const [accessionNo, setAccessionNo] = useState("");
  const [title, setTitle] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [borrower, setBorrower] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (loanData) {
      setAccessionNo(loanData?.[0]?.accessionNo || "");
      setTitle(loanData?.[0]?.title || "");
      setCallNumber(loanData?.[0]?.callNumber || "");
      setBorrower(loanData?.[0]?.borrower || "");
      setDueDate(
        loanData?.[0]?.dueDate
          ? new Date(loanData?.[0]?.dueDate).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "medium",
          })
          : ""
      );
      setStatus(loanData?.[0]?.status || "");
    } else {
      setAccessionNo("");
      setTitle("");
      setCallNumber("");
      setBorrower("");
      setDueDate("");
      setStatus("");
    }
  }, [loanData]);

  const handleConfirm = async () => {
    if (loanData) {
      const updatedCirculationData = {
        ...loanData[0],
        status,
        returnDate: status === "Returned" ? new Date().toISOString() : loanData[0]?.returnDate,
      };
      try {
        // Call API to update the loan
        await updateLoanStatus(BigInt(updatedCirculationData.loanId), status);

        // Notify parent component about the update
        onUpdateLoan(updatedCirculationData);

        handleClose();
      } catch (error) {
        console.error("Error updating circulation data:", error);
      }
    }
  };


  const fields = [
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
      label: "Borrower",
      type: "text",
      value: borrower,
      readOnly: true,
    },
    {
      label: "Due",
      type: "text",
      value: dueDate,
      readOnly: true,
    },
    {
      label: "Status",
      type: "select",
      value: status,
      onChange: (value: string) => setStatus(value),
      options: ["Borrowed", "Returned", "Renewed", "Lost"],
      readOnly: false,
    },
  ];

  return (
    <>
      {loanData && (
        <ModalForm
          open={open}
          handleClose={handleClose}
          title="Update Circulation"
          fields={fields}
          onConfirm={handleConfirm}
          confirmText="Update"
        />
      )}
    </>
  );
};

export default CirculationUpdateModal;