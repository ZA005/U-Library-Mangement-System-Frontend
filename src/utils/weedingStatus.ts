export const statusToDisplay = (status: string) => {
    switch (status) {
        case 'REVIEWED':
            return { text: 'Reviewed', color: '#3f51b5', icon: '📋' };
        case 'KEPT':
            return { text: 'Kept', color: '#4caf50', icon: '✅' };
        case 'WEEDED':
            return { text: 'Weeded', color: '#f44336', icon: '🗑️' };
        case 'ARCHIVED':
            return { text: 'Archived', color: '#795548', icon: '📦' };
        case 'FLAGGED':
            return { text: 'Flagged', color: '#ff9800', icon: '🚩' };
        default:
            return null;
    }
};
