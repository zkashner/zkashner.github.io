function populatePapers(jsonList, containerID, addPeriodBeforeDate, isWorkingPaper) {
  const yourName = "Zane Kashner"; // Replace with your actual name

  const papersList = document.getElementById(containerID);
  if (!papersList) {
    console.error(`Container element with ID "${containerID}" not found`);
    return;
  }
  papersList.innerHTML = '';

  jsonList.forEach((paper) => {
    // Generate a unique ID for the paper
    paper.id = paper.title.replace(/\s+/g, '-').toLowerCase();

    // Filter out your own name from the authors list
    const coauthors = paper.authors.filter(author => author.name !== yourName);

    let authorsHTML = '';
    if (coauthors.length > 0) {
      const authorLinks = coauthors.map(author => `<a href="${author.link}" class="coauthor-name" target="_blank" rel="noopener noreferrer">${author.name}</a>`);

      if (coauthors.length === 1) {
        // One coauthor
        authorsHTML = `(with ${authorLinks[0]})`;
      } else if (coauthors.length === 2) {
        // Two coauthors, no comma before 'and'
        authorsHTML = `(with ${authorLinks[0]} and ${authorLinks[1]})`;
      } else {
        // Three or more coauthors, use Oxford comma
        const lastAuthor = authorLinks.pop();
        authorsHTML = `(with ${authorLinks.join(', ')}, and ${lastAuthor})`;
      }
    }

    // Build the HTML for each paper
    let html = `
      <p class="paper-title-container">
        ${paper.pdf 
          ? `<a href="${paper.pdf}" class="paper-title" target="_blank" rel="noopener noreferrer">"${paper.title}"</a>`
          : `<span class="paper-title">"${paper.title}"</span>`}
      </p>
    `;

    // Add authors if any
    if (authorsHTML) {
      html += `
        <p class="paper-authors">
          ${authorsHTML}
        </p>
      `;
    }

    // Add appended text if it exists
    if (paper.appendedText) {
      html += `
        <p class="paper-appended-text">
          ${paper.appendedText}
        </p>
      `;
    }

    // **Modify here: Only add date if isWorkingPaper is true**
    if (isWorkingPaper) {
      let dateText = paper.date;
      dateText = `Last updated: ${paper.date}`;
      html += `
        <p class="paper-date">
          ${dateText}
        </p>
      `;
    }

    // Build the links line
    let linksHTML = `[ <a href="#" data-id="${paper.id}" onclick="toggleAbstract('${paper.id}'); return false;">Abstract</a>`;

    if (paper.extraLinks) {
      paper.extraLinks.forEach(link => {
        linksHTML += ` | <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a>`;
      });
    }

    linksHTML += ' ]';

    // Add the links line to the HTML
    html += `
      <p class="paper-links">
        ${linksHTML}
      </p>
    `;

    // Add the abstract div
    html += `
      <div id="abstract-${paper.id}" class="abstract-content">
        <small>
          ${paper.abstract}
        </small>
        <br/><br/>
      </div>
    `;

    html += `<br/>`;

    papersList.innerHTML += html;
  });
}


function toggleAbstract(id) {
  const abstractDiv = document.getElementById(`abstract-${id}`);
  const isHidden = window.getComputedStyle(abstractDiv).display === 'none';
  abstractDiv.style.display = isHidden ? 'block' : 'none';
}

document.addEventListener("DOMContentLoaded", function() {
  fetch('wp.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(papers => {
      populatePapers(papers, 'papersList', false, true); // isWorkingPaper = true
    })
    .catch(error => {
      console.error("Fetch error for wp.json:", error);
    });

  fetch('wip.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(papers => {
      populatePapers(papers, 'wipList', true, false); // isWorkingPaper = false
    })
    .catch(error => {
      console.error("Fetch error for wip.json:", error);
    });


    fetch('otherPub.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(papers => {
      populatePapers(papers, 'otherPubsList', true, false); // isWorkingPaper = false
    })
    .catch(error => {
      console.error("Fetch error for otherPub.json:", error);
    });
});

