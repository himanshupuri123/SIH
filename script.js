function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

function updateCountdown() {
    const targetDate = new Date("September 15, 2026 23:59:59").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? '0' + days : days;
        document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

function openModal() {
    document.getElementById('posterModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('posterModal').classList.add('hidden');
}

// Multi-Step Form Logic
let currentStep = 1;
const totalSteps = 6;

const stepTitles = {
    1: { title: "Step 1: Team Leader Details", subtitle: "Provide team leader and team name details." },
    2: { title: "Step 2: First Team Member Registration", subtitle: "Provide details for the first team member." },
    3: { title: "Step 3: Second Team Member Registration", subtitle: "Provide details for the second team member." },
    4: { title: "Step 4: Third Team Member Registration", subtitle: "Provide details for the third team member." },
    5: { title: "Step 5: Fourth Team Member Registration", subtitle: "Provide details for the fourth team member." },
    6: { title: "Step 6: Fifth Team Member Registration", subtitle: "Provide details for the fifth team member." }
};

function changeStep(direction) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    
    // Simple validation check before going forward
    if (direction === 1) {
        const inputs = currentStepEl.querySelectorAll('input, select');
        for (let input of inputs) {
            if (input.hasAttribute('required') && !input.value) {
                input.reportValidity();
                return;
            }
        }
    }

    currentStep += direction;

    if (currentStep < 1) currentStep = 1;
    if (currentStep > totalSteps) currentStep = totalSteps;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => step.classList.add('hidden'));
    
    // Show target step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('hidden');

    // Update Header Information
    document.getElementById('formStepTitle').innerText = stepTitles[currentStep].title;
    document.getElementById('formStepSubtitle').innerText = stepTitles[currentStep].subtitle;
    document.getElementById('stepBadge').innerText = `Step ${currentStep} of ${totalSteps}`;

    // Toggle Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (currentStep === 1) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    // Scroll slightly to the form top smoothly
    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}

function handleFinalSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.classList.add('hidden');
        document.getElementById('prevBtn').classList.add('hidden');
        feedback.classList.remove('hidden');
    }, 800);
}





