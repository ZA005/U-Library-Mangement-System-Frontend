import React from "react";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";

interface TabCheckboxGroupProps {
    activeTab: number;
    sections: string[];
    collection: string[];
    setSections: React.Dispatch<React.SetStateAction<string[]>>;
    setCollection: React.Dispatch<React.SetStateAction<string[]>>;
}

const tabData = [
    {
        label: "Sections",
        options: ["General Reference", "Circulation", "Periodicals", "Filipiniana", "Special Collection"],
    },
    {
        label: "Collection Type",
        options: ["Book", "Journals", "Theses & Dissertation", "Special Collections", "Museum and Archival Materials"],
    },
];

const TabCheckboxGroup: React.FC<TabCheckboxGroupProps> = ({
    activeTab,
    sections,
    collection,
    setSections,
    setCollection,
}) => {
    const options = tabData[activeTab]?.options || [];

    const handleCheckboxChange = (option: string) => {
        const updateSelectedOptions = (selected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
            setter(
                selected.includes(option)
                    ? selected.filter((o) => o !== option)
                    : [...selected, option]
            );
        };

        switch (activeTab) {
            case 0: // Sections tab
                updateSelectedOptions(sections, setSections);
                break;
            case 1: // Collection Type tab
                updateSelectedOptions(collection, setCollection);
                break;
            default:
                break;
        }
    };

    const selectedOptions = activeTab === 0 ? sections : collection;

    return (
        <Grid container spacing={2}>
            {options.map((option) => (
                <Grid item xs={6} sm={4} md={3} key={option}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                        }
                        label={option}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default TabCheckboxGroup;