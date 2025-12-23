/**
 * Notification Utilities for Smart Notification Bar
 * Handles notifications, alerts, and system messages for Sijenggung Village Portal
 */

// Notification types
export enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
    EMERGENCY = "emergency",
    MAINTENANCE = "maintenance",
    ANNOUNCEMENT = "announcement",
    SYSTEM = "system",
}

// Notification priority levels
export enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent",
}

// Notification interface
export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    description?: string;
    actions?: NotificationAction[];
    icon?: string;
    color?: string;
    autoClose?: boolean;
    duration?: number; // in milliseconds
    persistent?: boolean;
    dismissible?: boolean;
    timestamp: number;
    expiresAt?: number;
    createdBy?: string;
    targetUsers?: string[];
    metadata?: Record<string, unknown>;
    read: boolean;
    readAt?: number;
}

// Notification action interface
export interface NotificationAction {
    id: string;
    label: string;
    action: string;
    style?: "primary" | "secondary" | "danger" | "success";
    icon?: string;
    url?: string;
    callback?: () => void;
}

// Emergency alert interface
export interface EmergencyAlert extends Notification {
    type: NotificationType.EMERGENCY;
    severity: "low" | "medium" | "high" | "critical";
    affectedAreas?: string[];
    evacuationZones?: string[];
    contactInfo?: {
        police: string;
        hospital: string;
        fire: string;
        disaster: string;
    };
    lastUpdated: number;
}

// Weather alert interface
export interface WeatherAlert extends Notification {
    type: NotificationType.WARNING;
    category: "temperature" | "rain" | "wind" | "storm" | "flood" | "drought";
    severity: "watch" | "warning" | "advisory";
    conditions: {
        temperature?: number;
        humidity?: number;
        windSpeed?: number;
        precipitation?: number;
        visibility?: number;
    };
    forecast?: string;
    precautions?: string[];
}

// System maintenance notification interface
export interface MaintenanceNotification extends Notification {
    type: NotificationType.MAINTENANCE;
    system: string;
    startTime: number;
    endTime: number;
    impact: "low" | "medium" | "high";
    affectedServices: string[];
    alternativeContact?: string;
}

// Notification preferences interface
export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    categories: {
        [key in NotificationType]: boolean;
    };
    priorities: {
        [key in NotificationPriority]: boolean;
    };
    quietHours: {
        enabled: boolean;
        start: string; // HH:mm format
        end: string; // HH:mm format
    };
    maxDailyNotifications: number;
}

// Notification storage interface
export interface NotificationStorage {
    addNotification(notification: Notification): void;
    removeNotification(id: string): void;
    markAsRead(id: string): void;
    markAllAsRead(): void;
    getNotifications(filters?: NotificationFilters): Notification[];
    getUnreadCount(): number;
    clearExpiredNotifications(): void;
}

// Notification filters interface
export interface NotificationFilters {
    type?: NotificationType[];
    priority?: NotificationPriority[];
    read?: boolean;
    startDate?: Date;
    endDate?: Date;
    searchTerm?: string;
    createdBy?: string;
}

// Default notification configurations
export const NOTIFICATION_CONFIGS = {
    [NotificationType.INFO]: {
        icon: "ℹ️",
        color: "#3b82f6",
        defaultDuration: 5000,
        autoClose: true,
    },
    [NotificationType.SUCCESS]: {
        icon: "✅",
        color: "#10b981",
        defaultDuration: 4000,
        autoClose: true,
    },
    [NotificationType.WARNING]: {
        icon: "⚠️",
        color: "#f59e0b",
        defaultDuration: 8000,
        autoClose: false,
    },
    [NotificationType.ERROR]: {
        icon: "❌",
        color: "#ef4444",
        defaultDuration: 10000,
        autoClose: false,
    },
    [NotificationType.EMERGENCY]: {
        icon: "🚨",
        color: "#dc2626",
        defaultDuration: 0, // No auto-close
        autoClose: false,
        persistent: true,
    },
    [NotificationType.MAINTENANCE]: {
        icon: "🔧",
        color: "#8b5cf6",
        defaultDuration: 0,
        autoClose: false,
        persistent: true,
    },
    [NotificationType.ANNOUNCEMENT]: {
        icon: "📢",
        color: "#064e3b",
        defaultDuration: 15000,
        autoClose: true,
    },
    [NotificationType.SYSTEM]: {
        icon: "⚙️",
        color: "#6b7280",
        defaultDuration: 6000,
        autoClose: true,
    },
};

