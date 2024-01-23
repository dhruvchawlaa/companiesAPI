/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Dhruv Chawla Student ID: 158310219 Date: 01/24/24
*  Cyclic Link: 
*
********************************************************************************/ 


const express = require("express");
const cors = require("cors");
require("dotenv").config();
const CompaniesDB = require("./modules/companiesDB.js");

const app = express();
const db = new CompaniesDB();
const HTTP_PORT = 3000;

app.use(express.json());
app.use(cors());

// Define a simple GET route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// POST /api/companies
app.post("/api/companies", async (req, res) => {
  try {
    const newCompany = await db.addNewCompany(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add a new company." });
  }
});

// GET /api/companies
app.get("/api/companies", async (req, res) => {
  const { page, perPage, name } = req.query;
  try {
    const companies = await db.getAllCompanies(page, perPage, name);
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve companies." });
  }
});

// GET /api/company/:id
app.get("/api/company/:id", async (req, res) => {
  const companyId = req.params.id;
  try {
    const company = await db.getCompanyById(companyId);
    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ error: "Company not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the company." });
  }
});

// PUT /api/company/:id
app.put("/api/company/:id", async (req, res) => {
  const companyId = req.params.id;
  try {
    const updatedCompany = await db.updateCompanyById(req.body, companyId);
    if (updatedCompany) {
      res.status(200).json(updatedCompany);
    } else {
      res.status(404).json({ error: "Company not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the company." });
  }
});

// DELETE /api/company/:id
app.delete("/api/company/:id", async (req, res) => {
  const companyId = req.params.id;
  try {
    const result = await db.deleteCompanyById(companyId);
    if (result.deletedCount > 0) {
      res.status(204).send(); // No content for success
    } else {
      res.status(404).json({ error: "Company not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the company." });
  }
});

// Start the server
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
