import "dotenv/config"
import app from "./app"

const PORT: number = Number(process.env.PORT) || 3002;

app.listen(PORT, () => {
    console.log(`Ingestion service is running on http://localhost:${PORT}`)
}).on("error", (err: Error) => {
    console.error("Ingestion service failed to start:", err)
    process.exit(1)
});
