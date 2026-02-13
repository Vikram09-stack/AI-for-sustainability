import mongoose from 'mongoose';

const MobilityLogSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // For now, can be a simple string or 'guest'
    timestamp: { type: Date, default: Date.now },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    transportMode: {
        type: String,
        enum: ['car', 'ev', 'metro', 'bus', 'shared'],
        required: true
    },
    distanceKm: { type: Number, required: true },
    carbonEmitted: { type: Number, required: true }, // in kg
    durationMinutes: { type: Number, required: true }
});

export default mongoose.model('MobilityLog', MobilityLogSchema);
