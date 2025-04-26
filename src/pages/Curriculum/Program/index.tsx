import React from "react";
import { useLocation } from "react-router-dom";
import { PageTitle } from "../../../components";
import { useFetchAllCourseByProgram } from "../Uploader/Course/useFetchAllCoursesByProgram";
import { useFetchBookReferencesByCourse } from "../Referencing/Dialog/View/useFetchBookReferenceByCourse";

import { Program } from "../../../types";

const CurriculumProgram: React.FC = () => {
    const location = useLocation()
    const { program }: { program: Program } = location.state || {};

    const { data = [] } = useFetchAllCourseByProgram(program.program_id)

    console.log("courses:", data)
    return (
        <>
            <PageTitle title={program.description} />
        </>
    )
}

export default CurriculumProgram