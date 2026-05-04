package org.example.web;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.example.service.EventService;
import org.example.util.Utility;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RenderEventHandler implements HttpHandler {
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
            int id = Utility.getInt(json, "id");
            System.out.println("id: " + id);

            String events = EventService.renderEvent(id);
            System.out.println("events: " + events);
            // Відповідь
            JsonObject response = new JsonObject();
            response.addProperty("events", events);
            Utility.sendResponse(exchange, new Gson().toJson(response), 200);

        } catch (Exception e) {
            e.printStackTrace();
            Utility.sendResponse(exchange, "{\"error\":\"Invalid JSON format or server error\"}", 400);
        }
    }
}
