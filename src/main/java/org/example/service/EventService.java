package org.example.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.example.models.Event;
import org.example.util.Database;
import org.example.util.LocalDateAdapter;
import org.example.util.LocalTimeAdapter;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

public class EventService {

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .registerTypeAdapter(LocalTime.class, new LocalTimeAdapter())
            .create();

    public static boolean createEvent(Event s) {
        String sql = "INSERT INTO events (orgId, title, content, date, time, location, participants, isPinned, importancy, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, s.getOrgId());
            stmt.setString(2, s.getTitle());
            stmt.setString(3, s.getContent());
            stmt.setString(4, s.getDate().toString());
            stmt.setString(5, s.getTime().toString());
            stmt.setString(6, s.getLocation());

            String json = gson.toJson(s.getParticipants());
            stmt.setString(7, json);

            stmt.setInt(8, s.getIsPinned() != null && s.getIsPinned() ? 1 : 0);
            stmt.setString(9, s.getImportancy());
            stmt.setString(10, s.getColor());

            stmt.executeUpdate();
            return true;

        } catch (SQLException e) {
            System.out.println("Помилка при створенні події: " + e.getMessage());
            return false;
        }
    }

    public static String renderEvent(int orgId) {
        String sql = """
                SELECT * FROM events
                WHERE orgId = ?
                   OR EXISTS (
                       SELECT 1 FROM json_each(events.participants)
                       WHERE json_each.value = ?
                   );
                """;

        Map<Integer, List<Event>> map = new HashMap<>();

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, orgId);
            stmt.setInt(2, orgId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {

                    Event event = new Event();
                    event.setId(rs.getInt("id"));
                    event.setOrgId(rs.getInt("orgId"));
                    event.setTitle(rs.getString("title"));
                    event.setContent(rs.getString("content"));

                    event.setDate(LocalDate.parse(rs.getString("date")));
                    event.setTime(LocalTime.parse(rs.getString("time")));

                    event.setLocation(rs.getString("location"));
                    event.setColor(rs.getString("color"));

                    String participantsJson = rs.getString("participants");
                    List<Integer> participants = gson.fromJson(
                            participantsJson,
                            new TypeToken<List<Integer>>() {}.getType()
                    );
                    event.setParticipants(participants);

                    event.setIsPinned(rs.getInt("isPinned") == 1);
                    event.setImportancy(rs.getString("importancy"));

                    map.computeIfAbsent(event.getId(), k -> new ArrayList<>()).add(event);
                }
            }

        } catch (SQLException e) {
            System.out.println("Помилка при отриманні подій: " + e.getMessage());
        }

        return gson.toJson(map);
    }

    public static boolean deleteEvent(Event s) {
        String sql = "DELETE FROM events WHERE id = ?;";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, s.getId());
            stmt.executeUpdate();
            return true;

        } catch (SQLException e) {
            System.out.println("Помилка при видаленні події: " + e.getMessage());
            return false;
        }
    }

    public static boolean updateEvent(Event s) {
        String sql = "UPDATE events SET title = ?, content = ?, date = ?, time = ?, location = ?, participants = ?, isPinned = ?, importancy = ?, color = ? WHERE id = ?;";

        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, s.getTitle());
            stmt.setString(2, s.getContent());
            stmt.setString(3, s.getDate().toString());
            stmt.setString(4, s.getTime().toString());
            stmt.setString(5, s.getLocation());

            String json = gson.toJson(s.getParticipants());
            stmt.setString(6, json);

            stmt.setInt(7, s.getIsPinned() != null && s.getIsPinned() ? 1 : 0);
            stmt.setString(8, s.getImportancy());
            stmt.setString(9, s.getColor());

            stmt.setInt(10, s.getId());

            stmt.executeUpdate();
            return true;

        } catch (SQLException e) {
            System.out.println("Помилка при редагуванні події: " + e.getMessage());
            return false;
        }
    }
}