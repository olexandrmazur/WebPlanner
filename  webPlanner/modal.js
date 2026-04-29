const tasks = {
  1: {
    title: "Finish Math Homework",
    desc: "Solve exercises 1-20 from chapter 5",
    date: "2026-04-30"
  },
  2: {
    title: "Read Java Chapter",
    desc: "OOP basics and classes",
    date: "2026-05-01"
  }
};

function openTaskModal(id) {
  const task = tasks[id];

  document.getElementById("modalTitle").innerText = task.title;
  document.getElementById("modalDesc").innerText = task.desc;
  document.getElementById("modalDate").innerText = "Due: " + task.date;

  document.getElementById("taskModal").classList.remove("hidden");
}

function closeTaskModal() {
  document.getElementById("taskModal").classList.add("hidden");
}