import React, { useState } from "react";
import ModalForm from "../Modal/ModalForm";

interface UpdateDepartmentModalProps {
  open: boolean;
  handleClose: () => void;
  onDepartmentUpdate: (data: { code: string; name: string; status: string }) => void;
}

const UpdateDepartmentModal: React.FC<UpdateDepartmentModalProps> = ({
  open,
  handleClose,
  onDepartmentUpdate,
}) => {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState("");

  const handleConfirm = () => {
    const newDepartment = {
      code: departmentCode,
      name: departmentName,
      status: status,
    };
    onDepartmentUpdate(newDepartment); // Pass the new department data to the parent component
    handleClose();
  };

  return (
    <ModalForm
      open={open}
      handleClose={handleClose}
      title="Update Department"
      fields={[
        {
          label: "Department Code",
          type: "text",
          value: departmentCode,
          onChange: setDepartmentCode,
        },
        {
          label: "Department Name",
          type: "text",
          value: departmentName,
          onChange: setDepartmentName,
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
      confirmText="Update"
    />
  );
};

export default UpdateDepartmentModal;