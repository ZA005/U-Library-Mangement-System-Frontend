import React, { useState } from "react";
import { useFetchBookReferencesByCourse } from "../../View/useFetchBookReferenceByCourse";
import { CustomDialog } from "../../../../../../components";

interface ViewBookReferenceProps {
    course: Course;
    onClose: () => void;
}

const ViewBookReference: React.FC<ViewBookReferenceProps> = ({ course, onClose }) => {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(true);

    const handleViewDialogClose = () => {
        setIsViewDialogOpen(false);
        onClose();
    };
    return (
        <>

        </>
    )
}