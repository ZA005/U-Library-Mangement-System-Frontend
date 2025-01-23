export const marcSections = [
    {
        sectionNumber: 0,
        marcFields: [
            {
                marcNumber: "020",
                marcName: "ISBN",
                subfields: [
                    { subfieldCode: "a", label: "International Standard Book Number", required: true },
                ],
            },
            {
                marcNumber: "040",
                marcName: "Cataloging Source",
                subfields: [
                    { subfieldCode: "a", label: "Original Cataloging Agency", required: true },
                    // { subfieldCode: "b", label: "Language of Cataloging", required: true },
                    // { subfieldCode: "c", label: "Transcribing Agency", required: true },
                    // { subfieldCode: "d", label: "Modifying Agency", required: true },
                    // { subfieldCode: "e", label: "Description Conventions", required: true },
                    // { subfieldCode: "6", label: "Linkage", required: true },
                    // { subfieldCode: "8", label: "Field Link and Sequence Number", required: true },
                ],
            },
            {
                marcNumber: "050",
                marcName: "Library of Congress Call Number",
                subfields: [
                    { subfieldCode: "a", label: "Library of Congress Call Number", required: true },
                ],
            },
            {
                marcNumber: "082",
                marcName: "Dewey Decimal Classification Number",
                subfields: [
                    { subfieldCode: "a", label: "Dewey Decimal Classification Number", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 1,
        marcFields: [
            {
                marcNumber: "100",
                marcName: "Personal Name",
                subfields: [
                    { subfieldCode: "a", label: "Personal Name", required: true },
                ],
            },
            {
                marcNumber: "110",
                marcName: "Corporate Name",
                subfields: [
                    { subfieldCode: "a", label: "Corporate Name", required: true },
                ],
            },
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
                    // { subfieldCode: "b", label: "Subtitle" },
                    // { subfieldCode: "c", label: "Statement of responsibility" },
                ],
            },
            {
                marcNumber: "250",
                marcName: "Edition Statement",
                subfields: [
                    { subfieldCode: "a", label: "Edition statement", required: true },
                    // { subfieldCode: "b", label: "Remainder of edition statement" },
                ],
            },
            {
                marcNumber: "260",
                marcName: "Publication, Distribution, etc.",
                subfields: [
                    { subfieldCode: "a", label: "Name of publisher, distributor, etc.", required: true },
                    // { subfieldCode: "b", label: "Date of publication, distribution, etc." },
                    // { subfieldCode: "c", label: "Place of manufacture" },
                ],
            },
        ],
    },
    {
        sectionNumber: 3,
        marcFields: [
            {
                marcNumber: "300",
                marcName: "Physical Description",
                subfields: [
                    { subfieldCode: "a", label: "Description", required: true },
                    // { subfieldCode: "b", label: "Other physical details" },
                    // { subfieldCode: "c", label: "Dimensions" },
                ],
            },
            {
                marcNumber: "336",
                marcName: "Content Type",
                subfields: [
                    { subfieldCode: "a", label: "Content type term", required: true },
                    // { subfieldCode: "b", label: "Content type code." },
                ],
            },
            {
                marcNumber: "337",
                marcName: "Media Type",
                subfields: [
                    { subfieldCode: "a", label: "Media type term", required: true },
                    // { subfieldCode: "b", label: "Media type code" },
                    // { subfieldCode: "c", label: "Place of manufacture" },
                ],
            },
            {
                marcNumber: "375",
                marcName: "Gender",
                subfields: [
                    { subfieldCode: "a", label: "Gender.", required: true },
                ],
            },
            {
                marcNumber: "377",
                marcName: "Associated Language",
                subfields: [
                    { subfieldCode: "a", label: "Language code", required: true },
                    // { subfieldCode: "b", label: "Language term" },
                    // { subfieldCode: "c", label: "Place of manufacture" },
                ],
            },
        ],
    },
    {
        sectionNumber: 4,
        marcFields: [
            {
                marcNumber: "440",
                marcName: "Series Statement",
                subfields: [
                    { subfieldCode: "a", label: "Title", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 5,
        marcFields: [
            {
                marcNumber: "504",
                marcName: "Bibliography, Etc. Note",
                subfields: [
                    { subfieldCode: "a", label: "Bibliography, etc. note", required: true },
                ],
            },
            {
                marcNumber: "505",
                marcName: "Formatted Contents Note",
                subfields: [
                    { subfieldCode: "a", label: "Formatted contents note", required: true },
                ],
            },
            {
                marcNumber: "508",
                marcName: "Creation/Production Credits Note",
                subfields: [
                    { subfieldCode: "a", label: "Creation/production credits note", required: true },
                ],
            },
            {
                marcNumber: "520",
                marcName: "Summary, etc.",
                subfields: [
                    { subfieldCode: "a", label: "Summary, etc.", required: true },
                ],
            },
            {
                marcNumber: "521",
                marcName: "Target Audience Note",
                subfields: [
                    { subfieldCode: "a", label: "Target audience note", required: true },
                ],
            },
            {
                marcNumber: "536",
                marcName: "Funding Information Note",
                subfields: [
                    { subfieldCode: "a", label: "Text of note", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 6,
        marcFields: [
            {
                marcNumber: "650",
                marcName: "Topical Term",
                subfields: [
                    { subfieldCode: "a", label: "Topical term or geographic name entry element", required: true },
                ],
            },
            {
                marcNumber: "678",
                marcName: "Biographical/Historical Data",
                subfields: [
                    { subfieldCode: "a", label: "Biographical or historical data ", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 7,
        marcFields: [
            {
                marcNumber: "700",
                marcName: "Personal Name",
                subfields: [
                    { subfieldCode: "a", label: "Persnal Name", required: true },
                ],
            },
        ],
    },
    {
        sectionNumber: 8,
        marcFields: [],
    },
    {
        sectionNumber: 9,
        marcFields: [
            // {
            //     marcNumber: "925",
            //     marcName: "Added Entry Elements",
            //     subfields: [
            //         { subfieldCode: "a", label: "Test", required: true },
            //         { subfieldCode: "a", label: "Test", required: true },
            //     ],
            // },
            // {
            //     marcNumber: "952",
            //     marcName: "Added Entry Elements",
            //     subfields: [
            //         { subfieldCode: "a", label: "Test", required: true },
            //         { subfieldCode: "a", label: "Test", required: true },
            //     ],
            // },
            // {
            //     marcNumber: "991",
            //     marcName: "Added Entry Elements",
            //     subfields: [
            //         { subfieldCode: "a", label: "Test", required: true },
            //         { subfieldCode: "a", label: "Test", required: true },
            //     ],
            // },
            // {
            //     marcNumber: "999",
            //     marcName: "Added Entry Elements",
            //     subfields: [
            //         { subfieldCode: "a", label: "Test", required: true },
            //         { subfieldCode: "a", label: "Test", required: true },
            //     ],
            // },
        ],
    },
];