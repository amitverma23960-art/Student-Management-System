const API_URL = "/api/students";

const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

// Load Students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();

        studentList.innerHTML = "";

        if (students.length === 0) {
            studentList.innerHTML = "<p>No students found.</p>";
            return;
        }

        students.forEach((student) => {
            const card = document.createElement("div");
            card.className = "student-card";

            const details = document.createElement("div");
            const name = document.createElement("h3");
            name.textContent = student.name;

            const info = document.createElement("p");
            info.textContent =
                `Email: ${student.email} | Phone: ${student.phone} | Course: ${student.course} | Age: ${student.age}`;

            details.append(name, info);

            const actions = document.createElement("div");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", () => editStudent(student));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", () => deleteStudent(student._id));

            actions.append(editButton, deleteButton);
            card.append(details, actions);
            studentList.appendChild(card);
        });
    } catch (error) {
        alert("Unable to load students.");
        console.error(error);
    }
}

// Add Student
studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value.trim(),
        age: Number(document.getElementById("age").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        alert("Student added successfully!");
        studentForm.reset();
        loadStudents();
    } catch (error) {
        alert(error.message);
    }
});

// Edit Student
async function editStudent(student) {
    const name = prompt("Enter Student Name:", student.name);
    if (name === null) return;

    const email = prompt("Enter Email:", student.email);
    if (email === null) return;

    const phone = prompt("Enter Phone:", student.phone);
    if (phone === null) return;

    const course = prompt("Enter Course:", student.course);
    if (course === null) return;

    const ageInput = prompt("Enter Age:", student.age);
    if (ageInput === null) return;

    const age = Number(ageInput);

    if (!name.trim() || !email.trim() || !phone.trim() ||
        !course.trim() || !Number.isInteger(age) || age <= 0) {
        alert("Please enter valid student details.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${student._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, course, age })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        alert("Student updated successfully!");
        loadStudents();
    } catch (error) {
        alert(error.message);
    }
}

// Delete Student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        alert("Student deleted successfully!");
        loadStudents();
    } catch (error) {
        alert(error.message);
    }
}

// Initial Load
loadStudents();