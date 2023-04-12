const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();

app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  const response = await axios.get(url, {
    responseType: 'stream',
  });

  const data = new FormData();
  data.append('input_file', response.data);
  data.append('language', 'english');

  const options = {
    method: 'POST',
    url: 'https://text-analysis12.p.rapidapi.com/text-mining/api/v1.1',
    headers: {
      'X-RapidAPI-Key': 'cf62aa4b8dmsh166691f755f1ec3p10e380jsn621d61d23c13',
      'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com',
      ...data.getHeaders(),
    },
    data,
  };

  try {
    const analysisResponse = await axios.request(options);
    ///console.log(analysisResponse.data.text);
   // res.send(analysisResponse.data);
   // console.log(text);
   var objData = {
    language:"english",
    summary_percent:10,
    text: analysisResponse.data.text
   }

    const options1 =  {
    method: 'POST',
    url: 'https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1',
    headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'cf62aa4b8dmsh166691f755f1ec3p10e380jsn621d61d23c13',
        'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
    },
    data: JSON.stringify(objData)
    };
    console.log(options1.data);
    try{
        let response = await axios.request(options1)
        console.log(response.data);
        res.send(response.data);
        console.log(response.data);
    }catch( error) {
        res.status(500).send('Error analyzing text');    
        console.error(error);
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Error analyzing text');
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
