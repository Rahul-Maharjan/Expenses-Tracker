// Initial page load animation
gsap.from(".app", { opacity: 0, duration: 1 });

// Animate header and form
gsap.from(".header", {
  y: -50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
});

gsap.from(".form-section", {
  x: -100,
  opacity: 0,
  duration: 1,
  delay: 0.5,
  ease: "power2.out",
});

gsap.from(".expenses-section", {
  x: 100,
  opacity: 0,
  duration: 1,
  delay: 0.7,
  ease: "power2.out",
});

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const toggleBtn = document.getElementById("themeSwitch");
let editIndex = null;
let currentPage = 1;
const itemsPerPage = 5;

// Retrieve stored expenses or initialize empty
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Render expense list
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = expenses.slice(start, end);

  paginatedItems.forEach((expense, index) => {
    const globalIndex = start + index; // Important for correct edit/delete
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="expense-info">
              <p class="expense-title">${expense.title}</p>
              <p class="expense-amount">₹${expense.amount}</p>
              <p class="expense-date">${expense.date}</p>
            </div>
            <div class="expense-actions">
              <button class="edit-btn" onclick="startEditExpense(${globalIndex})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="delete-btn" onclick="deleteExpense(${globalIndex})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `;
    expenseList.appendChild(li);
    total += parseFloat(expense.amount);
  });

  totalAmount.textContent = expenses
    .reduce((acc, exp) => acc + parseFloat(exp.amount), 0)
    .toFixed(2);

  updatePaginationControls();
}

//update pagination
function updatePaginationControls() {
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  document.getElementById("current-page").textContent = currentPage;

  document.getElementById("prev-page").disabled = currentPage === 1;
  document.getElementById("next-page").disabled =
    currentPage === totalPages || totalPages === 0;
}

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderExpenses();
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderExpenses();
  }
});

// Delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

//Edit Function
function startEditExpense(index) {
  const expense = expenses[index];
  document.getElementById("title").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("date").value = expense.date;
  editIndex = index;
  let currentPage = 1;
  const itemsPerPage = 10;
}

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  if (title && amount && date) {
    const newExpense = { title, amount, date };

    if (editIndex !== null) {
      expenses[editIndex] = newExpense;
      editIndex = null;
    } else {
      expenses.push(newExpense);
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    form.reset();
    renderExpenses();
  }
});

// Theme Toggle Setup
document.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", storedTheme);
  toggleBtn.checked = storedTheme === "dark";

  toggleBtn.addEventListener("change", () => {
    const newTheme = toggleBtn.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  renderExpenses(); // Make sure expenses are shown after DOM loads
});
