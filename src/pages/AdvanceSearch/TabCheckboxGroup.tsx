import React from "react";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";

interface TabCheckboxGroupProps {
    activeTab: number;
    itemType: string[];
    sections: string[];
    collection: string[];
    setItemType: React.Dispatch<React.SetStateAction<string[]>>;
    setSections: React.Dispatch<React.SetStateAction<string[]>>;
    setCollection: React.Dispatch<React.SetStateAction<string[]>>;
}

const tabData = [
    {
        label: "Item type",
        options: ["Audio Visual", "BOOK"],
    },
    {
        label: "Sections",
        options: ["General Reference", "Circulation", "Periodicals", "Filipiniana", "Special Collection"],
    },
    {
        label: "Collection Type",
        options: ["Book", "Popular Magazines", "Newspapers", "Journals", "AV Materials", "Theses & Dissertation", "Special Collections", "Museum and Archival Materials"],
    },
];

const TabCheckboxGroup: React.FC<TabCheckboxGroupProps> = ({
    activeTab,
    itemType,
    sections,
    collection,
    setItemType,
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
            case 0: // Item Type tab
                updateSelectedOptions(itemType, setItemType);
                break;
            case 1: // Sections tab
                updateSelectedOptions(sections, setSections);
                break;
            case 2: // Collection Type tab
                updateSelectedOptions(collection, setCollection);
                break;
            default:
                break;
        }
    };

    const selectedOptions = activeTab === 0 ? itemType : activeTab === 1 ? sections : collection;

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
