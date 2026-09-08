package com.hospital.queue.model;

public enum PriorityLevel {
    NORMAL(1),
    SENIOR_CITIZEN(2),
    EMERGENCY(3);

    private final int rank;

    PriorityLevel(int rank) {
        this.rank = rank;
    }

    public int getRank() {
        return rank;
    }
}
