const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://himanshupuri527_db_user:HvCVj8QQUDUth8MC@cluster0.nwoumh3.mongodb.net/sih2026DB?retryWrites=true&w=majority', {
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB Connected Successfully for SIH 2026!'))
.catch((err) => console.log('Database Connection Error: ', err));

// Mongoose Schema for Team Registration
const teamSchema = new mongoose.Schema({
    // Team Leader
    leaderName: String,
    leaderBranch: String,
    leaderYear: String,
    leaderEmail: { type: String, unique: true },
    teamName: { type: String, unique: true },
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

    registeredAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

// Register API Route
app.post('/api/register', async (req, res) => {
    try {
        const formData = req.body;

        // Check if Team Name or Leader Email already exists
        const existingTeam = await Team.findOne({ 
            $or: [{ teamName: formData.teamName }, { leaderEmail: formData.leaderEmail }] 
        });

        if (existingTeam) {
            return res.status(400).json({ success: false, message: 'Team Name or Leader Email already registered!' });
        }

        // Save new team data
        const newTeam = new Team(formData);
        await newTeam.save();

        res.status(201).json({ success: true, message: 'Team registered successfully in MongoDB!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Start Server (Conditional for Local vs Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export app for Vercel Serverless Deployment
module.exports = app;

function handleFinalSubmit(e) {
    e.preventDefault();
    
    // Validate last step (Step 6) inputs before submission
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepEl.querySelectorAll('input, select');
    for (let input of inputs) {
        if (input.hasAttribute('required') && !input.value) {
            input.reportValidity();
            return;
        }
    }

    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    // Collect all form data using FormData API
    const formElement = document.getElementById('multiStepForm');
    const formData = new FormData(formElement);
    const dataObject = Object.fromEntries(formData.entries());

    // Send data to Backend Server using absolute Vercel live URL
  // script.js ke andar fetch request ko yeh karein:
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObject)
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            submitBtn.classList.add('hidden');
            document.getElementById('prevBtn').classList.add('hidden');
            
            if (data.success) {
                feedback.innerHTML = '🎉 **Congratulations! Team registered successfully!**';
                feedback.classList.remove('hidden');
                
                setTimeout(() => {
                    const formContainer = document.querySelector('.form-step').closest('form') || document.getElementById('multiStepForm');
                    if (formContainer) {
                        formContainer.style.display = 'none';
                    }
                }, 3000);

            } else {
                feedback.innerText = '❌ ' + data.message;
                feedback.classList.remove('hidden', 'bg-green-500/20', 'border-green-500/40', 'text-green-300');
                feedback.classList.add('bg-red-500/20', 'border-red-500/40', 'text-red-300');
                submitBtn.innerText = 'Submit Form ✓';
                submitBtn.disabled = false;
            }
        }, 800);
    })
    .catch(error => {
        console.error('Error:', error);
        setTimeout(() => {
            submitBtn.innerText = 'Submit Form ✓';
            submitBtn.disabled = false;
            alert('Server connection failed! Make sure your Node.js server is running.');
        }, 800);
    });
}