import express from 'express';
import CarbonReport from '../models/CarbonReport.js';
import { spawn } from 'child_process';
import path from 'path';
import { OpenAI } from 'openai';

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

// POST /api/carbon/suggestions - Get AI Suggestions
router.post('/suggestions', async (req, res) => {
    try {
        const { breakdown, totalCarbonFootprint, sustainabilityScore } = req.body;

        const client = new OpenAI({
            apiKey: process.env.ASI_API_KEY,
            baseURL: "https://inference.asicloud.cudos.org/v1"
        });

        const prompt = `
        Based on this user's carbon footprint data:
        - Total Annual Footprint: ${totalCarbonFootprint} kg CO2
        - Sustainability Score: ${sustainabilityScore}/100
        - Breakdown: Mobility (${breakdown.mobility} kg), Energy (${breakdown.energy} kg), Diet/Other (${breakdown.other} kg)

        Provide 3 specific, actionable suggestions to reduce their carbon footprint.
        Focus on the highest impacting areas.
        Format the response as a JSON array of objects with 'title', 'description', and 'impact' (High/Medium/Low) keys.
        Do not include markdown formatting or code blocks, just raw JSON.
        `;

        const response = await client.chat.completions.create({
            model: "asi1-mini",
            messages: [
                { role: "user", content: prompt }
            ]
        });

        const suggestionsText = response.choices[0].message.content;
        // Attempt to parse JSON from AI response, handling potential string wrapping
        let suggestions = [];
        try {
            // Remove markdown code blocks if present
            const cleanJson = suggestionsText.replace(/```json/g, '').replace(/```/g, '').trim();
            suggestions = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse AI suggestions:", e);
            // Fallback if parsing fails
            suggestions = [
                { title: "Review Mobility", description: "Consider switching to public transport or EV.", impact: "High" },
                { title: "Energy Audit", description: "Check your home insulation and appliances.", impact: "Medium" },
                { title: "Dietary Changes", description: "Trying a plant-based diet can reduce emissions.", impact: "Low" }
            ];
        }

        res.json(suggestions);

    } catch (error) {
        console.error("AI Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate suggestions" });
    }
});

export default router;
