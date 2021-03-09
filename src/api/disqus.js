import axios from 'axios';

const API_SECRET = '7wf9yC6qL4b5yC01hQ1CSqc00CEuaFwb917GVUFYtKAH8dWmcgvHc78VQMdmlyQU';
const API_KEY = '89OiQyz3iEwN9TP80TcP2J7n8uSmItxVDfpzBDHN25t3pY0nfVld4qva7OPBEf2R';

const disqus = async ({ method = 'GET', route, params }) =>
  axios(`https://disqus.com/api/3.0/${route}.json`, {
    method,
    params: {
      api_key: API_KEY,
      api_secret: API_SECRET,
      ...params,
    },
  })
    .then(res => res)
    .catch(err => console.log(err));

export default disqus;
