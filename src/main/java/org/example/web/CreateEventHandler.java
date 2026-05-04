package org.example.web;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.example.service.EventService;
import org.example.models.Event;
import org.example.util.Utility;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CreateEventHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Дозволити CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Preflight-запит
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Перевірка на POST
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            Utility.sendResponse(exchange, "{\"error\":\"Method Not Allowed\"}", 405);
            return;
        }

        // Зчитування тіла
        String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        System.out.println("Request body: " + body);

        try {
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            int orgId = Utility.getInt(json, "id");
            String title = Utility.getString(json, "titleText");
            String content = Utility.getString(json, "contentText");
            String dateText = Utility.getString(json, "dateText");
            LocalDate date = LocalDate.parse(dateText);
            String timeText = Utility.getString(json, "timeText");
            LocalTime time = LocalTime.parse(timeText);
            String place = Utility.getString(json, "placeText");
            String participants = Utility.getString(json, "participantsText");
            String importancy = Utility.getString(json, "importancyText");
            String color = Utility.getString(json, "colorText");
            List<Integer> participantsList = Arrays.stream(participants.split(","))
                    .map(String::trim)        // прибирає пробіли, якщо є
                    .map(Integer::parseInt)   // перетворює в int
                    .collect(Collectors.toList());

            System.out.println(participantsList);

            // Вивід в консоль (для дебагу)
            System.out.println("Створюється завдання:");
            System.out.println("- організатор: " + orgId);
            System.out.println("- Назва: " + title);
            System.out.println("- Зміст: " + content);
            System.out.println("- Дата: " + date);
            System.out.println("- Час: " + time);
            System.out.println("- Місце: " + place);
            System.out.println("- Учасники: " + participants);
            System.out.println("- Важливість: " + importancy);
            System.out.println("- Колір: " + color);

            // Мінімальна перевірка (наприклад, обов'язкові поля)
            if (title == null || title.isEmpty() || content == null || content.isEmpty()) {
                Utility.sendResponse(exchange, "{\"error\":\"Missing required fields\"}", 400);
                return;
            }

            Event event = new Event(orgId,title,content,date,time,place,participantsList,importancy,color);
            boolean isCreated = EventService.createEvent(event);

            // Відповідь
            JsonObject response = new JsonObject();
            response.addProperty("isCreated", isCreated);
            Utility.sendResponse(exchange, new Gson().toJson(response), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
