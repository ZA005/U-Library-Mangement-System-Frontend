import { createApiClient } from "../../api/apiClient";
import { ReferenceForExport } from "../../../types/Curriculum/ReferenceForExport";

export const exportReferencesByProgram = async (revisionNo: number, programId: number): Promise<ReferenceForExport[]> => {
    const apiClient = createApiClient("public");

    try {
        const response = await apiClient.get<any[]>(`/reference/export`, {
            params: {
                revisionNo,
                programId
            }
        });

        // Map the array of arrays into array of objects
        const mappedData: ReferenceForExport[] = response.data.map((item) => ({
            program_name: item[0],
            year_level: item[1],
            semester: item[2],
            course_code: item[3],
            course_name: item[4],
            book_title: item[5],
            authors: item[6],
            copies: item[7],
            copyright: item[8],
        }));

        return mappedData;
    } catch (e) {
        console.error(e);
        throw e;
    }
};