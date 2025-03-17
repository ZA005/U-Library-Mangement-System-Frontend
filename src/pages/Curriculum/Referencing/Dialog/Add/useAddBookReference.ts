import { useMutation } from "@tanstack/react-query";
import addBookReference from "../../../../../services/Curriculum/BookReferencing/addBookReference";
import { BookReference, Books, Course } from "../../../../../types";

export const useAddBookReference = () => {
    const {
        mutate: addBookReferenceMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async ({ course, book }: { course: Course; book: Books }) => {
            const newBookReference: BookReference = {
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
            };

            return await addBookReference(newBookReference);
        }
    });

    return {
        addBookReference: addBookReferenceMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
};
