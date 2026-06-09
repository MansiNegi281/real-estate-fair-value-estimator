import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    MedInc: "",
    HouseAge: "",
    AveRooms: "",
    AveBedrms: "",
    Population: "",
    AveOccup: "",
    Latitude: "",
    Longitude: "",
  });

  const [listingPrice, setListingPrice] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [differenceAmount, setDifferenceAmount] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://127.0.0.1:8000/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    const predictedPrice = data.predicted_price;

    setPrediction(predictedPrice);

    const predictedValue = predictedPrice * 100000;

    setDifferenceAmount(
      listingPrice - predictedValue
    );

    const difference =
      ((listingPrice - predictedValue) /
        predictedValue) *
      100;

    if (difference > 10) {
      setAnalysis(
        `Overpriced by ${difference.toFixed(2)}%`
      );
    } else if (difference < -10) {
      setAnalysis(
        `Underpriced by ${Math.abs(
          difference
        ).toFixed(2)}%`
      );
    } else {
      setAnalysis("Fairly Priced");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Real Estate Fair Value Estimator</h1>

        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <input
                name={field}
                placeholder={field}
                onChange={handleChange}
              />
            </div>
          ))}

          <br />

          <div>
            <input
              type="number"
              placeholder="Listing Price ($)"
              value={listingPrice}
              onChange={(e) =>
                setListingPrice(Number(e.target.value))
              }
            />
          </div>

          <br />

          <button type="submit">
            Predict
          </button>
        </form>

        {prediction && (
          <div className="result">
            <h2>
              Estimated Value: $
              {(prediction * 100000).toLocaleString()}
            </h2>

            <p>
              Difference: $
              {differenceAmount.toLocaleString()}
            </p>

            <h3
              className={
                analysis.includes("Overpriced")
                  ? "overpriced"
                  : analysis.includes("Underpriced")
                  ? "underpriced"
                  : "fair"
              }
            >
              {analysis}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
   
}

export default App;