import express from 'express';
import cors from 'cors';


function fetchDataWithXHR(url: string): Promise<unknown> {


  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            resolve(data)
          } catch (e) {
            console.error('Error parsing JSON:', e);
            reject(e)
          }
        } else {
          console.error(`HTTP error! status: ${xhr.status}, statusText: ${xhr.statusText}`);
        }
      }
    };

    xhr.onerror = function () {
      console.error('Network error during XHR request.');
    };

    xhr.open('GET', url);
    xhr.setRequestHeader('Cookie', 'csrftoken=VbiF4bH47CK4rpSTL35gmkBi2D94di5i');
    xhr.send();
  })
}


const app = express();
app.use(cors()); // Enable CORS for all routes
const port = process.env.PORT || 3006;


app.get('/webcoos/api/v1/webcoos/postgrest/*', async (req, res) => {
  // Data to be sent as JSON
  //console.log(req)
  //console.log(req.originalUrl)
  //console.log(process.env.VITE_PUBLIC_WEBCOOS_API_TOKEN)
  //const token = process.env.VITE_PUBLIC_WEBCOOS_API_TOKEN;
  //const token = '45e037502443df9805fba1e9da4db19359a3f3e9'
  const url = `https://app.stage.webcoos.org${req.originalUrl}`
  console.log(url)

  try {
    /* const result = await(await fetch(url, {
        headers: {
            Auth: `Token ${token}`
        }
    })).json();

    // Send the JSON response
    res.json(result); */
    const result = await fetchDataWithXHR(url);
    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});