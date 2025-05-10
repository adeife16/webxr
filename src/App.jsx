import React, { useState } from 'react';
import ARScene from './components/ARScene';
import MeasurementOverlay from './components/MeasurementOverlay';
import ResultModal from './components/ResultModal';
import './styles.css';

function App() {
  const [measurements, setMeasurements] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(true);

  return (
    <div className="app-container">
      <ARScene
        isMeasuring={isMeasuring}
        onMeasurementComplete={(data) => {
          setMeasurements(data);
          setIsMeasuring(false);
        }}
      />
      <MeasurementOverlay isMeasuring={isMeasuring} />
      {measurements && (
        <ResultModal
          measurements={measurements}
          onClose={() => {
            setMeasurements(null);
            setIsMeasuring(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
