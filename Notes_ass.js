const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const body = document.body;

let notes = JSON.parse(localStorage.getItem("notes")) || [];

displayNotes();

// Save a new note
saveNoteBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title === "" || content === "") return alert("Please fill both fields!");

    const newNote = {
        id: Date.now(),
        title,
        content,
        timestamp: new Date().toLocaleString()
    };

    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();

    titleInput.value = "";
    contentInput.value = "";
});

// Display all notes
function displayNotes(filteredNotes = notes) {
    notesContainer.innerHTML = "";

    filteredNotes.forEach((note) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = `note ${body.classList.contains("light-theme") ? 'light' : ''}`;

        noteDiv.innerHTML = `
      <h3 contenteditable="false">${note.title}</h3>
      <p contenteditable="false">${note.content}</p>
      <small>${note.timestamp}</small>
      <div class="note-buttons">
        <button onclick="editNote(${note.id}, this)">Edit</button>
        <button onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
        notesContainer.appendChild(noteDiv);
    });
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
}

// Edit a note
function editNote(id, btn) {
    const noteCard = btn.closest(".note");
    const titleEl = noteCard.querySelector("h3");
    const contentEl = noteCard.querySelector("p");

    if (btn.textContent === "Edit") {
        titleEl.contentEditable = true;
        contentEl.contentEditable = true;
        btn.textContent = "Save";
    } else {
        const updatedTitle = titleEl.textContent.trim();
        const updatedContent = contentEl.textContent.trim();

        notes = notes.map(note => {
            if (note.id === id) {
                return {
                    ...note,
                    title: updatedTitle,
                    content: updatedContent,
                    timestamp: new Date().toLocaleString()
                };
            }
            return note;
        });

        localStorage.setItem("notes", JSON.stringify(notes));
        displayNotes();
    }
}

// Search Notes
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = notes.filter(
        note =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
    );
    displayNotes(filtered);
});

// Theme toggle
themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");
    displayNotes();
});