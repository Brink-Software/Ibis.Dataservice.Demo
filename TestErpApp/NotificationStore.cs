using TestErpApp.Controllers;

namespace TestErpApp
{
    public class NotificationStore
    {
        private List<NotificationModel> _notifications = new List<NotificationModel>();
        public void Add(NotificationModel notification)
        {
            _notifications.Add(notification);
        }

        public IEnumerable<NotificationModel> Get()
        {
            return _notifications;
        }
    }
}
