export default async function handler(req, res) {
  // Use VITE_API_URL set in Vercel settings, fallback if undefined (shouldn't be)
  const apiUrl = process.env.VITE_API_URL;
  
  if (!apiUrl) {
    return res.status(500).json({ error: "VITE_API_URL environment variable is missing in Vercel" });
  }

  try {
    // This fetch runs on Vercel's backend, so no browser CORS issues!
    const fetchRes = await fetch(`${apiUrl}/api/jobs`, {
      headers: {
        'ngrok-skip-browser-warning': 'true' // Bypass ngrok warning page
      }
    });
    
    if (!fetchRes.ok) {
      throw new Error(`Upstream error: ${fetchRes.statusText}`);
    }

    const data = await fetchRes.json();
    
    // Set CORS headers for the response to the Vercel frontend just in case
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
