import axios from "axios";
import redis from "redis";
const redisClient = redis.createClient();

// Connect to Redis and handle connection
(async () => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
  });
  redisClient.on("connect", () => {
    console.log("Redis Connected!");
  });
  await redisClient.connect();
})();

export const getWether = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: "City is required" });

    const cachedData = await redisClient.get(`weather:${city}`);

    // If we have cached data, return it
    if (cachedData) {
      console.log("Getting data from Redis cache");
      return res.status(200).json(cachedData);
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`
    );

    if (!response) return res.status(404).json({ message: "City not found" });

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      timestamp: new Date(),
    };
    // Store the new data in Redis
    // 'EX' means expire - here data will expire in 1800 seconds (30 minutes)
    await redisClient.setEx(
      `weather:${city}`,
      1800,
      JSON.stringify(weatherData)
    );
    res.status(200).json(weatherData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