// Priority configurations
export const PRIORITY_CONFIGS = {
    [NotificationPriority.LOW]: {
        weight: 1,
        sound: false,
        vibration: false,
    },
    [NotificationPriority.NORMAL]: {
        weight: 2,
        sound: true,
        vibration: false,
    },
    [NotificationPriority.HIGH]: {
        weight: 3,
        sound: true,
        vibration: true,
    },
    [NotificationPriority.URGENT]: {
        weight: 4,
        sound: true,
        vibration: true,
        overrideSilent: true,
    },
};

/**
 * Create a new notification
 */
export function createNotification(
    type: NotificationType,
    title: string,
    message: string,
    options: Partial<Notification> = {}
): Notification {
    const config = NOTIFICATION_CONFIGS[type];
    const id = generateNotificationId();

    return {
        id,
        type,
        priority: options.priority ?? NotificationPriority.NORMAL,
        title,
        message,
        icon: options.icon ?? config.icon,
        color: options.color ?? config.color,
        autoClose: options.autoClose ?? config.autoClose,
        duration: options.duration ?? config.defaultDuration,
        persistent: options.persistent ?? false,
        dismissible: options.dismissible ?? true,
        timestamp: Date.now(),
        read: false,
        createdBy: options.createdBy ?? "system",
        ...options,
    };
}

/**
 * Create emergency alert
 */
export function createEmergencyAlert(
    severity: "low" | "medium" | "high" | "critical",
    title: string,
    message: string,
    options: Partial<EmergencyAlert> = {}
): EmergencyAlert {
    const baseNotification = createNotification(NotificationType.EMERGENCY, title, message, {
        priority: severity === "critical" ? NotificationPriority.URGENT : NotificationPriority.HIGH,
        persistent: true,
        autoClose: false,
        ...options,
    });

    return {
        ...baseNotification,
        type: NotificationType.EMERGENCY,
        severity,
        affectedAreas: options.affectedAreas ?? [],
        evacuationZones: options.evacuationZones ?? [],
        contactInfo: options.contactInfo ?? {
            police: "112",
            hospital: "118",
            fire: "113",
            disaster: "129",
        },
        lastUpdated: Date.now(),
    };
}

/**
 * Create weather alert
 */
export function createWeatherAlert(
    category: "temperature" | "rain" | "wind" | "storm" | "flood" | "drought",
    severity: "watch" | "warning" | "advisory",
    title: string,
    message: string,
    conditions: WeatherAlert["conditions"],
    options: Partial<WeatherAlert> = {}
): WeatherAlert {
    return {
        ...createNotification(NotificationType.WARNING, title, message, {
            priority: severity === "warning" ? NotificationPriority.HIGH : NotificationPriority.NORMAL,
            ...options,
        }),
        type: NotificationType.WARNING,
        category,
        severity,
        conditions,
        forecast: options.forecast,
        precautions: options.precautions ?? [],
    };
}

/**
 * Create maintenance notification
 */
export function createMaintenanceNotification(
    system: string,
    title: string,
    message: string,
    startTime: Date,
    endTime: Date,
    impact: "low" | "medium" | "high",
    affectedServices: string[],
    options: Partial<MaintenanceNotification> = {}
): MaintenanceNotification {
    return {
        ...createNotification(NotificationType.MAINTENANCE, title, message, {
            priority: impact === "high" ? NotificationPriority.HIGH : NotificationPriority.NORMAL,
            persistent: true,
            autoClose: false,
            ...options,
        }),
        type: NotificationType.MAINTENANCE,
        system,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        impact,
        affectedServices,
        alternativeContact: options.alternativeContact,
    };
}

