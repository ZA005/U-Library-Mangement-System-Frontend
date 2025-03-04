import React from 'react';

const Line: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#cc0000",
            width: "8vw",
            height: "1vw",
            marginTop: "10px",
            marginBottom: "25px"
        }}>
            <div style={{
                backgroundColor: "#cc0000",
                width: "35vw",
                height: "0.1vw",
            }}></div>
        </div>
    );
};

export default Line;