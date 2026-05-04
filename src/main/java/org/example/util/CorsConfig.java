package org.example.util;

import com.sun.net.httpserver.HttpExchange;

public class CorsConfig {

    public static void apply(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void add(HttpExchange ex, String key, String value) {
        ex.getResponseHeaders().add(key, value);
    }
}
