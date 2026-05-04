package org.example.models;

import java.time.LocalDate;

import java.time.LocalTime;
import java.util.List;

public class Event {
// Дизайнери помилуйте я в 14 раз модельку цб переписую
    private int id;
    private int orgId;
    private String title;
    private String content;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private List<Integer> participants;
    private Boolean isPinned;
    private String importancy;
    private String color;

    public Event(int orgId, String title,String content,LocalDate date,LocalTime time,String location,List<Integer> participants,String importancy,String color) {
        this.orgId = orgId;
        this.title = title;
        this.content = content;
        this.date = date;
        this.time = time;
        this.location = location;
        this.participants = participants;
        this.importancy = importancy;
        this.color = color;
    }

    public Event() {

    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public LocalTime getTime() {
        return time;
    }
    public void setTime(LocalTime time) {
        this.time = time;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public List<Integer> getParticipants() {
        return participants;
    }
    public void setParticipants(List<Integer> participants) {
        this.participants = participants;
    }
    public Boolean getIsPinned() {
        return isPinned;
    }
    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }
    public int getOrgId() {
        return orgId;
    }
    public void setOrgId(int orgId) {
        this.orgId = orgId;
    }
    public String getImportancy() {
        return importancy;
    }
    public void setImportancy(String importancy) {
        this.importancy = importancy;
    }

    public void setId(int id) {
        this.id = id;
    }
    public int getId() {
        return id;
    }
    public void setColor(String color) {
        this.color = color;
    }
    public String getColor() {
        return color;
    }
}
