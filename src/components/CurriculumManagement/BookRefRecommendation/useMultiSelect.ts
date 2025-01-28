import { useState } from "react";
import { Book } from "./BookRefRec";

export const useMultiSelect = () => {
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

    const toggleMultiSelectMode = () => {
        setMultiSelectMode(!multiSelectMode);
        setSelectedBooks([]);
    };

    const handleCheckboxChange = (book: Book) => {
        setSelectedBooks((prevSelectedBooks) =>
            prevSelectedBooks.includes(book) ? prevSelectedBooks.filter((b) => b !== book) : [...prevSelectedBooks, book]
        );
    };

    return { multiSelectMode, selectedBooks, toggleMultiSelectMode, handleCheckboxChange };
};
