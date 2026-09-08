package com.hospital.queue.util;

public final class AppConstants {

    private AppConstants() {}

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "20";

    // WebSocket Topics
    public static final String TOPIC_QUEUE_DEPARTMENT = "/topic/queue/department/";
    public static final String TOPIC_QUEUE_DOCTOR = "/topic/queue/doctor/";
    public static final String TOPIC_PUBLIC_DISPLAY = "/topic/public-display";
    public static final String TOPIC_USER_NOTIFICATIONS = "/topic/notifications/";

    // Event Types
    public static final String EVENT_NEXT_PATIENT_CALLED = "NEXT_PATIENT_CALLED";
    public static final String EVENT_TOKEN_SKIPPED = "TOKEN_SKIPPED";
    public static final String EVENT_APPOINTMENT_CANCELLED = "APPOINTMENT_CANCELLED";
    public static final String EVENT_QUEUE_UPDATED = "QUEUE_UPDATED";
    public static final String EVENT_DOCTOR_STATUS_CHANGED = "DOCTOR_STATUS_CHANGED";
    public static final String EVENT_PATIENT_NOTIFICATION = "PATIENT_NOTIFICATION";
    public static final String EVENT_CHECK_IN_COMPLETED = "CHECK_IN_COMPLETED";
    public static final String EVENT_CONSULTATION_STARTED = "CONSULTATION_STARTED";
    public static final String EVENT_CONSULTATION_COMPLETED = "CONSULTATION_COMPLETED";
}
