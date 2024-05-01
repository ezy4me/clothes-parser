const Figure = () => {
    const planes = 12;
    const spokes = 36;
  
    const renderPlanes = () => {
      return Array.from({ length: planes }).map((_, i) => (
        <div key={`plane-${i + 1}`} className={`plane plane-${i + 1}`}>
          {renderSpokes()}
        </div>
      ));
    };
  
    const renderSpokes = () => {
      return Array.from({ length: spokes }).map((_, j) => (
        <div key={`spoke-${j + 1}`} className={`spoke spoke-${j + 1}`}>
          <div className="dot"></div>
        </div>
      ));
    };
  
    return <div className="sphere-wrapper">{renderPlanes()}</div>;
  };

const Sphere = () => {
  return (
    <div className="main-wrapper">
      <Figure />
    </div>
  );
};

export default Sphere;
