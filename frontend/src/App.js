import { useState } from "react";
import "./App.css";

const fieldLabels = {
  MedInc: "Median Income",
  HouseAge: "House Age",
  AveRooms: "Average Rooms",
  AveBedrms: "Average Bedrooms",
  Population: "Population",
  AveOccup: "Average Occupancy",
  Latitude: "Latitude",
  Longitude: "Longitude",
};

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
      "https://real-estate-fair-value-estimator.onrender.com/predict",
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
            <div className="input-group" key={field}>
              <label>
                {fieldLabels[field]}
              </label>

              <input
                name={field}
                type="number"
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
            <h2>Estimated Market Value</h2>

            <div className="price">
              $
              {(prediction * 100000).toLocaleString()}
            </div>

            <div className="diff">
              Difference: $
              {differenceAmount.toLocaleString()}
            </div>

            <h3>{analysis}</h3>
          </div>
        )}
      </div>
    </div>
  );
   
}

<footer>
  Built with React, FastAPI and Machine Learning
</footer>

export default App;