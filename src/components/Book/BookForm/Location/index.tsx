
import React, { useState } from "react";
import { useFetchAllLibraryLocations } from "./useFetchLibraryLocations";
import { useNavigate } from "react-router-dom";
import { FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import { LibraryLocations } from "../../../../types/Catalog/LibraryLocation";
import { useUpdateLibraryLocationStatus } from "./useUpdateLibraryLocationStats";

interface LocationSeelctProps {
    selectedLocation: LibraryLocations | null;
    onLocationChange: (location: LibraryLocations | null) => void;
}
const LocationSelect: React.FC<LocationSeelctProps> = ({ selectedLocation, onLocationChange }) => {
    const { data: allLibraryLocations = [] } = useFetchAllLibraryLocations();
    const { updateStatus } = useUpdateLibraryLocationStatus();
    const [libraryLocations, setLibraryLocations] = useState<LibraryLocations[]>([]);
    const navigate = useNavigate();

    const handleSwitchChange = async (id: number, status: boolean) => {
        // Update the local state
        setLibraryLocations(libraryLocations.map(loc =>
            loc.id === id ? { ...loc, status: !status } : loc
        ));

        const updatedLoc = libraryLocations.find(loc => loc.id === id);
        if (!status && selectedLocation?.codeName === updatedLoc?.codeName) {
            onLocationChange(null); // Reset selection in parent
        }

        // Call the mutation to update the server
        updateStatus({ id, status: !status });
    };

    const handleAddNewLocation = () => {
        navigate("/add-location");
    };


    return (
        <FormControl >
            <InputLabel id="location-label">Library Location</InputLabel>
            <Select
                labelId="location-label"
                value={selectedLocation?.codeName || ""}
                onChange={(e) => {
                    const selectedLoc = allLibraryLocations.find(loc => loc.codeName === e.target.value);
                    if (selectedLoc) {
                        if (!selectedLoc.status) {
                            console.log("This location is inactive and cannot be selected.", "warning");
                        } else {
                            onLocationChange(selectedLoc);
                        }
                    }
                }}
                input={<OutlinedInput label="Library Location" />}
                onClose={() => { }}
                required
            >
                <MenuItem disabled value="">
                    <em>Please select a library location</em>
                </MenuItem>
                {allLibraryLocations.map((loc) => (
                    <MenuItem
                        key={loc.id}
                        value={loc.codeName}
                        onClick={() => {
                            if (!loc.status) {
                                console.log("This location is inactive and cannot be selected.");
                            }
                        }}
                    >
                        <span>{loc.name}</span>
                        {selectedLocation?.codeName !== loc.codeName && (
                            <div
                                style={{ marginLeft: "auto" }}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={loc.status}
                                            onChange={() => handleSwitchChange(loc.id!, loc.status)}
                                            color="primary"
                                        />
                                    }
                                    label={loc.status ? "Active" : "Inactive"}
                                    labelPlacement="start"
                                />
                            </div>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={handleAddNewLocation} value="">
                    Add Location
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default LocationSelect; 