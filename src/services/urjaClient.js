const axios = require("axios");

const urjaClient = axios.create({
  baseURL: "https://urja-ops.flockenergy.tech",
  timeout: 15000,
  headers: {
    Cookie: process.env.URJA_SESSION_COOKIE,
  },
});

async function getMeterGeo(meterId) {
  const response = await urjaClient.get(`/portal/meters/${meterId}/geo`);

  return response.data;
}

async function getMeterEnergy(meterId) {
  const response = await urjaClient.get(`/portal/meters/${meterId}/energy`);

  return response.data;
}

async function searchMeters(query, page) {
  const response = await urjaClient.get("/portal/meters/search", {
    params: {
      q: query,
      page: page,
    },
  });

  return response.data;
}

async function getMeterDetails(meterId) {
  const response = await urjaClient.get(
    `/meters/${meterId}/__data.json`,
    {
      params: {
        "x-sveltekit-invalidated": "001",
      },
    }
  );

  return response.data;
}

module.exports = {
  getMeterGeo,
  getMeterEnergy,
  searchMeters,
  getMeterDetails,
};
