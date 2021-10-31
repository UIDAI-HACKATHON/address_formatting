const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

function validValue(value, arr) {
  value = value.split(" ").join("");
  if (arr.includes(value)) return false;
  if (value === "") return false;
  if (value === "null") return false;
  return true;
}

function notavailable(value, building) {
  building = building.split(" ").join("");
  if (value !== building && building.indexOf(value) > -1) {
    return false;
  }
  return true;
}

function formateAddress(arr) {
  let newArr = arr.map((value) => value.toLowerCase());
  let result = [];
  for (let i = newArr.length - 1; i > -1; i--) {
    if (validValue(newArr[i], result) && notavailable(newArr[i], newArr[0])) {
      result.push(newArr[i]);
    } else {
      result.push(null);
    }
  }
  result = result.reverse();
  return result;
}

app.post("/v1/api/rm-repetition", (req, res, next) => {
  const result = formateAddress(Object.values(req.body)).filter(
    (elem) => elem !== null
  );
  res.json({ address: result.join(", ") }); //
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("app listening at port", PORT);
});
