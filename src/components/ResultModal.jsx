import React from 'react';

function ResultModal({ measurements, onClose }) {
    return (
        <div className="result-modal">
            <h2>Measured Dimensions (mm)</h2>
            <ul>
                <li>Length: {measurements.length}</li>
                <li>Width: {measurements.width}</li>
                <li>Thickness: {measurements.thickness}</li>
            </ul>
            <textarea
                readOnly
                value={JSON.stringify(measurements, null, 2)}
                rows={6}
                cols={30}
            />
            <button onClick={onClose}>Reset Measurement</button>
        </div>
    );
}

export default ResultModal;
