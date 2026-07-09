5. TaskController.java (The Waiter)
java


@RestController
@RequestMapping("/api/tasks")
public class TaskController { ... }
The controller is the waiter that talks to the outside world (your Next.js frontend).

When your frontend asks for GET /api/tasks, this waiter goes to the Chef (TaskRepository), grabs all the tasks from the database, and brings them back to the frontend.
When your frontend sends a POST /api/tasks with a new task typed by the user, this waiter takes the order, hands it to the Chef to save it, and then tells the frontend it was successful.