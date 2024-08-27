const { default: axios } = require("axios");
const express = require("express");

const app = express();
const port = 8008;
app.use(express.json());

// Egress endpoint. For use when your enclave has egress enabled
app.get("/egress", async (req, res) => {
  try {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/posts/1",
    );
    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not send request out of enclave", err);
    res.status(500).send({ msg: "Error from within the enclave!" });
  }
});

// Compute endpoint. Adds two numbers together and returns the sum
app.all("/compute", async (req, res) => {
  try {
    result = parseInt(req.body.a) + parseInt(req.body.b);
    res.send({ sum: result });
  } catch (err) {
    console.log("Could not compute sum of a and b", err);
    res.status(500).send({ msg: "Error from within the enclave!" });
  }
});

// Encrypt endpoint. Calls out to the encrypt API in the enclave to encrypt the request body
app.all("/encrypt", async (req, res) => {
  try {
    const result = await axios.post("http://127.0.0.1:9999/encrypt", req.body);
    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not encrypt body", err);
    res.status(500).send({ msg: "Error from within the enclave!" });
  }
});

// Decrypt endpoint. Calls out to the decrypt API in the enclave to decrypt the request body
// This is for demo purposes - the enclave will automatically decrypt fields as they go into the enclave
app.all("/decrypt", async (req, res) => {
  try {
    const result = await axios.post("http://127.0.0.1:9999/decrypt", req.body);

    res.send({ ...result.data });
  } catch (err) {
    console.log("Could not decrypt body", err);
    res.status(500).send({ msg: "Error from within the enclave!" });
  }
});

let is_unhealthy = false;

app.get("/sad", (req, res) => {
  is_unhealthy = !is_unhealthy;
  return res.send(is_unhealthy ? "Sad" : "Happy");
});

app.get("/health", (req, res) => {
  // perform some healthcheck...
  //
  if (is_unhealthy) {
    return res.status(500).json({ status: "unhealthy" });
  }
  return res.send("OK");
});

// Simple hello world endpoint. Add a body and it will be returned in the response.
app.all("*", async (req, res) => {
  try {
    res.send({
      response: "Hello! I'm writing to you from within an enclave",
      ...req.body,
    });
  } catch (err) {
    console.log("Could not handle hello request", err);
    res.status(500).send({ msg: "Error from within the enclave!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
