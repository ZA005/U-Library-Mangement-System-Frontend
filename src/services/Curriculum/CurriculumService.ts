import axios from "axios";

export interface Curriculum {
    curr_id: string;
    program_id: number;
    program_code: string;
    program_description: string;
    revision_no: number;
    effectivity_sem: number;
    effectivity_sy: string;
    status: number;
}

const BASE_URL = "http://localhost:8080/";

export const getAllCurriculum = async (): Promise<Curriculum[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/public/curriculums`);
        return response.data;
    } catch (e) {
        console.error("Error fetch curriculums: ", e);
        throw e;
    }
}

export const uploadCurriculums = async (curriculums: Curriculum[]): Promise<Curriculum[]> => {
    try {
        const response = await axios.post(`${BASE_URL}/public/curriculums/upload`, curriculums);

        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const getAllCurriculumsByProgram = async (id: number): Promise<Curriculum[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/public/curriculums/program/${id}`);

        return response.data;
    } catch (e) {
        console.error(e)
        throw e;
    }
}