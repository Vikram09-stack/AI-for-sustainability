import express from 'express';
import MobilityLog from '../models/MobilityLog.js';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

// GET /api/mobility - Get all mobility logs
router.get('/', async (req, res) => {
    try {
        const logs = await MobilityLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/mobility/calculate - Calculate Trip CO2
router.post('/calculate', async (req, res) => {
    console.log("Received calculation request:", req.body);
    const data = { ...req.body, type: 'mobility' };
    const scriptPath = path.join(process.cwd(), 'ai_model', 'predict.py'); // Check if this path is correct relative to where node is running
    console.log("Script path:", scriptPath);

    const pythonProcess = spawn('python3', [scriptPath]);

    let result = '';
    let errorOutput = '';

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        console.log("Python stdout:", data.toString());
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error("Python stderr:", data.toString());
        errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log("Python process exited with code:", code);
        if (code !== 0) {
            console.error("Calculation failed. Stderr:", errorOutput);
            return res.status(500).json({ message: 'Calculation failed', error: errorOutput });
        }
        try {
            const parsed = JSON.parse(result);
            console.log("Parsed result:", parsed);
            res.json(parsed);
        } catch (e) {
            console.error("JSON parse error:", e, "Raw result:", result);
            res.status(500).json({ message: 'Invalid AI output', raw: result });
        }
    });
});

// POST /api/mobility - Log a new trip
router.post('/', async (req, res) => {
    try {
        const newLog = new MobilityLog(req.body);
        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
