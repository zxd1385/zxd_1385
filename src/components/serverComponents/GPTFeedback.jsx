import React, { useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";

export default function TextChecker() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  const checkText = async () => {
    const threshold = 0.6; // confidence threshold
    const model = await toxicity.load(threshold);
    const predictions = await model.classify([text]);
    setResults(predictions);
  };

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={checkText}>Check Text</button>
      <div>
        {results.map(pred => (
          <div key={pred.label}>
            {pred.label}: {pred.results[0].match ? "Flagged" : "Clean"}
          </div>
        ))}
      </div>
    </div>
  );
}
