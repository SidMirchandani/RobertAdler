document.addEventListener('DOMContentLoaded', () => {
  // Select all book cards and popup elements
  const bookCards = document.querySelectorAll('.book-card');
  const popup = document.getElementById('book-popup');
  const popupTitle = document.getElementById('popup-book-title');
  const popupLink = document.getElementById('popup-link');
  const popupRating = document.getElementById('popup-rating');
  const popupUsername = document.getElementById('popup-username');
  const closeBtn = document.querySelector('.close-btn');

  let selectedRating = 0; // Track the selected rating

  // When a user clicks a book card, open the popup with that book's details.
  bookCards.forEach(card => {
    card.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default navigation

      // Retrieve the book's title and URL from data attributes.
      // If not provided, fallback to the card's textContent and href.
      const title = card.getAttribute('data-title') || card.textContent;
      const url = card.getAttribute('data-url') || card.getAttribute('href');

      // Set the popup content.
      popupTitle.textContent = title;
      popupLink.href = url;

      // Reset rating stars and username input.
      selectedRating = 0;
      popupRating.querySelectorAll('span').forEach(star => star.classList.remove('selected'));
      popupUsername.value = "";
      popupUsername.style.borderColor = "";

      // Show the popup (assuming your CSS shows it when the 'visible' class is added).
      popup.classList.add('visible');
    });
  });

  // Close the popup when the close button is clicked.
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('visible');
  });

  // Handle rating star clicks.
  popupRating.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
      // Validate the username: it must be exactly 7 digits.
      const username = popupUsername.value.trim();
      if (!/^\d{7}$/.test(username)) {
        popupUsername.style.borderColor = 'red';
        setTimeout(() => {
          popupUsername.style.borderColor = '';
        }, 500);
        return; // Stop further processing if validation fails.
      }

      // Get the star's value (assumed to be stored in data-value).
      const ratingValue = parseInt(event.target.getAttribute('data-value'), 10);
      selectedRating = ratingValue;

      // Update the star classes: add 'selected' for stars with a value less than or equal to the clicked value.
      popupRating.querySelectorAll('span').forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'), 10);
        if (starValue <= ratingValue) {
          star.classList.add('selected');
        } else {
          star.classList.remove('selected');
        }
      });

      // Send email with the rating and username.
      sendEmail(username, selectedRating, popupTitle.textContent);
      console.log(`Rated ${selectedRating} stars for "${popupTitle.textContent}" by ${username}`);
    }
  });

  // Function to send an email using EmailJS (or any email service of your choice).
  function sendEmail(username, rating, bookTitle) {
    emailjs.send("service_id", "template_id", {
      to_email: "mirchandanis28@mcmsnj.net",
      username: username,
      rating: rating,
      book_title: bookTitle,
    })
    .then(response => {
      console.log('Email sent successfully:', response);
    })
    .catch(error => {
      console.error('Error sending email:', error);
    });
  }
});
