import { useMutation } from "@tanstack/react-query";
import addMultipleBookReference from "../../../../../services/Curriculum/BookReferencing/addMultipleBookReference";
import { BookReference, Books, Course } from "../../../../../types";

export const useAddMultipleBookReference = () => {
    const {
        mutate: addMultipleBookReferenceMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async ({ course, books }: { course: Course; books: Books[] }) => {
            const newBookReference: BookReference[] = books.map((book) => ({
                id: 0,
                course_id: course.course_id,
                course_name: course.course_name,
                book_id: book.id,
                book_name: book.title,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                copyright: book.copyRight,
                language: book.language,
                status: 1
            }))

            return await addMultipleBookReference(newBookReference);
        }
    });

    return {
        addMultipleBookReference: addMultipleBookReferenceMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
};
