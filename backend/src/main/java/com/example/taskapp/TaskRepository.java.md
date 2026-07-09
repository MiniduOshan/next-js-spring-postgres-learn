4. TaskRepository.java (The Chef)
java


public interface TaskRepository extends JpaRepository<Task, Long> { }
This file is basically magic. By just creating this empty interface, Spring Boot automatically generates the code to save, delete, and find Tasks in the database. You don't have to write SELECT * FROM tasks or INSERT INTO tasks. The "Chef" already knows how to do all the standard database cooking.