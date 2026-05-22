import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [code, setCode] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {

    if (!code.trim()) {
      alert("Please enter Java code.");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:8080/api/review",
        {
          code: code
        }
      );

      setReview(response.data);

    } catch (error) {

      console.error(error);
      alert("Error analyzing code.");
    }

    setLoading(false);
  };

  const analyzeLatestCommit = async () => {

    setLoading(true);

    try {

      const response = await axios.get(
        "http://localhost:8080/api/review/latest-commit"
      );

      setReview(response.data);

    } catch (error) {

      console.error(error);
      alert("Error analyzing latest commit.");
    }

    setLoading(false);
  };

  const loadSampleCode = () => {

    const sample = `public class Test {

    String password = "admin123";

    public void login() {
        System.out.println(password);
    }
}`;

    setCode(sample);
  };

  return (

    <div className="container">

      <h1>Agentic AI Code Review System</h1>

      <p className="subtitle">
        Multi-Agent AI Powered Secure Code Review Platform
      </p>

      <textarea
        placeholder="Paste Java code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className="button-container">

        <button onClick={analyzeCode}>
          Analyze Code
        </button>

        <button
          onClick={loadSampleCode}
          style={{ marginLeft: "15px" }}
        >
          Load Sample Code
        </button>

        <button
          onClick={analyzeLatestCommit}
          style={{ marginLeft: "15px" }}
        >
          Analyze Latest Commit
        </button>

      </div>

      {loading && (
        <p className="loading">
          AI agents are reviewing the code...
        </p>
      )}

      {review && (

        <div className="reviews">

          <div className="card">
            <h2>Quality Review</h2>
            <pre>{review.qualityReview}</pre>
          </div>

          <div className="card">
            <h2>Security Review</h2>
            <pre>{review.securityReview}</pre>
          </div>

          <div className="card">
            <h2>Maintainability Review</h2>
            <pre>{review.maintainabilityReview}</pre>
          </div>

          <div className="card overall-card">
            <h2>Overall Assessment</h2>
            <pre>{review.overallReview}</pre>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;