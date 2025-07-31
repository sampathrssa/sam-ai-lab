const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const configuration = new Configuration({
  apiKey: functions.config().openai.key
});
const openai = new OpenAIApi(configuration);

app.post("/process", async (req, res) => {
  const text = req.body.text;

  const completion = await openai.createChatCompletion({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You're a mind map assistant. Extract key ideas from spoken input and organize them into Mermaid.js mind map syntax. Use 'graph TD' format."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  const mindmap = completion.data.choices[0].message.content;
  res.json({ mindmap });
});

exports.api = functions.https.onRequest(app);