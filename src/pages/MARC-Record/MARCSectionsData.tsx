export const marcSections = [
    {
        sectionNumber: 0,
        marcFields: [
            {
                marcNumber: "000",
                marcName: "Leader",
                subfields: [
                    { subfieldCode: "a", label: "Leader", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 1,
        marcFields: [
            
        ],
    },
    {
        sectionNumber: 2,
        marcFields: [
            {
                marcNumber: "245",
                marcName: "Title Statement",
                subfields: [
                    { subfieldCode: "a", label: "Title", required: true },
                    { subfieldCode: "b", label: "Subtitle" },
                    { subfieldCode: "c", label: "Statement of responsibility" },
                ],
            },
            {
                marcNumber: "260",
                marcName: "Publication, Distribution, etc.",
                subfields: [
                    { subfieldCode: "a", label: "Name of publisher, distributor, etc.", required: true },
                    { subfieldCode: "b", label: "Date of publication, distribution, etc." },
                    { subfieldCode: "c", label: "Place of manufacture" },
                ],
            },
        ],
    },
    {
        sectionNumber: 3,
        marcFields: [],
    },
    {
        sectionNumber: 4,
        marcFields: [
            {
                marcNumber: "490",
                marcName: "Series",
                subfields: [
                    { subfieldCode: "a", label: "Series", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 5,
        marcFields: [],
    },
    {
        sectionNumber: 6,
        marcFields: [],
    },
    {
        sectionNumber: 7,
        marcFields: [],
    },
    {
        sectionNumber: 8,
        marcFields: [],
    },
    {
        sectionNumber: 9,
        marcFields: [
            {
                marcNumber: "942",
                marcName: "Added Entry Elements",
                subfields: [
                    { subfieldCode: "a", label: "Test", required: true },
                    { subfieldCode: "a", label: "Test", required: true },
                ],
            },
        ],
    },
];
