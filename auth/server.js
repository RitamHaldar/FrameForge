import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { googleAuth } from "./src/config/passport.js";

googleAuth();
connectDB();

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})