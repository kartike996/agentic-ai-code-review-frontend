import { useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
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

      <div className="editor-container">

        <Editor
          height="400px"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            roundedSelection: true,
            padding: {
              top: 15
            }
          }}
        />

      </div>

      <div className="button-container">

        <button onClick={analyzeCode}>
          Analyze Code
        </button>

        <button
          onClick={loadSampleCode}
        >
          Load Sample Code
        </button>

        <button
          onClick={analyzeLatestCommit}
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

        <>

          {review.gitCommitInfo && (

            <div className="commit-card">

              <h2>Latest Commit Details</h2>

              <p>
                <strong>Commit ID:</strong>
                {" "}
                {review.gitCommitInfo.commitId}
              </p>

              <p>
                <strong>Commit Message:</strong>
                {" "}
                {review.gitCommitInfo.commitMessage}
              </p>

              <div className="files-section">

                <strong>Changed Files:</strong>

                <ul>

                  {review.gitCommitInfo.changedFiles.map(
                    (file, index) => (

                      <li key={index}>
                        {file}
                      </li>
                    )
                  )}

                </ul>

              </div>

            </div>
          )}

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

        </>
      )}

    </div>
  );
}

export default App;