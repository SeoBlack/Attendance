package org.example.attendancebackend.util;

import java.util.Locale;
import java.util.Set;

public final class LocaleUtil {

    public static final String DEFAULT_LOCALE = "en";
    public static final Set<String> SUPPORTED = Set.of("en", "ar", "ru");

    private LocaleUtil() {
    }

    /**
     * Maps Accept-Language (or similar) primary subtag to a supported app locale, else {@link #DEFAULT_LOCALE}.
     */
    public static String normalize(String tag) {
        if (tag == null || tag.isBlank()) {
            return DEFAULT_LOCALE;
        }
        String first = tag.split(",")[0].trim();
        if (first.isEmpty()) {
            return DEFAULT_LOCALE;
        }
        int semi = first.indexOf(';');
        if (semi >= 0) {
            first = first.substring(0, semi).trim();
        }
        String primary = first.contains("-")
                ? first.substring(0, first.indexOf('-'))
                : first;
        primary = primary.toLowerCase(Locale.ROOT);
        return SUPPORTED.contains(primary) ? primary : DEFAULT_LOCALE;
    }

    public static String resolveLocaleHeader(String acceptLanguage) {
        return normalize(acceptLanguage);
    }
}
