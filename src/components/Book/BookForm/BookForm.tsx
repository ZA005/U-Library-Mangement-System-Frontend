/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateCallNumber, saveBook } from '../../../services/Cataloging/GoogleBooksApi';
import { fetchLastAccessionNumber } from '../../../services/Cataloging/LocalBooksAPI';

interface Book {
    id: string;
    title: string;
    authors: string[];
    callNumber?: string;
    thumbnail: string;
    categories?: string
}

const BookForm: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Retrieve the book data passed from BookDetails
    const book: Book = state.book;

    // Form state management
    const [status, setStatus] = useState('Available');
    const [barcode, setBarcode] = useState('');
    const [callNumber, setCallNumber] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [section, setSection] = useState('');
    const [dateAcquired, setDateAcquired] = useState('');
    const [categories, setCategories] = useState(book.categories || '');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');
    const [vendor, setVendor] = useState('');
    const [fundingSource, setFundingSource] = useState('');
    const [subjects, setSubjects] = useState('');
    const [numberOfCopies, setNumberOfCopies] = useState(1);
    const [accessionNumbers, setAccessionNumbers] = useState<string[]>([]);



    const generateAccessionNumbers = useCallback(async () => {
        const locationPrefixes: { [key: string]: string } = {
            eLibrary: 'E',
            'Graduate Studies Library': 'GS',
            'Law Library': 'L',
            'Engineering and Architecture Library': 'EA',
            'High School Library': 'HS',
            'Elementary Library': 'EL',
        };
        const prefix = locationPrefixes[location] || 'UNK';
        try {
            const lastAccessionNumber = await fetchLastAccessionNumber(prefix);
            const lastNumber = parseInt(lastAccessionNumber.split('-')[1], 10) || 0;

            const baseNumber = (lastNumber + 1).toString().padStart(6, '0');
            const baseAccessionNumber = `${prefix}-${baseNumber}`;

            const numbers = Array.from({ length: numberOfCopies }, (_, index) =>
                `${baseAccessionNumber} c.${index + 1}`
            );

            setAccessionNumbers(numbers);
        } catch (error) {
            console.error('Error generating accession numbers:', error);
            alert('Failed to generate accession numbers. Please try again.');
        }
    }, [location, numberOfCopies]);


    const handleGenerateCallNumber = useCallback(async () => {
        try {
            const category = state.book.categories[0];
            const authors = book.authors;
            const publishedDate = state.book.publishedDate;
            const title = book.title;




            const callNumber = await generateCallNumber(category, authors, publishedDate, title);
            setCallNumber(callNumber); // Update the state with the generated call number
        } catch (error) {
            alert('Error generating call number. Please try again.');
            console.error(error);
        }
    }, [state.book.categories, state.book.publishedDate, book.authors, book.title]);

    useEffect(() => {
        if (!book.callNumber) {
            handleGenerateCallNumber(); // Generate call number if it doesn't exist
        }
    }, [book.callNumber, handleGenerateCallNumber]);

    useEffect(() => {
        console.log('useEffect for generateAccessionNumbers triggered');
        if (location && numberOfCopies > 0) {
            generateAccessionNumbers();
        }
    }, [location, numberOfCopies, generateAccessionNumbers]);

    const handleSave = async () => {
        // Ensure all fields are valid before proceeding
        if (!numberOfCopies || numberOfCopies < 1 || accessionNumbers.length === 0) {
            alert("Please specify a valid number of copies and ensure accession numbers are generated.");
            return;
        }


        const booksToSave = accessionNumbers.map((accessionNumber) => ({
            bookId: book.id,
            title: book.title,
            accessionNo: accessionNumber, // Unique for each copy
            authors: book.authors.map((author) => ({ name: author })),
            callNumber,
            purchasePrice,
            status,
            barcode,
            section,
            dateAcquired,
            categories: Array.isArray(categories) ? categories : categories?.split(','),
            notes,
            location,
            vendor,
            fundingSource,
            subjects: subjects.split(','),
            thumbnail: book.thumbnail,
            description: state.book.description,
            isbn13: state.book.isbn13,
            isbn10: state.book.isbn10,
            language: state.book.language,
            pageCount: state.book.pageCount,
            publishedDate: state.book.publishedDate,
            publisher: state.book.publisher,
            printType: state.book.printType,
        }));

        try {

            // Save each book entry
            for (const bookData of booksToSave) {
                await saveBook(bookData);
            }

            alert('Book details saved successfully!');
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error(error);
            alert('Failed to save book. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Book Form</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    src={book.thumbnail}
                    alt={book.title}
                    style={{
                        maxWidth: '100px',
                        maxHeight: '150px',
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
            </div>
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Authors:</strong> {book.authors.join(', ')}</p>
            <p><strong>Call Number:</strong> {callNumber || 'N/A'}</p>

            <form>
                {/* Status */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Status: </label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Available">Available</option>
                        <option value="In Processing">In Processing</option>
                        <option value="Loaned Out">Loaned Out</option>
                        <option value="On Order">On Order</option>
                        <option value="Out for Repairs">Out for Repairs</option>
                    </select>
                </div>

                {/* Number of Copies */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Number of Copies: </label>
                    <input
                        type="number"
                        value={numberOfCopies}
                        onChange={(e) => setNumberOfCopies(Number(e.target.value))}
                        min="1"
                    />
                </div>

                {/* Starting Barcode */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Starting Barcode: </label>
                    <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                    />
                </div>

                {/* Call Number */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Call Number: </label>
                    <input
                        type="text"
                        value={callNumber}
                        onChange={(e) => setCallNumber(e.target.value)}
                    />
                </div>

                {/* Purchase Price */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Purchase Price: </label>
                    <input
                        type="text"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Location: </label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">Select</option>
                        <option value="eLibrary">eLibrary</option>
                        <option value="Graduate Studies Library">Graduate Studies Library</option>
                        <option value="Law Library">Law Library</option>
                        <option value="Engineering and Architecture Library">Engineering and Architecture Library</option>
                        <option value="High School Library">High School Library</option>
                        <option value="Elementary Library">Elementary Libray</option>
                    </select>
                </div>

                {/* Section */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Section: </label>
                    <select value={section} onChange={(e) => setSection(e.target.value)}>
                        <option value="">Select</option>
                        <option value="General Reference">General Reference</option>
                        <option value="Circulation">Circulation</option>
                        <option value="Periodical">Periodical</option>
                        <option value="Filipiniana">Filipiniana</option>
                        <option value="Special Collection">Special Collection</option>
                    </select>
                </div>

                {/* Date Acquired */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Date Acquired: </label>
                    <input
                        type="date"
                        value={dateAcquired}
                        onChange={(e) => setDateAcquired(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Categories: </label>
                    <input
                        type="text"
                        value={categories}  // Ensure you're binding to the correct state
                        onChange={(e) => setCategories(e.target.value)}
                    />
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Notes: </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                    ></textarea>
                </div>



                {/* Vendor */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Vendor: </label>
                    <input
                        type="text"
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                    />
                </div>

                {/* Funding Source */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Funding Source: </label>
                    <input
                        type="text"
                        value={fundingSource}
                        onChange={(e) => setFundingSource(e.target.value)}
                    />
                </div>

                {/* Subjects */}
                <div style={{ marginBottom: '10px' }}>
                    <label>Subjects: </label>
                    <input
                        type="text"
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                    />
                </div>

                {/* Buttons */}
                <div>
                    <button type="button" onClick={handleSave} style={{ marginRight: '10px' }}>
                        Save
                    </button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;
