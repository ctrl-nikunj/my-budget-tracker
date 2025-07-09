import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const filePath = "C:/Users/goyal/Downloads/react/1751876313500.pdf";
if (!fs.existsSync(filePath)) {
  console.error("❌ File not found at path:", filePath);
  process.exit(1);
}

console.log("📂 Reading file from:", filePath);
const form = new FormData();
form.append("file", fs.createReadStream(filePath));

axios
  .post("http://localhost:5000/api/statement/parse", form, {
    headers: {
      ...form.getHeaders(),
      Cookie:
        "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1ZTE2MzQyLWVjNmMtNGVhZC1hMmVmLTIyZmE2NDBjOGI1ZiIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc1MTk2MTAyOCwiZXhwIjoxNzUxOTY0NjI4fQ.lIUN60Kw1ooN26Gi3FCrijxqSgieM9R4M3niYQkiBpI",
    },
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err.response?.data || err));
