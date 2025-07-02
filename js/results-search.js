document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const examTypeSelect = document.getElementById('examType');
    const studentNameInput = document.getElementById('studentName');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    
    // CSV data will be stored here after loading
    let resultsData = [];
    
    // Load the CSV file
    loadCSVData();
    
    // Add event listener to search button
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Add event listener for Enter key on input field
    if (studentNameInput) {
        studentNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Function to load CSV data
    function loadCSVData() {
        fetch('../upload/clean-GCE-result-2024.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Parse CSV data
                resultsData = parseCSV(data);
                console.log('CSV data loaded successfully');
            })
            .catch(error => {
                console.error('Error loading CSV data:', error);
                // Show error message in results area
                if (searchResults) {
                    searchResults.innerHTML = `
                        <div class="no-result">
                            <p>Error loading results data. Please try again later.</p>
                        </div>
                    `;
                }
            });
    }
    
    // Function to parse CSV data
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const results = [];
        
        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                // Check if line contains student name (typically in format "(number) NAME")
                const nameMatch = line.match(/\(\d+\)\s+(.*)/);
                if (nameMatch) {
                    const studentName = nameMatch[1].trim();
                    
                    // Look for subject results in subsequent lines
                    const subjects = [];
                    let j = i + 1;
                    while (j < lines.length && !lines[j].match(/\(\d+\)\s+/) && !lines[j].includes('Passed in')) {
                        // If we find subject data, add it
                        const subjectMatch = lines[j].match(/([A-Z]+)\s+(\d+)/);
                        if (subjectMatch) {
                            subjects.push({
                                subject: subjectMatch[1],
                                grade: subjectMatch[2]
                            });
                        }
                        j++;
                    }
                    
                    // If we found a student with subjects, add to results
                    if (subjects.length > 0) {
                        results.push({
                            name: studentName,
                            subjects: subjects,
                            examType: 'gce-a' // Default to GCE A Level since that's what the sample data is
                        });
                    } else {
                        // Just add the student name if no subjects found
                        results.push({
                            name: studentName,
                            subjects: [],
                            examType: 'gce-a'
                        });
                    }
                }
            }
        }
        
        return results;
    }
    
    // Function to perform search
    function performSearch() {
        const examType = examTypeSelect ? examTypeSelect.value : 'gce-a';
        const searchTerm = studentNameInput ? studentNameInput.value.trim() : '';
        
        if (!searchTerm) {
            // Show error for empty search
            if (searchResults) {
                searchResults.innerHTML = `
                    <div class="no-result">
                        <p data-i18n="students.emptySearch">Please enter a student name or ID to search.</p>
                    </div>
                `;
                // Apply translations to the newly added content
                applyTranslations(localStorage.getItem('userLanguage') || 'en');
            }
            return;
        }
        
        // Filter results based on search term (case insensitive)
        const filteredResults = resultsData.filter(student => {
            return student.examType === examType && 
                   student.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        // Display results
        displayResults(filteredResults, searchTerm);
    }
    
    // Function to display search results
    function displayResults(results, searchTerm) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            // No results found
            searchResults.innerHTML = `
                <div class="no-result">
                    <p data-i18n="students.noResults">No results found for "${searchTerm}". Please check the spelling and try again.</p>
                </div>
            `;
        } else {
            // Build results HTML
            let resultsHTML = `<h3 data-i18n="students.searchResults">Search Results</h3>`;
            
            results.forEach(student => {
                resultsHTML += `
                    <div class="result-item">
                        <div class="result-name">${student.name}</div>
                `;
                
                if (student.subjects && student.subjects.length > 0) {
                    resultsHTML += `<div class="result-details">`;
                    student.subjects.forEach(subject => {
                        resultsHTML += `
                            <div class="result-subject">
                                <span class="result-subject-name">${subject.subject}</span>
                                <span class="result-grade">${subject.grade}</span>
                            </div>
                        `;
                    });
                    resultsHTML += `</div>`;
                } else {
                    resultsHTML += `<p data-i18n="students.noSubjects">No subject details available.</p>`;
                }
                
                resultsHTML += `</div>`;
            });
            
            searchResults.innerHTML = resultsHTML;
        }
        
        // Apply translations to the newly added content
        applyTranslations(localStorage.getItem('userLanguage') || 'en');
    }
});
