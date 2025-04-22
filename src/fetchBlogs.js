import axios from "axios";

const fetchBlogs = async () => {
  const API_KEY = "e40f38c405f74cedbcabe84ef9599f37"; 
  const URL = `https://newsapi.org/v2/top-headlines?category=entertainment&country=us&pageSize=5&apiKey=${API_KEY}`;

  try {
    const response = await axios.get(URL);
    console.log("Fetched Articles:", response.data.articles);
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching blogs", error);
    return [];
  }
};

export default fetchBlogs;
