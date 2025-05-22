import express from 'express';
import userRoutes from "./routes/userRoute" // pastikan path bener ya
import studioRoutes from "./routes/studioRoute"
import bookingRoutes from"./routes/bookingRoute"
import reportRoutes from "./routes/reportRoute"

const app = express();

app.use(express.json());

app.use('/users', userRoutes); // semua route users di sini
app.use('/studio',studioRoutes)
app.use('/booking',bookingRoutes)
app.use(`/report`,reportRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});