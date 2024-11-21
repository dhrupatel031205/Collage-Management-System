import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Card from "../Components/Card";
import Carousel from "../Components/Carousel";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data fetched successfully:", data);

      setFoodCat(data[1]); // Assuming data[1] is food categories
      setFoodItem(data[0]); // Assuming data[0] is food items
    } catch (error) {
      console.error("Error in loadData:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="main-container">
      <Navbar />
      <div className="content">
        <Carousel />
        <div>
          {error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : foodItem.length > 0 ? (
            foodCat.map((category) => {
              const filteredItems = foodItem.filter(
                (item) => item.CategoryName === category.CatagoryName
              );
              return (
                <div key={category._id} className="col mb-3">
                  <div className="fs-2 m-3">{category.CatagoryName}</div>
                  <hr />
                  {filteredItems.length > 0 ? (
                    <div>
                      {filteredItems.map((filteredItem) => (
                        <div
                          key={filteredItem._id}
                          className="col-12 col-md-6 col-lg-4"
                        >
                          <Card
                            foodName={filteredItem.name}
                            imgSrc={filteredItem.img}
                            description = {filteredItem.description}
                            options={filteredItem.options[0]}
                            prize={filteredItem.options[1]}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No items found for this category.</p>
                  )}
                </div>
              );
            })
          ) : (
            <p>Loading food items...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
