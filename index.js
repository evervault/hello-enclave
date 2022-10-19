const { default: axios } = require("axios");
const express = require("express");

const app = express();
const port = 8008;
app.use(express.json());


// SIMPLE HELLO WORLD ENDPOINT. ADD A BODY AND IT WILL BE RETURNED IN THE RESPONSE.
app.all("/hello", async (req, res) => {
  try {
    res.send({
      response: "Hello! I'm writing to you from within an enclave",
      ...req.body,
    });
  } catch (err) {
    console.log("Could not handle hello request", err);
    res.status(500).send({msg: "Error from within the cage!"})
  }
});

// EGRESS ENDPOINT. FOR USE WHEN YOUR CAGE HAS EGRESS ENABLED
app.get("/egress", async (req, res) => {
  try {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not send request out of enclave", err);
    res.status(500).send({msg: "Error from within the cage!"})
  }
});

// COMPUTE ENDPOINT. ENDPOINT TO ADD TWO NUMBERS TOGETHER
app.all("/compute", async (req, res) => {
  try {
    result = parseInt(req.body.a) + parseInt(req.body.b);
    res.send({ sum: result });
  } catch (err) {
    console.log("Could not compute sum of a and b", err);
    res.status(500).send({msg: "Error from within the cage!"})
  }
});

// ENCRYPT ENDPOINT. CALLS OUT TO THE ENCRYPT API IN THE CAGE TO ENCRYPT THE REQUEST BODY
app.all("/encrypt", async (req, res) => {
  try {
    const result = await axios.post("http://127.0.0.1:9999/encrypt", req.body, {
      headers: {
        "api-key": req.headers["api-key"],
      },
    });
    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not encrypt body", err);
    res.status(500).send({msg: "Error from within the cage!"})
  }
});

// DECRYPT ENDPOINT. CALLS OUT TO THE DECRYPT API IN THE CAGE TO DECRYPT THE REQUEST BODY
app.all("/decrypt", async (req, res) => {
  try {
    const result = await axios.post("http://127.0.0.1:9999/decrypt", req.body, {
      headers: {
        "api-key": req.headers["api-key"],
      },
    });

    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not decrypt body", err);
    res.status(500).send({msg: "Error from within the cage!"})
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
