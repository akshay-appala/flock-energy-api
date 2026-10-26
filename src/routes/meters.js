const express = require("express");

const {
  getMeterGeo,
  getMeterEnergy,
  searchMeters,
} = require("../services/urjaClient");

const router = express.Router();

// Search meters
router.get("/", async (req, res) => {
  try {
    const { q, page } = req.query;

    const data = await searchMeters(q || "", page || 1);

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to search meters",
    });
  }
});

// Get meter location
router.get("/:meterId/geo", async (req, res) => {
  try {
    const { meterId } = req.params;

    const data = await getMeterGeo(meterId);

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch meter location",
    });
  }
});

// Get meter energy readings
router.get("/:meterId/energy", async (req, res) => {
  try {
    const { meterId } = req.params;

    const data = await getMeterEnergy(meterId);

    res.json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: "error",
      message: "Failed to fetch meter energy readings",
    });
  }
});

module.exports = router;