/**
 * Generate unique notification ID
 */
function generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if notification is expired
 */
export function isNotificationExpired(notification: Notification): boolean {
    if (!notification.expiresAt) {
        return false;
    }
    return Date.now() > notification.expiresAt;
}

/**
 * Format notification timestamp
 */
export function formatNotificationTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) {
        return "Baru saja";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
        // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} jam yang lalu`;
    } else {
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    }
}

/**
 * Local storage implementation for notifications
 */
export class LocalNotificationStorage implements NotificationStorage {
    private storageKey = "pondokrejo_notifications";

    addNotification(notification: Notification): void {
        const notifications = this.getNotifications();
        notifications.unshift(notification); // Add to beginning
        this.saveNotifications(notifications);
    }

    removeNotification(id: string): void {
        const notifications = this.getNotifications().filter((n) => n.id !== id);
        this.saveNotifications(notifications);
    }

    markAsRead(id: string): void {
        const notifications = this.getNotifications();
        const notification = notifications.find((n) => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            notification.readAt = Date.now();
            this.saveNotifications(notifications);
        }
    }

    markAllAsRead(): void {
        const notifications = this.getNotifications().map((n) => ({
            ...n,
            read: true,
            readAt: n.read ? n.readAt : Date.now(),
        }));
        this.saveNotifications(notifications);
    }

    getNotifications(filters?: NotificationFilters): Notification[] {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return [];

            let notifications: Notification[] = JSON.parse(stored);

            // Filter expired notifications
            notifications = notifications.filter((n) => !isNotificationExpired(n));

            // Apply filters
            if (filters) {
                notifications = this.applyFilters(notifications, filters);
            }

            return notifications;
        } catch {
            return [];
        }
    }

    getUnreadCount(): number {
        return this.getNotifications().filter((n) => !n.read).length;
    }

    clearExpiredNotifications(): void {
        const notifications = this.getNotifications().filter((n) => !isNotificationExpired(n));
        this.saveNotifications(notifications);
    }

    private saveNotifications(notifications: Notification[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        } catch {}
    }

    private applyFilters(notifications: Notification[], filters: NotificationFilters): Notification[] {
        return notifications.filter((notification) => {
            if (filters.type && !filters.type.includes(notification.type)) {
                return false;
            }

            if (filters.priority && !filters.priority.includes(notification.priority)) {
                return false;
            }

            if (filters.read !== undefined && notification.read !== filters.read) {
                return false;
            }

            if (filters.startDate && notification.timestamp < filters.startDate.getTime()) {
                return false;
            }

            if (filters.endDate && notification.timestamp > filters.endDate.getTime()) {
                return false;
            }

            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const searchText =
                    `${notification.title} ${notification.message} ${notification.description ?? ""}`.toLowerCase();
                if (!searchText.includes(searchLower)) {
                    return false;
                }
            }

            if (filters.createdBy && notification.createdBy !== filters.createdBy) {
                return false;
            }

            return true;
        });
    }
}

/**
 * Request notification permission from browser
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
}

/**
 * Show browser notification
 */
