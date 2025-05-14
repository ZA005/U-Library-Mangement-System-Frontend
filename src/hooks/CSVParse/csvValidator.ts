const HEADERS_MAP: Record<string, string[]> = {
    acquisition: [
        "id", "book_title", "isbn", "publisher", "edition", "published_date",
        "purchase_price", "purchase_date", "acquired_date", "vendor",
        "vendor_location", "funding_source"
    ],
    department: ["dept_id", "dept_name", "dept_code"],
    course: ["course_id", "curr_id", "course_code", "course_name", "year_level", "sem"],
    curriculum: ["curr_id", "program_id", "revision_no", "effectivity_sy", "status"],
    program: ["program_id", "dept_id", "code", "description", "status"],
    users: ["id", "contactNo", "department", "emailAdd", "firstName", "lastName", "middleName", "program", "status", "suffix", "role"],
};

export const validateCSVHeaders = (type: string, data: any[]): string | true => {
    if (data.length === 0) return "CSV file is empty or improperly formatted.";

    const expectedHeaders = HEADERS_MAP[type];
    if (!expectedHeaders) return "Invalid CSV type specified.";

    const fileHeaders = Object.keys(data[0]).sort();
    const sortedExpectedHeaders = expectedHeaders.sort();

    if (JSON.stringify(fileHeaders) !== JSON.stringify(sortedExpectedHeaders)) {
        return `CSV headers do not match the expected format for ${type}. Expected: ${expectedHeaders.join(", ")}`;
    }

    return true;
};
