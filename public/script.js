// Frontend JavaScript
function savePhrase() {
    const phraseInput = document.getElementById('phraseInput').value;
    
    // Send the phrase to the server
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `phrase=${encodeURIComponent(phraseInput)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else if (response.status === 429) {
            console.error('Rate limit exceeded. Try again later.');
            // Display a message to the user indicating that the rate limit has been exceeded
        } else {
            console.log('Phrase saved successfully');
            document.getElementById('phraseInput').value = "";
            // Optionally, you can perform additional actions here
        }
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}


// Fetch phrases from backend server
fetch('/phrases')
    .then(response => response.json())
    .then(phrases => {
        // Get the container element where phrases will be displayed
        const phrasesContainer = document.getElementById('phrasesContainer');

        // Loop through each phrase and create a link element for it
        phrases.forEach(phrase => {
            // Create a new anchor element
            const link = document.createElement('a');
            
            // Set the href attribute to "/phrasename"
            link.href = `/${phrase.phrase}/${phrase.id}`; // Assuming you have an ID for each phrase

            // Set the inner text of the link to the phrase itself
            link.textContent = phrase.phrase;

            // Append the link to the container
            phrasesContainer.appendChild(link);

            // Add a line break after each link
            phrasesContainer.appendChild(document.createElement('br'));
        });
    })
    .catch(error => {
        console.error('Error fetching phrases:', error);
    });
