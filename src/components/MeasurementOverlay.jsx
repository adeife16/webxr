import React from 'react';

function MeasurementOverlay({ isMeasuring }) {
    return (
        <div className="overlay">
            {isMeasuring ? (
                <p>Tap to place object and measure</p>
            ) : (
                <p>Measurement complete</p>
            )}
        </div>
    );
}

export default MeasurementOverlay;
