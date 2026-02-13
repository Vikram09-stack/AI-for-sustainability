import mongoose from 'mongoose';

const EnergyUsageSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    sector: {
        type: String, // e.g., 'Residential', 'Commercial', 'Industrial', 'Public'
        required: true
    },
    loadType: {
        type: String, // e.g., 'Lighting', 'HVAC', 'Traffic', 'Machinery'
        required: true
    },
    consumption: {
        type: Number, // in kWh
        required: true
    },
    source: {
        type: String, // e.g., 'Grid', 'Solar', 'Wind'
        default: 'Grid'
    },
    region: {
        type: String, // e.g., 'North District'
        default: 'City Center'
    }
});

export default mongoose.model('EnergyUsage', EnergyUsageSchema);
