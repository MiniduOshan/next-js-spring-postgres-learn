3. Task.java (The Menu Item)
java


@Entity
public class Task {
    private Long id;
    private String title;
    private boolean completed;
}
Because of the @Entity tag, Spring Boot looks at this file and says: "Ah! I need to go into PostgreSQL and create a table called 'Task' with columns for id, title, and completed." You never had to write a CREATE TABLE SQL command because this Java class is the blueprint for your database.