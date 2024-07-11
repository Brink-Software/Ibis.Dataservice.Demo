namespace TestErpApp;

public class NotificationStore
{
    private readonly List<NotificationModel> _notifications = [];
    public void Add(NotificationModel notification) => _notifications.Add(notification);

    public void Clear() => _notifications.Clear();

    public IEnumerable<NotificationModel> Get() => _notifications;
}