export function showBrowserNotification(
    title: string,
    options: NotificationOptions & { onClick?: () => void } = {}
): boolean {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return false;
    }

    try {
        const notification = new Notification(title, {
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            ...options,
        });

        if (options.onClick) {
            notification.onclick = options.onClick;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * Check if user is in quiet hours
 */
export function isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours.enabled) {
        return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return currentTime >= preferences.quietHours.start && currentTime <= preferences.quietHours.end;
}

/**
 * Check if notification should be shown based on preferences
 */
export function shouldShowNotification(notification: Notification, preferences: NotificationPreferences): boolean {
    // Check category preference
    if (!preferences.categories[notification.type]) {
        return false;
    }

    // Check priority preference
    if (!preferences.priorities[notification.priority]) {
        return false;
    }

    // Check quiet hours (unless urgent)
    if (isInQuietHours(preferences) && notification.priority !== NotificationPriority.URGENT) {
        return false;
    }

    return true;
}

/**
 * Get default notification preferences
 */
export function getDefaultNotificationPreferences(): NotificationPreferences {
    return {
        email: true,
        push: true,
        sms: false,
        inApp: true,
        categories: {
            [NotificationType.INFO]: true,
            [NotificationType.SUCCESS]: true,
            [NotificationType.WARNING]: true,
            [NotificationType.ERROR]: true,
            [NotificationType.EMERGENCY]: true,
            [NotificationType.MAINTENANCE]: true,
            [NotificationType.ANNOUNCEMENT]: true,
            [NotificationType.SYSTEM]: true,
        },
        priorities: {
            [NotificationPriority.LOW]: true,
            [NotificationPriority.NORMAL]: true,
            [NotificationPriority.HIGH]: true,
            [NotificationPriority.URGENT]: true,
        },
        quietHours: {
            enabled: false,
            start: "22:00",
            end: "07:00",
        },
        maxDailyNotifications: 50,
    };
}

/**
 * Notification manager class
 */
export class NotificationManager {
    private storage: NotificationStorage;
    private preferences: NotificationPreferences;
    private listeners: Map<string, (notification: Notification) => void> = new Map();

    constructor(storage: NotificationStorage = new LocalNotificationStorage()) {
        this.storage = storage;
        this.preferences = getDefaultNotificationPreferences();
        this.loadPreferences();
    }

    /**
     * Add notification
     */
    addNotification(notification: Notification): void {
        if (!shouldShowNotification(notification, this.preferences)) {
            return;
        }

        this.storage.addNotification(notification);
        this.notifyListeners(notification);

        // Show browser notification if supported
        if (this.preferences.push) {
            showBrowserNotification(notification.title, {
                body: notification.message,
                icon: "/favicon.ico",
                tag: notification.id,
            });
        }
    }

    /**
     * Remove notification
     */
    removeNotification(id: string): void {
        this.storage.removeNotification(id);
    }

    /**
     * Mark notification as read
     */
    markAsRead(id: string): void {
        this.storage.markAsRead(id);
    }

    /**
     * Get notifications
     */
    getNotifications(filters?: NotificationFilters): Notification[] {
        return this.storage.getNotifications(filters);
    }

    /**
     * Get unread count
     */
    getUnreadCount(): number {
        return this.storage.getUnreadCount();
    }

    /**
     * Update preferences
     */
    updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
        this.preferences = { ...this.preferences, ...newPreferences };
        this.savePreferences();
    }

    /**
     * Get preferences
     */
    getPreferences(): NotificationPreferences {
        return { ...this.preferences };
    }

    /**
     * Add event listener
     */
    addListener(id: string, callback: (notification: Notification) => void): void {
        this.listeners.set(id, callback);
    }

    /**
     * Remove event listener
     */
    removeListener(id: string): void {
        this.listeners.delete(id);
    }

    /**
     * Clear expired notifications
     */
    clearExpiredNotifications(): void {
        this.storage.clearExpiredNotifications();
    }

    private notifyListeners(notification: Notification): void {
        this.listeners.forEach((callback) => callback(notification));
    }

    private loadPreferences(): void {
        try {
            const stored = localStorage.getItem("pondokrejo_notification_preferences");
            if (stored) {
                this.preferences = { ...this.preferences, ...JSON.parse(stored) };
            }
        } catch {}
    }

    private savePreferences(): void {
        try {
            localStorage.setItem("pondokrejo_notification_preferences", JSON.stringify(this.preferences));
        } catch {}
    }
}

// Global notification manager instance
export const notificationManager = new NotificationManager();
