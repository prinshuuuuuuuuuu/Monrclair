async function test() {
  try {
    const res = await fetch('http://localhost:5005/api/categories');
    const data = await res.json();
    console.log("Categories API Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("API Error:", err.message);
  }
}
test();
