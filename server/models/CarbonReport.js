import mongoose from 'mongoose';

const CarbonReportSchema = new mongoose.Schema({
    generatedAt: { type: Date, default: Date.now },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    totalCarbonFootprint: { type: Number, required: true }, // Total CO2 in kg
    breakdown: {
        mobility: { type: Number, default: 0 },
        energy: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    sustainabilityScore: { type: Number, min: 0, max: 100, default: 0 }
});

export default mongoose.model('CarbonReport', CarbonReportSchema);
