import { useState, useEffect } from "react";
import { pipeline } from "@xenova/transformers";

const TextClassifier = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classifier, setClassifier] = useState(null);

  useEffect(() => {
    const loadPipeline = async () => {
      setLoading(true);
      try {
        // Load a model available on Xenova hub for sentiment
        const pipe = await pipeline(
          "text-classification",
          "Xenova/distilbert-base-uncased-finetuned-sst2"
        );
        setClassifier(() => pipe); // store as callable
      } catch (err) {
        console.error("Failed to load pipeline:", err);
      }
      setLoading(false);
    };
    loadPipeline();
  }, []);

  const handleClassify = async () => {
    if (!classifier || !text) return;
    setLoading(true);
    try {
      const output = await classifier(text); // returns array of {label, score}
      setResult(output);
    } catch (err) {
      console.error("Classification failed:", err);
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", color: "white" }}>
      <h2>Test Text Classification</h2>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter some text..."
        style={{ width: "100%", padding: "0.5rem" }}
      />
      <button onClick={handleClassify} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Classifying..." : "Classify"}
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Results:</h3>
          {result.map((r, i) => (
            <p key={i}>
              Label: <strong>{r.label}</strong>, Score: {r.score.toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextClassifier;
