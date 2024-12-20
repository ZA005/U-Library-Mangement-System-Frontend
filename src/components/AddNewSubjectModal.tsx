import React, { useState } from "react";
import ModalForm from "./Modal/ModalForm";

interface AddNewSubjectModalProps {
  open: boolean;
  handleClose: () => void;
    onSubjectAdd: (data: { code: string; name: string; department: string; course: string;  status: string }) => void;
}

const AddNewSubjectModal: React.FC<AddNewSubjectModalProps> = ({
  open,
  handleClose,
  onSubjectAdd,
}) => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [status, setStatus] = useState("");

  const handleConfirm = () => {
    const newSubject = {
      code: subjectCode,
      name: subjectName,
      department: departmentName,
      course: courseName,
      status: status,
    };
    onSubjectAdd(newSubject); // Pass the new Subject data to the parent component
    handleClose();
  };

  return (
    <ModalForm
      open={open}
      handleClose={handleClose}
      title="Add New Subject"
      fields={[
        {
          label: "Subject Code",
          type: "text",
          value: subjectCode,
          onChange: setSubjectCode,
        },
        {
          label: "Subject Name",
          type: "text",
          value: subjectName,
          onChange: setSubjectName,
          },
        {
          label: "Associated Department",
          type: "select",
          value: departmentName,
          onChange: setDepartmentName,
          options: ["Computer Studies", "Nursing"],
        },
        {
          label: "Associated Course",
          type: "select",
          value: courseName,
          onChange: setCourseName,
          options: ["Information Technology", "MidWife"],
        },
        {
          label: "Status",
          type: "select",
          value: status,
          onChange: setStatus,
          options: ["Active", "Inactive"],
        },
      ]}
      onConfirm={handleConfirm}
      confirmText="Confirm"
    />
  );
};

export default AddNewSubjectModal;