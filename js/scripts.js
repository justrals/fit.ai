document.addEventListener('DOMContentLoaded', (event) => {
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.getElementById('dropdownMenu');

    if (dropbtn && dropdownContent) {
        dropbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
        });
    }

    const form = document.getElementById('fitness-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    await generatePlan();
}

async function generatePlan() {
    const loader = document.getElementById('loader');
    const outputbox = document.getElementById('output-box');
    const submitButton = document.getElementById('submit');
    const outputElement = document.getElementById('output');

    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const sex = document.getElementById('sex').value;
    const language = document.getElementById('language').value;

    const prompt = `Generate a detailed fitness plan in ${language} language for a person with:
                    - Age: ${age}
                    - Weight: ${weight} kg
                    - Height: ${height} cm
                    - Sex: ${sex}

                    Include:
                    1. Weekly workout schedule
                    2. Recommended exercises
                    3. Nutrition guidelines
                    4. Rest days advice
                    5. Progress tracking tips

                    Format the response in clean HTML without html, head or body tags. Use only these HTML tags: h2, h3, p, ul, li, strong, em. Never include any commentary or notes.`;

    const data = {
        messages: [{
            role: "user",
            content: prompt
        }]
    };

    outputbox.classList.remove('error');
    outputElement.innerHTML = '';
    loader.classList.add('active');
    submitButton.disabled = true;

    try {
        const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const htmlContent = result.choices?.[0]?.message?.content;
        
        if (htmlContent) {
            outputElement.innerHTML = htmlContent;
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (error) {
        console.error("Error:", error);
        outputbox.classList.add('error');
        outputElement.innerHTML = `
            <div class="error-message">
                <p>Failed to generate fitness plan. Please try again.</p>
                <p class="small">Error: ${error.message}</p>
            </div>
        `;
    } finally {
        loader.classList.remove('active');
        submitButton.disabled = false;
    }
}