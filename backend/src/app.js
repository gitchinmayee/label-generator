'use strict';
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const History = require('./models/History');
const { parseExcel } = require('./services/excelParser');
const { generatePDF } = require('./services/pdfGenerator');

const app = express(); 
const upload = multer({ storage: multer.memoryStorage() });

// CRITICAL: Must be before routes to fix "Cannot connect to server"
app.use(cors()); 
app.use(express.json());

// --- AUTH ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@minilec.com" && password === "admin") {
        res.json({ success: true, user: { name: "Admin", email } });
    } else {
        res.status(401).json({ error: "Invalid Credentials" });
    }
});

// --- HISTORY ---
app.get('/history', async (req, res) => {
    try {
        const logs = await History.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { res.status(500).send("Error fetching history"); }
});

app.delete('/history/:id', async (req, res) => {
    try {
        await History.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).send("Error deleting"); }
});

// --- GENERATION ---
app.post('/preview', upload.single('file'), async (req, res) => {
    try {
        const { bigCount, smallCount } = req.body;
        const rawData = parseExcel(req.file.buffer);
        const bC = parseInt(bigCount) || 0;
        const sC = parseInt(smallCount) || 0;
        const formattedRows = rawData.slice(0, bC + sC).map((row, i) => ({
            ...row, size: i < bC ? 'big' : 'small'
        }));
        res.json(formattedRows);
    } catch (err) { res.status(500).json({ error: "Preview failed" }); }
});

app.post('/generate-pdf', upload.single('file'), async (req, res) => {
    try {
        const { oa, bigCount, smallCount, instructions, userName, approverName } = req.body;
        await History.create({
            date: new Date(),
            oaNumber: oa || "N/A",
            legendsInfo: instructions || "N/A",
            approvedBy: approverName || "Girish Vaidya",
            createdBy: userName || "Admin"
        });
        const rawData = parseExcel(req.file.buffer);
        const formattedRows = rawData.slice(0, (parseInt(bigCount) + parseInt(smallCount))).map((row, i) => ({
            ...row, size: i < parseInt(bigCount) ? 'big' : 'small'
        }));
        const pdfBuf = await generatePDF(formattedRows, { oa, footerText: instructions });
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuf);
    } catch (err) { res.status(500).send(err.message); }
});

const path = require('path');

// Move up two levels from backend/src to find frontend at the root
app.use(express.static(path.join(__dirname, '../../frontend')));

// Serve the index.html file for any route not caught by our API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = app;