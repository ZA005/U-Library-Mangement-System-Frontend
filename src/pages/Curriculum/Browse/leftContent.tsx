import { Typography } from "@mui/material";
import React from "react";

const LeftContent: React.FC = () => {

    return (
        <>
            <Typography variant="body1">
                Welcome to the University Curriculum, your gateway to discovering and managing academic programs across various disciplines. This platform makes it easy for students, faculty, and administrators to explore the structure of each academic field and access the courses that define them.
            </Typography>

            <Typography variant="body1">
                With just a few clicks, you can:
            </Typography>

            <ul>
                <li >
                    <Typography variant="body1">
                        <strong>Browse Departments:</strong> Explore academic departments such as Art and Sciences, Business and Accountancy, Computer Studies, and more.
                    </Typography>
                </li>
                <li >
                    <Typography variant="body1">
                        <strong>View Courses:</strong> Dive into the courses offered under each department to find detailed information and ensure students have access to all required resources.
                    </Typography>
                </li>
                <li>
                    <Typography variant="body1">
                        <strong>Support Learning Goals:</strong> Whether you're a student planning your educational journey or an educator organizing resources, this page provides a clear, streamlined view of all academic opportunities.
                    </Typography>
                </li>
            </ul>
        </>
    )
}

export default LeftContent