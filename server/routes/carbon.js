import express from 'express';
import CarbonReport from '../models/CarbonReport.js';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

// GET /api/carbon/latest - Get latest carbon report
router.get('/latest', async (req, res) => {
    try {
        let report = await CarbonReport.findOne().sort({ generatedAt: -1 });

        // If no data exists, create a default "pre-fed" report
        if (!report) {
            const defaultReport = new CarbonReport({
                totalCarbonFootprint: 4500,
                breakdown: {
                    mobility: 1500,
                    energy: 2000,
                    other: 1000
                },
                sustainabilityScore: 65,
                period: 'monthly'
            });
            report = await defaultReport.save();
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/carbon/simulate - Calculate Footprint
router.post('/simulate', async (req, res) => {
    const data = { ...req.body, type: 'carbon_simulate' };
    const scriptPath = path.join(process.cwd(), 'ai_model', 'predict.py');
    const pythonProcess = spawn('python3', [scriptPath]);

    let result = '';

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => { result += data.toString(); });

    pythonProcess.on('close', (code) => {
        if (code !== 0) return res.status(500).json({ message: 'Simulation failed' });
        try {
            res.json(JSON.parse(result));
        } catch (e) {
            res.status(500).json({ message: 'Invalid AI output' });
        }
    });
});

// POST /api/carbon - Save a generated report
router.post('/', async (req, res) => {
    try {
        const newReport = new CarbonReport(req.body);
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
