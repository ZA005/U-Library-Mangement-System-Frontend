/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { Books } from "../../../types";
import addBook from "../../../services/Catalog/addBook";

export const useAddBook = () => {
    const {
        mutate: addBookMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    } = useMutation({
        mutationFn: async ({ formData, acquisitionData }: { formData: Record<string, any>; acquisitionData?: any }) => {
            const getAuthorsArray = (authors: any): string[] => {
                if (!authors) return [];
                if (typeof authors === "string") {
                    return authors.split(",").map(author => author.trim());
                }
                if (Array.isArray(authors)) {
                    return authors.map(author =>
                        typeof author === "string" ? author.trim() : author?.name?.trim() || ""
                    ).filter(author => author); // Filter out empty strings
                }
                return [];
            };
            const bookData: Books = {
                accessionNumber: formData.baseAccessionNumber || "",
                title: formData.book_title || "",
                authors: getAuthorsArray(formData.authors),
                isbn10: formData.isbn10 || "",
                isbn13: formData.isbn || "",
                description: formData.description || "",
                pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
                thumbnail: formData.thumbnail || "https://dummyimage.com/1600x2560/000/fff",
                edition: formData.edition || "",
                series: formData.series || "",
                language: formData.language || "",
                publishedDate: formData.published_date || "",
                publisher: formData.publisher || "",
                copyRight: formData.copyright ? formData.copyright.toString() : "",
                categories: formData.categories || "",
                printType: formData.printType,
                format: formData.format,
                status: formData.collectionStatus || "",
                condition: formData.bookCondition || "",
                bookCatalog: {
                    callNumber: formData.callNumber || "",
                    copies: formData.numberOfCopies ? parseInt(formData.numberOfCopies, 10) : 1,
                    collectionType: formData.collectionType || "",
                    section: formData.selectedSection,
                    acquisitionDetails: {
                        id: acquisitionData?.id || formData.id || "",
                        purchase_price: formData.purchase_price || "",
                        vendor_location: formData.vendor_location || "",
                        acquired_date: formData.acquired_date || "",
                        vendor: formData.vendor || "",
                        funding_source: formData.funding_source || "",
                    },
                },
            };

            return addBook(bookData);
        },
    });

    return {
        addBook: addBookMutation,
        isPending,
        isError,
        error,
        isSuccess,
        data
    };
};