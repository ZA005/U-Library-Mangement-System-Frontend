import { useState, useEffect } from "react";
import { FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";

interface BaseEntity {
    id?: number;
    status: boolean;
}

interface EntitySelectProps<T extends BaseEntity> {
    label: string; // e.g., "Library Location" or "Library Section"
    entities: T[]; // List of entities
    selectedEntity: T | null; // Currently selected entity
    onEntityChange: (entity: T | null) => void; // Callback when selection changes
    onUpdateStatus: (id: number, status: boolean) => Promise<void>; // Callback to update status
    onAddNewEntity: () => void; // Callback to navigate to "add new" page
    showSnackbar: (message: string, severity: "success" | "error" | "warning") => void; // Snackbar callback
    valueField: keyof T; // Field to use as the select value (e.g., "codeName" or "sectionName")
    displayField: keyof T; // Field to display in the UI (e.g., "name" or "sectionName")
    disabled?: boolean;
}

const EntitySelect = <T extends BaseEntity>({
    label,
    entities,
    selectedEntity,
    onEntityChange,
    onUpdateStatus,
    onAddNewEntity,
    showSnackbar,
    valueField,
    displayField,
    disabled
}: EntitySelectProps<T>) => {
    const [localEntities, setLocalEntities] = useState<T[]>([]);


    useEffect(() => {
        if (Array.isArray(entities)) {
            setLocalEntities(entities);
        } else {
            console.error("Expected entities to be an array, but received:", entities);
        }
    }, [entities]);

    const handleSwitchChange = async (id: number | undefined, currentStatus: boolean) => {
        if (id === undefined) return; // Guard against undefined id
        const updatedEntity = localEntities.find((entity) => entity.id === id);
        if (updatedEntity) {
            const newStatus = !currentStatus;

            // Update local state immediately
            setLocalEntities((prevEntities) =>
                prevEntities.map((entity) =>
                    entity.id === id ? { ...entity, status: newStatus } : entity
                )
            );

            // If deactivating the selected entity, clear it
            if (!newStatus && selectedEntity?.id === updatedEntity.id) {
                onEntityChange(null);
            }

            try {
                // Update server status
                await onUpdateStatus(id, newStatus);
                showSnackbar(
                    `${label} ${updatedEntity[displayField]} is now ${newStatus ? "active" : "inactive"}`,
                    "success"
                );
            } catch {
                // Revert on error
                setLocalEntities((prevEntities) =>
                    prevEntities.map((entity) =>
                        entity.id === id ? { ...entity, status: currentStatus } : entity
                    )
                );
                showSnackbar(`Failed to update ${label.toLowerCase()} status`, "error");
            }
        }
    };

    return (
        <FormControl>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                value={selectedEntity ? String(selectedEntity[valueField]) : ""}
                onChange={(e) => {
                    const selected = localEntities.find(
                        (entity) => String(entity[valueField]) === e.target.value
                    );
                    if (selected) {
                        if (!selected.status) {
                            showSnackbar(`This ${label.toLowerCase()} is inactive and cannot be selected.`, "warning");
                        } else {
                            onEntityChange(selected);
                        }
                    }
                }}
                input={<OutlinedInput label={label} />}
                disabled={disabled}
                required
            >
                <MenuItem disabled value="">
                    <em>Please select a {label.toLowerCase()}</em>
                </MenuItem>
                {localEntities.map((entity) => (
                    <MenuItem
                        key={entity.id || String(entity[valueField])} // Fallback to valueField if id is undefined
                        value={String(entity[valueField])}
                        onClick={(e) => {
                            if (!entity.status) {
                                e.stopPropagation();
                            }
                        }}
                    >
                        <span>{String(entity[displayField])}</span>
                        {(!selectedEntity || String(selectedEntity[valueField]) !== String(entity[valueField])) && (
                            <div
                                style={{ marginLeft: "auto" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSwitchChange(entity.id, entity.status);
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={entity.status}
                                            color="primary"
                                            onChange={(e) => {
                                                e.stopPropagation();
                                            }}
                                        />
                                    }
                                    label={entity.status ? "Active" : "Inactive"}
                                    labelPlacement="start"
                                />
                            </div>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={onAddNewEntity} value="">
                    Add {label}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default EntitySelect;
