import React from 'react';
import LineStyle from './line.module.css';

const Line: React.FC = () => {
    return (
        <div className={ LineStyle.rectangle}>
            <div className={ LineStyle.line }></div>
        </div>
    );
};

export default Line;