import React, { useState } from "react";
import searchLibraryOfCongress from "../services/Cataloging/LibraryOfCongressApi";

const MetadataSearch: React.FC = () => {
    const [query, setQuery] = useState("");
    const [metadata, setMetadata] = useState<Array<Record<string, string>> | null>(null);
    //Get the token of the librarian
    const token = localStorage.getItem('token');
    if (!token) {

        return;
    }
    const handleSearch = async () => {
        try {
            const result = await searchLibraryOfCongress(query, token);
            setMetadata(result);
        } catch (error) {
            console.error(error);
            setMetadata(null);
        }
    };

    return (
        <div>
            <h1>Library of Congress Metadata Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query"
            />
            <button onClick={handleSearch}>Search</button>
            {metadata && (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>Publication Date</th>
                            <th>Type</th>
                            <th>Genre</th>
                            <th>Language</th>
                            <th>Physical Description</th>
                            <th>Notes</th>
                            <th>Classification</th>
                            <th>Identifier</th>
                            <th>Record Identifier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(metadata) && metadata.map((book, index) => (
                            <tr key={index}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.dateIssued}</td>
                                <td>{book.typeOfResource}</td>
                                <td>{book.genre}</td>
                                <td>{book.language}</td>
                                <td>{book.physicalDescription}</td>
                                <td>{book.notes}</td>
                                <td>{book.classification}</td>
                                <td>{book.identifier}</td>
                                <td>{book.recordIdentifier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MetadataSearch;
