1. page.tsx (The Dining Room)
This is the most important file in our frontend. It controls exactly what is drawn on the screen. Inside this file, we use a mix of HTML and JavaScript called JSX.

Whenever you see <div>, <form>, or <button>, that’s the physical structure of your website (the tables and chairs in the dining room).
Because it's Next.js (React), we can make this HTML "smart" by plugging JavaScript directly into it. For example, when you click the "Add Task" button, it triggers a JavaScript function handleAddTask instantly.

2. useState and useEffect (The Waiter's Notepad)
At the top of page.tsx, you'll see tools called useState and useEffect. Next.js uses these to remember things and take action:

useState: Think of this as a temporary notepad. When you type in the input box, useState remembers exactly what you typed letter-by-letter. It also remembers the current list of tasks to show on the screen.
useEffect: This is an instruction that says "As soon as the customer walks in, do this." In our app, we use useEffect to instantly fetch the list of tasks from Spring Boot the second you load the webpage.

3. fetch() (The Delivery Driver)
When you click "Add Task", the frontend doesn't talk to the database directly (it's not allowed in the pantry!). Instead, it uses a function called fetch().

fetch() is like a delivery driver on a motorcycle.
It takes your new task, drives over to http://localhost:8080/api/tasks (your Spring Boot backend), hands the task to the Waiter (TaskController.java), and waits to bring back the receipt to Next.js.