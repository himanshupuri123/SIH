function handleFinalSubmit(e) {

    e.preventDefault();

    // ==========================================
    // Validate current step
    // ==========================================

    const currentStepEl =
        document.querySelector(
            `.form-step[data-step="${currentStep}"]`
        );

    if (!currentStepEl) {
        console.error('Current form step not found.');
        return;
    }

    const inputs =
        currentStepEl.querySelectorAll(
            'input, select'
        );

    for (let input of inputs) {

        if (
            input.hasAttribute('required') &&
            !input.value.trim()
        ) {

            input.reportValidity();

            return;
        }
    }

    // ==========================================
    // Get buttons and feedback elements
    // ==========================================

    const submitBtn =
        document.getElementById('submitBtn');

    const feedback =
        document.getElementById('formFeedback');

    if (!submitBtn) {
        console.error('Submit button not found.');
        return;
    }

    // ==========================================
    // Disable button
    // ==========================================

    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    // ==========================================
    // Get form
    // ==========================================

    const formElement =
        document.getElementById('multiStepForm');

    if (!formElement) {

        console.error(
            'multiStepForm not found.'
        );

        submitBtn.innerText = 'Submit Form ✓';
        submitBtn.disabled = false;

        return;
    }

    // ==========================================
    // Convert FormData to JSON object
    // ==========================================

    const formData =
        new FormData(formElement);

    const dataObject =
        Object.fromEntries(
            formData.entries()
        );

    console.log(
        'Sending data:',
        dataObject
    );

    // ==========================================
    // Send request to Vercel backend
    // ==========================================

    fetch('https://icfai-sih.vercel.app/api/register', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(dataObject)

    })

    // ==========================================
    // Convert response to JSON
    // ==========================================

    .then(async response => {

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Registration failed.'
            );
        }

        return data;

    })

    // ==========================================
    // Success
    // ==========================================

    .then(data => {

        console.log(
            'Server response:',
            data
        );

        setTimeout(() => {

            submitBtn.classList.add('hidden');

            const prevBtn =
                document.getElementById(
                    'prevBtn'
                );

            if (prevBtn) {
                prevBtn.classList.add('hidden');
            }

            if (data.success) {

                feedback.innerHTML =
                    '🎉 Congratulations! Team registered successfully!';

                feedback.classList.remove(
                    'hidden'
                );

                setTimeout(() => {

                    const formContainer =
                        document.querySelector(
                            '.form-step'
                        )?.closest('form') ||
                        document.getElementById(
                            'multiStepForm'
                        );

                    if (formContainer) {
                        formContainer.style.display =
                            'none';
                    }

                }, 3000);

            } else {

                feedback.innerText =
                    '❌ ' +
                    (data.message ||
                        'Registration failed.');

                feedback.classList.remove(
                    'hidden'
                );

                submitBtn.innerText =
                    'Submit Form ✓';

                submitBtn.disabled = false;

            }

        }, 800);

    })

    // ==========================================
    // Error
    // ==========================================

    .catch(error => {

        console.error(
            'Registration Error:',
            error
        );

        setTimeout(() => {

            submitBtn.innerText =
                'Submit Form ✓';

            submitBtn.disabled = false;

            if (feedback) {

                feedback.innerText =
                    '❌ ' +
                    error.message;

                feedback.classList.remove(
                    'hidden'
                );

            } else {

                alert(
                    'Server connection failed. Please try again.'
                );

            }

        }, 800);

    });

}