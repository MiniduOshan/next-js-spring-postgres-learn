2. TaskAppApplication.java (The Manager)
java


@SpringBootApplication
public class TaskAppApplication { ... }
This is the starting point of your app. When you run mvnw spring-boot:run, this file turns on the server, connects to the database, and tells all the other files to get ready to work.