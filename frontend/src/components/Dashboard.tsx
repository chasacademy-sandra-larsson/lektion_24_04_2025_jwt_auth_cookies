import { useEffect, useState } from "react";

export const Dashboard = () => {

  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchData = async () => {
      // /dashboard är en protected route som kräven en cookie JWT-token
      const response = await fetch("http://localhost:3000/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
      } else {
        setMessage("Inloggning misslyckades");
      }
    };
    fetchData();
  }, []);


  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};