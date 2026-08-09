const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// MONGODB CONNECTION
// =====================================================

const MONGODB_URI =
    'mongodb+srv://himanshupuri_db_user:YOUR_PASSWORD@cluster0.nwoumh3.mongodb.net/sih2026DB?retryWrites=true&w=majority';

let mongoConnectionPromise = null;

async function connectMongoDB() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!mongoConnectionPromise) {

        mongoConnectionPromise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

    }

    try {

        await mongoConnectionPromise;

        console.log('MongoDB Connected Successfully!');

    } catch (error) {

        mongoConnectionPromise = null;

        console.error(
            'MongoDB Connection Error:',
            error.message
        );

        throw error;
    }
}

// =====================================================
// TEAM SCHEMA
// =====================================================

const teamSchema = new mongoose.Schema({

    // Team Leader
    leaderName: String,
    leaderBranch: String,
    leaderYear: String,

    leaderEmail: {
        type: String,
        unique: true
    },

    teamName: {
        type: String,
        unique: true
    },

    leaderContact: String,
    leaderGender: String,

    // Member 1
    member1Name: String,
    member1Branch: String,
    member1Year: String,
    member1Email: String,
    member1Contact: String,
    member1Gender: String,

    // Member 2
    member2Name: String,
    member2Branch: String,
    member2Year: String,
    member2Email: String,
    member2Contact: String,
    member2Gender: String,

    // Member 3
    member3Name: String,
    member3Branch: String,
    member3Year: String,
    member3Email: String,
    member3Contact: String,
    member3Gender: String,

    // Member 4
    member4Name: String,
    member4Branch: String,
    member4Year: String,
    member4Email: String,
    member4Contact: String,
    member4Gender: String,

    // Member 5
    member5Name: String,
    member5Branch: String,
    member5Year: String,
    member5Email: String,
    member5Contact: String,
    member5Gender: String,

    // Registration Date
    registeredAt: {
        type: Date,
        default: Date.now
    }

});

// =====================================================
// MODEL
// =====================================================

const Team = mongoose.model('Team', teamSchema);

// =====================================================
// TEST ROUTE
// =====================================================

app.get('/api/test', async (req, res) => {

    try {

        await connectMongoDB();

        res.status(200).json({
            success: true,
            message: 'Node.js + Express + MongoDB server is running!'
        });

    } catch (error) {

        console.error('Test API Error:', error);

        res.status(500).json({
            success: false,
            message: 'MongoDB connection failed',
            error: error.message
        });

    }

});

// =====================================================
// REGISTER TEAM API
// =====================================================

app.post('/api/register', async (req, res) => {

    try {

        await connectMongoDB();

        const formData = req.body;

        console.log('Received Team Data:', formData);

        // Check existing team
        const existingTeam = await Team.findOne({
            $or: [
                {
                    teamName: formData.teamName
                },
                {
                    leaderEmail: formData.leaderEmail
                }
            ]
        });

        if (existingTeam) {

            return res.status(400).json({
                success: false,
                message:
                    'Team Name or Leader Email already registered!'
            });

        }

        // Create team
        const newTeam = new Team(formData);

        // Save team
        await newTeam.save();

        console.log('Team saved successfully!');

        res.status(201).json({
            success: true,
            message:
                'Team registered successfully in MongoDB!'
        });

    } catch (error) {

        console.error(
            'Registration Error:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });

    }

});

// =====================================================
// LOCAL DEVELOPMENT
// =====================================================

if (process.env.NODE_ENV !== 'production') {

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(
            `Server is running on http://localhost:${PORT}`
        );

    });

}

// =====================================================
// EXPORT FOR VERCEL
// =====================================================

module.exports = app;